'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateItemSchema } from '@/lib/validation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(CreateItemSchema),
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemRes, categoriesRes] = await Promise.all([
          fetch(`/api/items/${id}`),
          fetch('/api/categories')
        ])

        const itemResult = await itemRes.json()
        const categoriesResult = await categoriesRes.json()

        if (itemResult.success) {
          reset(itemResult.data)
        }

        if (categoriesResult.success) {
          setCategories(categoriesResult.data)
        }
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, reset])

  async function onSubmit(data: any) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        router.push('/app/masters/items')
        router.refresh()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <Link href="/app/masters/items" className="flex items-center gap-2 text-blue-600 hover:text-blue-900">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Code *</label>
              <input {...register('code')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
              {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input {...register('name')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select {...register('category_id')} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Unit *</label>
              <input {...register('unit')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} placeholder="e.g., pcs, kg, box" />
              {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea {...register('description')} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} disabled={isSaving} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reorder Level</label>
              <input {...register('reorder_level', { valueAsNumber: true })} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input {...register('allow_negative_stock')} type="checkbox" className="w-4 h-4" disabled={isSaving} />
                <span className="text-sm font-medium">Allow Negative Stock</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <Link href="/app/masters/items" className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
