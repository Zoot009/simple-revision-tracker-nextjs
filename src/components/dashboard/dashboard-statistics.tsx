import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalOrders: number
  activeOrders: number
  pendingTasks: number
  totalValue: number
  overdueMessages: number
}

interface DashboardStatisticsProps {
  stats: DashboardStats
}

export function DashboardStatistics({ stats }: DashboardStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {stats.totalOrders}
        </div>
        <div className="text-gray-600">Total Orders</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {stats.activeOrders}
        </div>
        <div className="text-gray-600">Active Orders</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {stats.pendingTasks}
        </div>
        <div className="text-gray-600">Pending Tasks</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {formatCurrency(stats.totalValue)}
        </div>
        <div className="text-gray-600">Total Value</div>
      </div>
    </div>
  )
}