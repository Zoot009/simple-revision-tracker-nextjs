import { prisma } from '@/lib/prisma'
import { DashboardAlert } from '@/components/dashboard/dashboard-alert'
import { DashboardStatistics } from '@/components/dashboard/dashboard-statistics'
import { AddOrderForm } from '@/components/orders/add-order-form'
import { MeetingsSection } from '@/components/dashboard/meetings-section'
import { TasksSection } from '@/components/dashboard/tasks-section'
import { OrdersSection } from '@/components/dashboard/orders-section'
import { format } from 'date-fns'

async function getDashboardData() {
  const [orders, tasks] = await Promise.all([
    prisma.order.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.task.findMany({
      where: { completed: false },
      include: { order: true },
      orderBy: { deadline: 'asc' },
      take: 20
    })
  ])

  const currentTime = new Date()
  const today = format(currentTime, 'yyyy-MM-dd')
  
  let overdueMessages = 0
  orders.forEach(order => {
    if (order.meetingTime && 
        (order.lastMeetingDate?.toDateString() !== currentTime.toDateString() || !order.meetingDoneToday)) {
      const [hours, minutes] = order.meetingTime.split(':').map(Number)
      const meetingTime = new Date(currentTime)
      meetingTime.setHours(hours, minutes, 0, 0)
      
      const thirtyMinutesLater = new Date(meetingTime.getTime() + 30 * 60 * 1000)
      if (currentTime > thirtyMinutesLater) {
        overdueMessages++
      }
    }
  })

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status === 'ACTIVE').length,
    pendingTasks: tasks.length,
    totalValue: orders.reduce((sum, order) => sum + Number(order.amount), 0),
    overdueMessages
  }

  return { orders, tasks, stats }
}

export default async function DashboardPage() {
  const { orders, tasks, stats } = await getDashboardData()

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Simple Revision Tracker</h1>
        <p className="text-gray-600 mt-2">Manage your revision orders, meetings, and tasks</p>
      </div>

      {stats.overdueMessages > 0 && (
        <DashboardAlert overdueCount={stats.overdueMessages} />
      )}

      <DashboardStatistics stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
           Add New Order
        </h2>
        <AddOrderForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MeetingsSection orders={orders} />
        <TasksSection tasks={tasks} orders={orders} />
      </div>

      <OrdersSection orders={orders} />
    </div>
  )
}