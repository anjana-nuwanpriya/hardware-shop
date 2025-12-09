'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Warehouse,
  FileText,
  Settings,
  ChevronDown,
  Home,
  Layers,
  TrendingUp,
  Truck,
} from 'lucide-react'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMenu, setExpandedMenu] = useState<string | null>('masters')
  const pathname = usePathname()

  const isActive = (path: string) => pathname.includes(path)

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/app/dashboard',
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
        { label: 'Purchase Orders', href: '/app/purchase/orders' },
        { label: 'GRN', href: '/app/purchase/grn' },
        { label: 'Returns', href: '/app/purchase/returns' },
        { label: 'Payments', href: '/app/purchase/payments' },
      ],
    },
    {
      icon: ShoppingCart,
      label: 'Sales',
      submenu: [
        { label: 'Sales Retail', href: '/app/sales/retail' },
        { label: 'Sales Wholesale', href: '/app/sales/wholesale' },
        { label: 'Returns', href: '/app/sales/returns' },
        { label: 'Payments', href: '/app/sales/payments' },
      ],
    },
    {
      icon: Warehouse,
      label: 'Stock',
      submenu: [
        { label: 'Stock Report', href: '/app/stock/report' },
        { label: 'Transfers', href: '/app/stock/transfers' },
        { label: 'Adjustments', href: '/app/stock/adjustments' },
      ],
    },
    {
      icon: FileText,
      label: 'Reports',
      submenu: [
        { label: 'Sales Report', href: '/app/reports/sales' },
        { label: 'Stock Report', href: '/app/reports/stock' },
        { label: 'Receivables', href: '/app/reports/receivables' },
        { label: 'Payables', href: '/app/reports/payables' },
      ],
    },
    {
      icon: Settings,
      label: 'Settings',
      submenu: [
        { label: 'Company', href: '/app/settings/company' },
        { label: 'Users', href: '/app/settings/users' },
        { label: 'Backup', href: '/app/settings/backup' },
      ],
    },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        } overflow-y-auto z-30`}
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
                    {isOpen && (
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
                    {isOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && isOpen && (
                  <div className="mt-1 space-y-1 pl-4">
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

      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-20'}`} />
    </>
  )
}
