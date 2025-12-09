'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit2, Plus, Search, AlertCircle, Users, Mail, Phone } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/employees')
      const result = await res.json()
      if (result.success) {
        setEmployees(result.data)
      } else {
        setError('Failed to fetch employees')
      }
    } catch (err) {
      setError('An error occurred while fetching employees')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return

    setDeleteLoading(id)
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        setEmployees(employees.filter((e) => e.id !== id))
      } else {
        alert('Failed to delete employee')
      }
    } catch (err) {
      alert('An error occurred while deleting')
    } finally {
      setDeleteLoading(null)
    }
  }

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'manager': 'bg-red-100 text-red-800',
      'cashier': 'bg-blue-100 text-blue-800',
      'accountant': 'bg-purple-100 text-purple-800',
      'staff': 'bg-green-100 text-green-800',
    }
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Link
          href="/masters/employees/create"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-medium"
        >
          <Plus size={20} /> Add Employee
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
          placeholder="Search employees by name, email, role..."
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
            <p className="text-gray-600 mt-4">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center">
            <Users size={40} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              {searchTerm ? 'No employees found' : 'No employees yet'}
            </p>
            {!searchTerm && (
              <Link
                href="/masters/employees/create"
                className="text-blue-600 hover:text-blue-900 mt-2 inline-block"
              >
                Add the first employee →
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Mail size={14} /> {employee.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {employee.phone ? (
                      <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Phone size={14} /> {employee.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/masters/employees/${employee.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-3 py-1 rounded transition flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => deleteEmployee(employee.id)}
                      disabled={deleteLoading === employee.id}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> {deleteLoading === employee.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {!isLoading && employees.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      )}
    </div>
  )
}
