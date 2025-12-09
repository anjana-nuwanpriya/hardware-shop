'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, Plus, Search, AlertCircle, Mail, Phone, Tag } from 'lucide-react'

interface Customer {
  id: string
  code: string
  name: string
  customer_type?: string
  email?: string
  phone?: string
  city?: string
  created_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/customers')
      const result = await res.json()
      if (result.success) {
        setCustomers(result.data)
      } else {
        setError('Failed to fetch customers')
      }
    } catch (err) {
      setError('An error occurred while fetching customers')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCustomer(id: string) {
    if (!confirm('Are you sure you want to delete this customer?')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        setCustomers(customers.filter((c) => c.id !== id))
      } else {
        alert('Failed to delete customer')
      }
    } catch (err) {
      alert('An error occurred while deleting')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'retail':
        return 'bg-blue-100 text-blue-800'
      case 'wholesale':
        return 'bg-purple-100 text-purple-800'
      case 'distribution':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCustomers = customers.filter((cust) =>
    cust.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Link
          href="/app/masters/customers/create"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} /> Add Customer
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
          placeholder="Search customers by name, code, email..."
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
            <p className="text-gray-600 mt-4">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No customers found' : 'No customers yet'}
            </p>
            {!searchTerm && (
              <Link
                href="/app/masters/customers/create"
                className="text-blue-600 hover:text-blue-900 mt-2 inline-block"
              >
                Add the first customer →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.code}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{customer.name}</td>
                  <td className="px-6 py-4">
                    {customer.customer_type && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(customer.customer_type)}`}>
                        {customer.customer_type.charAt(0).toUpperCase() + customer.customer_type.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Mail size={14} /> {customer.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {customer.phone ? (
                      <a href={`tel:${customer.phone}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Phone size={14} /> {customer.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/app/masters/customers/${customer.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded transition flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      disabled={deleteLoading === customer.id}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> {deleteLoading === customer.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {!isLoading && customers.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      )}
    </div>
  )
}
