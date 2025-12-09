'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, Plus, Search, AlertCircle, Package, AlertTriangle } from 'lucide-react'

interface Item {
  id: string
  code: string
  name: string
  category_id?: string
  unit?: string
  reorder_level?: number
  allow_negative_stock?: boolean
  created_at: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    setError(null)
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/categories')
      ])

      const itemsResult = await itemsRes.json()
      const categoriesResult = await categoriesRes.json()

      if (itemsResult.success) {
        setItems(itemsResult.data)
      } else {
        setError('Failed to fetch items')
      }

      if (categoriesResult.success) {
        const categoryMap = new Map()
        categoriesResult.data.forEach((cat: any) => {
          categoryMap.set(cat.id, cat.name)
        })
        setCategories(categoryMap)
      }
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        setItems(items.filter((i) => i.id !== id))
      } else {
        alert('Failed to delete item')
      }
    } catch (err) {
      alert('An error occurred while deleting')
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredItems = items.filter((item) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Items</h1>
          <p className="text-gray-600 mt-1">Manage product inventory</p>
        </div>
        <Link
          href="/masters/items/create"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} /> Add Item
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search items by code or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No items found' : 'No items yet'}
            </p>
            {!searchTerm && (
              <Link
                href="/masters/items/create"
                className="text-blue-600 hover:text-blue-900 mt-2 inline-block"
              >
                Add the first item →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reorder Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Allow Negative</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.code}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {categories.get(item.category_id || '') || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{item.unit || '-'}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {item.reorder_level && item.reorder_level > 0 ? (
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={14} className="text-orange-500" />
                        {item.reorder_level}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {item.allow_negative_stock ? (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/masters/items/${item.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded transition flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deleteLoading === item.id}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> {deleteLoading === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {!isLoading && items.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredItems.length} of {items.length} items
        </div>
      )}
    </div>
  )
}
