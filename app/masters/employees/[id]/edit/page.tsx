'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const EmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
})

export default function EditEmployeePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(EmployeeSchema),
  })

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees/${id}`)
        const result = await res.json()
        if (result.success) {
          reset(result.data)
        } else {
          setError('Failed to load employee')
        }
      } catch (err) {
        setError('Failed to fetch employee')
      } finally {
        setIsLoading(false)
      }
    }
    fetchEmployee()
  }, [id, reset])

  async function onSubmit(data: any) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (result.success) {
        router.push('/masters/employees')
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
      <Link href="/masters/employees" className="flex items-center gap-2 text-blue-600 hover:text-blue-900">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-6">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input {...register('name')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input {...register('email')} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role *</label>
              <input {...register('role')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} placeholder="e.g., Manager, Cashier, Accountant" />
              {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input {...register('phone')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={isSaving} />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <Link href="/masters/employees" className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
