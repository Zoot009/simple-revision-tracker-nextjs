import { z } from 'zod'

export const createOrderSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  projectName: z.string().min(1, 'Project name is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['ACTIVE', 'WAITING', 'COMPLETED']),
  meetingTime: z.string().optional(),
})

export const createTaskSchema = z.object({
  description: z.string().min(1, 'Task description is required'),
  deadline: z.string().datetime('Invalid deadline format'),
  orderId: z.string().optional(),
})

export const updateTaskSchema = z.object({
  completed: z.boolean().optional(),
  description: z.string().min(1).optional(),
  deadline: z.string().datetime().optional(),
})

export const meetingActionSchema = z.object({
  orderId: z.string(),
  action: z.enum(['mark_done', 'skip']),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type MeetingActionInput = z.infer<typeof meetingActionSchema>