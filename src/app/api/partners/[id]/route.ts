import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// PUT /api/partners/[id] - Approve/reject partner application (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "approved" or "rejected"' },
        { status: 400 }
      )
    }

    // Check application exists
    const application = await db.partnerApplication.findUnique({
      where: { id },
    })
    if (!application) {
      return NextResponse.json(
        { error: 'Partner application not found' },
        { status: 404 }
      )
    }

    // Update application status
    const updatedApplication = await db.partnerApplication.update({
      where: { id },
      data: { status },
    })

    // If approved, update user role to partner
    if (status === 'approved') {
      await db.user.update({
        where: { id: application.userId },
        data: { role: 'partner' },
      })
    }

    return NextResponse.json({ application: updatedApplication })
  } catch (error) {
    console.error('Error updating partner application:', error)
    return NextResponse.json(
      { error: 'Failed to update partner application' },
      { status: 500 }
    )
  }
}
