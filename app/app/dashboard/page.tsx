export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Hardware Shop Management System</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value="Rs. 0" color="bg-blue-50" />
        <StatCard title="Stock Items" value="0" color="bg-green-50" />
        <StatCard title="Pending Orders" value="0" color="bg-yellow-50" />
        <StatCard title="Outstanding" value="Rs. 0" color="bg-red-50" />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600 text-center py-8">No recent activity</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton title="Create Sales Invoice" href="/app/sales/retail" />
            <ActionButton title="Create Purchase Order" href="/app/purchase/orders" />
            <ActionButton title="Record Payment" href="/app/sales/payments" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={`${color} rounded-lg p-6`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}

function ActionButton({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-900 font-medium"
    >
      {title}
    </a>
  )
}