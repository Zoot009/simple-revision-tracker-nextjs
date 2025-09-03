import { Order, Task, Status } from '@prisma/client'

export type OrderWithTasks = Order & {
  tasks: Task[]
}

export type TaskWithOrder = Task & {
  order?: Order
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

export type { Order, Task, Status }