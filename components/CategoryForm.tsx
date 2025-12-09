'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCategorySchema } from '@/lib/validation'
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import Link from 'next/link'

interface CategoryFormProps {
  initialData?: {
    id: string
    name: string
    description?: string
  }
  isEditing?: boolean
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  async function onSubmit(data: any) {
    setIsLoading(true)
    setError(null)
    setFieldErrors({})
    setSuccess(false)

    try {
      // Validate that name is not empty
      if (!data.name || data.name.trim() === '') {
        setFieldErrors({ name: 'Category name is required' })
        setIsLoading(false)
        return
      }

      const method = isEditing && initialData ? 'PUT' : 'POST'
      const url = isEditing && initialData
        ? `/api/categories/${initialData.id}`
        : '/api/categories'

      const payload = {
        name: data.name.trim(),
        description: data.description ? data.description.trim() : null,
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!result.success) {
        // Handle validation errors from API
        if (result.errors && typeof result.errors === 'object') {
          setFieldErrors(result.errors)
        } else {
          setError(result.error || 'An error occurred while saving')
        }
        setIsLoading(false)
        return
      }

      // Show success message
      setSuccess(true)

      // Redirect after 1 second
      setTimeout(() => {
        router.push('/app/masters/categories')
        router.refresh()
      }, 1000)
    } catch (err) {
      console.error('Form submission error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/app/masters/categories"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 transition font-medium"
        >
          <ArrowLeft size={20} />
          Back to Categories
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing
              ? 'Update the category information below'
              : 'Add a new product category to your system'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-in">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Success!</p>
              <p className="text-green-700 text-sm">
                {isEditing ? 'Category updated successfully' : 'Category created successfully'}. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Category Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
              Category Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="name"
              {...register('name', {
                required: 'Category name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Name cannot exceed 100 characters',
                },
              })}
              type="text"
              placeholder="e.g., Hardware, Tools, Safety Equipment"
              disabled={isLoading || success}
              className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none ${
                errors.name || fieldErrors.name
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {(errors.name || fieldErrors.name) && (
              <div className="mt-2 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm font-medium">
                  {errors.name?.message || fieldErrors.name}
                </p>
              </div>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Enter a unique name for this product category
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
              Description
              <span className="text-gray-500 ml-1">(Optional)</span>
            </label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              })}
              placeholder="Add details about this category... e.g., types of products included, special notes"
              disabled={isLoading || success}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none resize-none ${
                errors.description || fieldErrors.description
                  ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500'
              }`}
            />
            {(errors.description || fieldErrors.description) && (
              <div className="mt-2 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm font-medium">
                  {errors.description?.message || fieldErrors.description}
                </p>
              </div>
            )}
            <p className="text-gray-500 text-xs mt-2">
              Provide additional information about this category (max 500 characters)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || success}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                isLoading || success
                  ? 'bg-gray-400 text-white cursor-not-allowed opacity-75'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  {isEditing ? 'Updated!' : 'Created!'}
                </>
              ) : (
                <>
                  {isEditing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>

            <Link
              href="/app/masters/categories"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition ${
                isLoading || success ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-100 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> Category names should be clear and descriptive. Examples: "Hardware", "Electrical", "Plumbing", "Tools", "Safety Equipment"
          </p>
        </div>
      </div>
    </div>
  )
}
