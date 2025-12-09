'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

const menuItems = [
  {
    section: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/app/dashboard' },
    ],
  },
  {
    section: 'Masters',
    items: [
      { icon: Users, label: 'Suppliers', href: '/app/masters/suppliers' },
      { icon: Users, label: 'Customers', href: '/app/masters/customers' },
      { icon: Package, label: 'Items', href: '/app/masters/items' },
    ],
  },
  {
    section: 'Purchase',
    items: [
      { icon: ShoppingCart, label: 'Purchase Orders', href: '/app/purchase/orders' },
      { icon: ShoppingCart, label: 'GRN', href: '/app/purchase/grn' },
      { icon: ShoppingCart, label: 'Payments', href: '/app/purchase/payments' },
    ],
  },
  {
    section: 'Sales',
    items: [
      { icon: ShoppingCart, label: 'Sales Retail', href: '/app/sales/retail' },
      { icon: ShoppingCart, label: 'Sales Wholesale', href: '/app/sales/wholesale' },
      { icon: ShoppingCart, label: 'Payments', href: '/app/sales/payments' },
    ],
  },
  {
    section: 'Stock',
    items: [
      { icon: Package, label: 'Transactions', href: '/app/stock/transactions' },
      { icon: Package, label: 'Adjustments', href: '/app/stock/adjustments' },
    ],
  },
  {
    section: 'Reports',
    items: [
      { icon: BarChart3, label: 'Sales Report', href: '/app/reports/sales' },
      { icon: BarChart3, label: 'Receivables', href: '/app/reports/receivables' },
      { icon: BarChart3, label: 'Payables', href: '/app/reports/payables' },
    ],
  },
]

export default function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col h-screen`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {isOpen && <h1 className="font-bold text-lg">HWMS</h1>}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuItems.map((section) => (
            <div key={section.section}>
              {isOpen && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                      title={item.label}
                    >
                      <Icon size={20} />
                      {isOpen && <span className="text-sm">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/app/settings"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition"
            title="Settings"
          >
            <Settings size={20} />
            {isOpen && <span className="text-sm">Settings</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}