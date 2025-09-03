import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createOrderSchema = z.object({
  clientName: z.string().min(1),
  orderId: z.string().min(1),
  projectName: z.string().min(1),
  amount: z.number().positive(),
  status: z.enum(['ACTIVE', 'WAITING', 'COMPLETED']),
  meetingTime: z.string().optional(),
})

export async function POST(request: NextRequest) {
  console.log('POST /api/orders - Request received')
  
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const validatedData = createOrderSchema.parse(body)
    console.log('Validated data:', validatedData)

    const order = await prisma.order.create({
      data: validatedData,
    })
    console.log('Order created successfully:', order)

    // Revalidate the dashboard page to update the cache
    revalidatePath('/dashboard')
    revalidatePath('/')
    
    return NextResponse.json({ order }, { 
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: error 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  console.log('GET /api/orders - Request received')
  
  try {
    const orders = await prisma.order.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Orders fetched successfully:', orders.length, 'orders')

    return NextResponse.json({ orders }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}