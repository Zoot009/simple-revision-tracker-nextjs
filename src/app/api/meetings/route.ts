import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const meetingActionSchema = z.object({
  orderId: z.string(),
  action: z.enum(['mark_done', 'skip']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, action } = meetingActionSchema.parse(body)

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const today = new Date()
    const meetingDone = action === 'mark_done'

    await prisma.order.update({
      where: { id: orderId },
      data: {
        meetingDoneToday: meetingDone,
        lastMeetingDate: today,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating meeting:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}