import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET /api/partners - Get all partner applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const applications = await db.partnerApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching partner applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partner applications' },
      { status: 500 }
    )
  }
}

// POST /api/partners - Apply as a partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, businessName, businessPhone, businessAddress } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
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

    // Check if user already applied
    const existingApplication = await db.partnerApplication.findUnique({
      where: { userId },
    })
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already submitted a partner application', application: existingApplication },
        { status: 409 }
      )
    }

    const application = await db.partnerApplication.create({
      data: {
        userId,
        status: 'pending',
        businessName: businessName || null,
        businessPhone: businessPhone || null,
        businessAddress: businessAddress || null,
      },
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error creating partner application:', error)
    return NextResponse.json(
      { error: 'Failed to submit partner application' },
      { status: 500 }
    )
  }
}
