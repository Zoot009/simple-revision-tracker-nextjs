import { Order, Task, Status } from '@prisma/client'

// Serialized version of Order for client components (Decimal converted to number)
export type SerializedOrder = Omit<Order, 'amount'> & {
  amount: number
}

// Serialized version of OrderWithTasks for client components
export type OrderWithTasks = SerializedOrder & {
  tasks: Task[]
}

export type TaskWithOrder = Task & {
  order?: SerializedOrder
}

export interface DashboardStats {
  totalOrders: number
  activeOrders: number
  pendingTasks: number
  totalValue: number
  overdueMessages: number
}

export interface CreateOrderData {
  clientName: string
  orderId: string
  projectName: string
  amount: number
  status: Status
  meetingTime?: string
}

export interface CreateTaskData {
  description: string
  deadline: Date
  orderId?: string
}

export interface MeetingAction {
  orderId: string
  action: 'mark_done' | 'skip'
}

export type { Task, Status }

// Keep the original Prisma types for server-side use
export type PrismaOrder = Order
export type PrismaOrderWithTasks = Order & { tasks: Task[] }