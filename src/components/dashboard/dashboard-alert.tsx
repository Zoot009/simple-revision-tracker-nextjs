import { AlertTriangle } from 'lucide-react'

interface DashboardAlertProps {
  overdueCount: number
}

export function DashboardAlert({ overdueCount }: DashboardAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-md animate-pulse">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p className="font-medium">
          ⚠️ You have {overdueCount} overdue meeting{overdueCount > 1 ? 's' : ''} that need attention!
        </p>
      </div>
    </div>
  )
}