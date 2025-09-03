'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddTaskForm } from '@/components/tasks/add-task-form'
import type { TaskWithOrder, OrderWithTasks } from '@/types'
import { toast } from 'sonner'

interface TasksSectionProps {
  tasks: TaskWithOrder[]
  orders: OrderWithTasks[]
}

export function TasksSection({ tasks, orders }: TasksSectionProps) {
  const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  const handleCompleteTask = async (taskId: string) => {
    setLoadingTasks(prev => ({ ...prev, [taskId]: true }))

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete task')
      }

     toast.success("Task marked as completed")
     
      router.refresh()
    } catch (error) {
      toast.error("Failed to complete task")
   
    } finally {
      setLoadingTasks(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date()
    const timeDiff = deadline.getTime() - now.getTime()
    
    if (timeDiff <= 0) return 'OVERDUE'
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`
    } else {
      return 'Due soon'
    }
  }

  const isUrgent = (deadline: Date) => {
    const now = new Date()
    const timeDiff = deadline.getTime() - now.getTime()
    return timeDiff < 86400000 // Less than 24 hours
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            What's Next
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <AddTaskForm 
              orders={orders} 
              onSuccess={() => {
                setShowAddForm(false)
                router.refresh()
              }}
            />
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const timeRemaining = getTimeRemaining(task.deadline)
              const urgent = isUrgent(task.deadline)

              return (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 transition-all ${
                    urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {task.order?.clientName || 'General Task'}
                        </h4>
                        {urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          {format(task.deadline, 'MMM d, h:mm a')}
                        </span>
                        <span className={timeRemaining === 'OVERDUE' ? 'text-red-600 font-medium' : ''}>
                          {timeRemaining === 'OVERDUE' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                          {timeRemaining}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={loadingTasks[task.id]}
                      size="sm"
                      className="ml-4 min-w-[32px] h-8 w-8 p-0"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}