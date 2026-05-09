import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest, requireAdmin } from '@/lib/auth'

// GET /api/orders - Get orders (admin sees all, customer sees their own)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      )
    }

    // Check if user exists and is admin
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let orders
    if (user.role === 'admin') {
      // Admin sees all orders
      orders = await db.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      })
    } else {
      // Customer sees only their own orders
      orders = await db.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      items,
      subtotal,
      advanceAmount,
      remainingAmount,
      paymentMethod,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      notes,
      isReseller,
      profitAmount,
      paymentScreenshotUrl,
    } = body

    if (!userId || !items || subtotal === undefined) {
      return NextResponse.json(
        { error: 'userId, items, and subtotal are required' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const order = await db.order.create({
      data: {
        userId,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        subtotal: parseFloat(String(subtotal)),
        advanceAmount: advanceAmount ? parseFloat(String(advanceAmount)) : 0,
        remainingAmount: remainingAmount ? parseFloat(String(remainingAmount)) : 0,
        paymentMethod: paymentMethod || 'full',
        status: 'pending_payment',
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        customerAddress: customerAddress || null,
        customerCity: customerCity || null,
        notes: notes || null,
        isReseller: isReseller || false,
        profitAmount: profitAmount ? parseFloat(String(profitAmount)) : 0,
        paymentScreenshotUrl: paymentScreenshotUrl || null,
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
