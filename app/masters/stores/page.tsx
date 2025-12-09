'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, Plus, Search, AlertCircle, MapPin, Phone, Mail } from 'lucide-react'

interface Store {
  id: string
  code: string
  name: string
  address?: string
  phone?: string
  email?: string
  created_at: string
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  async function fetchStores() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stores')
      const result = await res.json()
      if (result.success) {
        setStores(result.data)
      } else {
        setError('Failed to fetch stores')
      }
    } catch (err) {
      setError('An error occurred while fetching stores')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteStore(id: string) {
    if (!confirm('Are you sure you want to delete this store?')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/stores/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        setStores(stores.filter((s) => s.id !== id))
      } else {
        alert('Failed to delete store')
      }
    } catch (err) {
      alert('An error occurred while deleting')
    } finally {
      setDeleteLoading(null)
    }
  }

  const filteredStores = stores.filter((store) =>
    store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
          <p className="text-gray-600 mt-1">Manage your store locations</p>
        </div>
        <Link
          href="/masters/stores/create"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} /> Add Store
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
          placeholder="Search stores by code, name, address..."
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
            <p className="text-gray-600 mt-4">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No stores found' : 'No stores yet'}
            </p>
            {!searchTerm && (
              <Link
                href="/masters/stores/create"
                className="text-blue-600 hover:text-blue-900 mt-2 inline-block"
              >
                Add the first store →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{store.code}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{store.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm flex items-start gap-1">
                    {store.address ? (
                      <>
                        <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{store.address}</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {store.phone ? (
                      <a href={`tel:${store.phone}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Phone size={14} /> {store.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {store.email ? (
                      <a href={`mailto:${store.email}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Mail size={14} /> {store.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/masters/stores/${store.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded transition flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteStore(store.id)}
                      disabled={deleteLoading === store.id}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> {deleteLoading === store.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {!isLoading && stores.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredStores.length} of {stores.length} stores
        </div>
      )}
    </div>
  )
}
