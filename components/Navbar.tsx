'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logoutUser } from '@/lib/auth'
import { Menu, LogOut, Settings, User } from 'lucide-react'

interface NavbarProps {
  user?: any
  onSidebarToggle?: () => void
}

export default function Navbar({ user, onSidebarToggle }: NavbarProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const result = await logoutUser()
    if (!result.error) {
      router.push('/auth/login')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Left side - Toggle and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
            Hardware Shop
          </h1>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <User size={20} />
              <span className="hidden sm:inline text-sm font-medium">
                {user?.email || 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <MenuItem icon={<Settings size={18} />} label="Settings" href="#" />
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function MenuItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm font-medium"
    >
      {icon}
      {label}
    </a>
  )
}