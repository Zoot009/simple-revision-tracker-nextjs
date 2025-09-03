import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
    // Log that we're parsing the body
    console.log('Parsing request body...')
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate the data
    console.log('Validating data...')
    const validatedData = createOrderSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Create the order in the database
    console.log('Creating order in database...')
    const order = await prisma.order.create({
      data: validatedData,
    })
    console.log('Order created successfully:', order)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error)
      return NextResponse.json({ 
        error: 'Invalid data', 
        details: error
      }, { status: 400 })
    }

    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
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
    console.log('Fetching orders from database...')
    const orders = await prisma.order.findMany({
      include: { tasks: true },
      orderBy: { createdAt: 'desc' }
    })
    console.log('Orders fetched successfully:', orders.length, 'orders')

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}