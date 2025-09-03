'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format, addDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { OrderWithTasks } from '@/types'
import { toast } from 'sonner'

const formSchema = z.object({
  description: z.string().min(1, 'Task description is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  orderId: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AddTaskFormProps {
  orders: OrderWithTasks[]
  onSuccess?: () => void
}

export function AddTaskForm({ orders, onSuccess }: AddTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      deadline: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
      orderId: undefined, // Changed from '' to undefined
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: data.description,
          deadline: new Date(data.deadline).toISOString(),
          orderId: data.orderId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      toast.success("Task created successfully")

      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to create task") // Fixed: was showing success on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No client (General task)</SelectItem>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.clientName} - {order.orderId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter task description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Adding...' : 'Add Task'}
        </Button>
      </form>
    </Form>
  )
}