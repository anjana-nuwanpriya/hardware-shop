'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User, ChevronDown, Bell, Search, Menu, X, LayoutDashboard, Package, Users, ShoppingCart, DollarSign, Warehouse, FileText, Layers, Truck } from 'lucide-react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('masters')
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname.includes(path)

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
      submenu: [],
    },
    {
      icon: Layers,
      label: 'Masters',
      submenu: [
        { label: 'Categories', href: '/masters/categories' },
        { label: 'Suppliers', href: '/masters/suppliers' },
        { label: 'Customers', href: '/masters/customers' },
        { label: 'Items', href: '/masters/items' },
        { label: 'Stores', href: '/masters/stores' },
        { label: 'Employees', href: '/masters/employees' },
      ],
    },
    {
      icon: Truck,
      label: 'Purchase',
      submenu: [
        { label: 'Purchase Orders', href: '#' },
        { label: 'GRN', href: '#' },
        { label: 'Returns', href: '#' },
        { label: 'Payments', href: '#' },
      ],
    },
    {
      icon: ShoppingCart,
      label: 'Sales',
      submenu: [
        { label: 'Sales Retail', href: '#' },
        { label: 'Sales Wholesale', href: '#' },
        { label: 'Returns', href: '#' },
        { label: 'Payments', href: '#' },
      ],
    },
    {
      icon: Warehouse,
      label: 'Stock',
      submenu: [
        { label: 'Stock Report', href: '#' },
        { label: 'Transfers', href: '#' },
        { label: 'Adjustments', href: '#' },
      ],
    },
    {
      icon: FileText,
      label: 'Reports',
      submenu: [
        { label: 'Sales Report', href: '#' },
        { label: 'Stock Report', href: '#' },
        { label: 'Receivables', href: '#' },
        { label: 'Payables', href: '#' },
      ],
    },
    {
      icon: Settings,
      label: 'Settings',
      submenu: [
        { label: 'Company', href: '#' },
        { label: 'Users', href: '#' },
        { label: 'Backup', href: '#' },
      ],
    },
  ]

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    }
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">HS</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-lg text-gray-900">Hardware Shop</p>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products, suppliers..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">U</span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">User</span>
                  <ChevronDown size={18} className={`transition ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">user@example.com</p>
                    </div>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-16 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gray-900 text-white overflow-y-auto transition-all duration-300 z-30 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const hasSubmenu = item.submenu.length > 0
              const isExpanded = expandedMenu === item.label
              const isItemActive = hasSubmenu
                ? item.submenu.some(sub => isActive(sub.href))
                : isActive(item.href)

              return (
                <div key={item.label}>
                  {hasSubmenu ? (
                    <button
                      onClick={() =>
                        setExpandedMenu(isExpanded ? null : item.label)
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isItemActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {item.label}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`transition ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isItemActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubmenu && isExpanded && sidebarOpen && (
                    <div className="mt-1 space-y-1 pl-4 border-l border-gray-700">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                            isActive(subitem.href)
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}