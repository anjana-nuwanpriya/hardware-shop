'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateItemSchema } from '@/lib/validation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateItemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(CreateItemSchema),
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        const result = await res.json()
        if (result.success) {
          setCategories(result.data)
        }
      } catch (err) {
        setError('Failed to fetch categories')
      } finally {
        setIsFetching(false)
      }
    }
    fetchCategories()
  }, [])

  async function onSubmit(data: any) {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!result.success) {
        setError(result.error || 'An error occurred')
        return
      }

      router.push('/app/masters/items')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="p-6">Loading categories...</div>
  }

  return (
    <div className="space-y-6">
      <Link
        href="/app/masters/items"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create Item</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Code *</label>
              <input
                {...register('code')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., ITEM001"
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                {...register('category_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unit *</label>
              <input
                {...register('unit')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., pcs, kg, box, bag"
                disabled={isLoading}
              />
              {errors.unit && (
                <p className="text-red-600 text-sm mt-1">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Item description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reorder Level</label>
              <input
                {...register('reorder_level', { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('allow_negative_stock')}
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">Allow Negative Stock</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating...' : 'Create Item'}
            </button>
            <Link
              href="/app/masters/items"
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
