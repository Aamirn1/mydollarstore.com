import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET /api/payouts - Get all payouts (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const payouts = await db.partnerPayout.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        partner: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ payouts })
  } catch (error) {
    console.error('Error fetching payouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}

// POST /api/payouts - Create a payout (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { partnerId, amount, status: payoutStatus } = body

    if (!partnerId || amount === undefined) {
      return NextResponse.json(
        { error: 'partnerId and amount are required' },
        { status: 400 }
      )
    }

    // Verify partner exists
    const partner = await db.user.findUnique({ where: { id: partnerId } })
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      )
    }

    if (partner.role !== 'partner') {
      return NextResponse.json(
        { error: 'User is not a partner' },
        { status: 400 }
      )
    }

    const payout = await db.partnerPayout.create({
      data: {
        partnerId,
        amount: parseFloat(String(amount)),
        status: payoutStatus || 'pending',
        paidAt: payoutStatus === 'paid' ? new Date() : null,
      },
    })

    return NextResponse.json({ payout }, { status: 201 })
  } catch (error) {
    console.error('Error creating payout:', error)
    return NextResponse.json(
      { error: 'Failed to create payout' },
      { status: 500 }
    )
  }
}
