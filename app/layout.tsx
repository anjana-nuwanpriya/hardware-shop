import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hardware Shop Management System',
  description: 'Complete ERP for Sri Lankan hardware retailers',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}