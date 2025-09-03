'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Folder, Trash2, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatTime } from '@/lib/utils'
import type { OrderWithTasks } from '@/types'
import { toast } from 'sonner'

interface OrdersSectionProps {
  orders: OrderWithTasks[]
}

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  WAITING: 'bg-yellow-100 text-yellow-800', 
  COMPLETED: 'bg-blue-100 text-blue-800'
}

export function OrdersSection({ orders }: OrdersSectionProps) {
  const [loadingDeletes, setLoadingDeletes] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleDeleteOrder = async (orderId: string, orderName: string) => {
    if (!confirm(`Delete order "${orderName}" and all associated tasks?`)) {
      return
    }

    setLoadingDeletes(prev => ({ ...prev, [orderId]: true }))

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete order')
      }

      toast.success("Order deleted successfully")

      router.refresh()
    } catch (err) {
      console.error('Failed to delete order:', err)
      toast.error("Failed to delete order")
    } finally {
      setLoadingDeletes(prev => ({ ...prev, [orderId]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          All Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {order.clientName}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {order.orderId} • {order.projectName}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className={statusColors[order.status]}>
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </Badge>
                      {order.meetingTime && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Daily Meeting: {formatTime(order.meetingTime)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600 mb-2">
                      {formatCurrency(Number(order.amount))}
                    </div>
                    <Button
                      onClick={() => handleDeleteOrder(order.id, order.clientName)}
                      disabled={loadingDeletes[order.id]}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                {order.tasks.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Tasks ({order.tasks.length})
                    </h4>
                    <div className="space-y-2">
                      {order.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex justify-between items-center py-2 px-3 bg-white rounded text-sm ${
                            task.completed ? 'opacity-60 line-through' : ''
                          }`}
                        >
                          <span className="flex-1">{task.description}</span>
                          <span className="text-gray-500 ml-4">
                            {task.completed ? (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completed
                              </span>
                            ) : (
                              format(task.deadline, 'MMM d')
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}