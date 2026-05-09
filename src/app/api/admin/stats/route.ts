import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/stats - Get dashboard statistics (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const [
      totalOrders,
      totalProducts,
      activeProducts,
      totalUsers,
      recentOrders,
    ] = await Promise.all([
      db.order.count(),
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.user.count(),
      db.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ])

    // Calculate total revenue from all orders
    const orders = await db.order.findMany({
      select: { subtotal: true },
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0)

    // Count orders by status
    const ordersByStatus = await db.order.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const statusCounts: Record<string, number> = {}
    for (const entry of ordersByStatus) {
      statusCounts[entry.status] = entry._count.status
    }

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      activeProducts,
      totalUsers,
      recentOrders,
      ordersByStatus: statusCounts,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
