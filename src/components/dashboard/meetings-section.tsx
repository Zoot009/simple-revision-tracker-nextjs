'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { formatTime } from '@/lib/utils'
import type { OrderWithTasks } from '@/types'
import { toast } from 'sonner'

interface MeetingsSectionProps {
  orders: OrderWithTasks[]
}

export function MeetingsSection({ orders }: MeetingsSectionProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleMeetingAction = async (orderId: string, action: 'mark_done' | 'skip') => {
    setLoadingActions(prev => ({ ...prev, [orderId]: true }))

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update meeting')
      }

      toast.success(action === "mark_done" ? 'Meeting marked as completed' : 'Meeting skipped for today')

      router.refresh()
    } catch (err) {
      console.error('Failed to update meeting:', err)
      toast.error('Failed to update meeting')
    } finally {
      setLoadingActions(prev => ({ ...prev, [orderId]: false }))
    }
  }

  const meetingsWithSchedule = orders.filter(order => order.meetingTime)
  const currentTime = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Today&apos;s Meetings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {meetingsWithSchedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No meetings scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetingsWithSchedule.map((order) => {
              const isCompleted = order.lastMeetingDate?.toDateString() === currentTime.toDateString() && order.meetingDoneToday
              const [hours, minutes] = order.meetingTime!.split(':').map(Number)
              const meetingTime = new Date(currentTime)
              meetingTime.setHours(hours, minutes, 0, 0)
              
              const thirtyMinutesLater = new Date(meetingTime.getTime() + 30 * 60 * 1000)
              const isOverdue = currentTime > thirtyMinutesLater && !isCompleted

              return (
                <div
                  key={order.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : isOverdue
                      ? 'bg-red-50 border-red-200 animate-pulse'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.clientName}</h4>
                      <p className="text-sm text-gray-600">
                        {order.orderId} • {order.projectName}
                      </p>
                    </div>
                    <Badge variant={isCompleted ? 'default' : 'secondary'}>
                      <Clock className="h-3 w-3 mr-1" />
                      {order.meetingTime!}
                    </Badge>
                  </div>

                  {isOverdue && !isCompleted && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Meeting overdue by more than 30 minutes!</span>
                    </div>
                  )}

                  {isCompleted ? (
                    <div className="text-center py-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <span className="text-sm text-green-700 font-medium">Meeting Completed Today</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMeetingAction(order.id, 'mark_done')}
                        disabled={loadingActions[order.id]}
                        className="flex-1"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Done
                      </Button>
                      <Button
                        onClick={() => handleMeetingAction(order.id, 'skip')}
                        disabled={loadingActions[order.id]}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Skip Today
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}