import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/categories - Get all categories with product counts
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { title: 'asc' },
    })

    // Get actual product counts from the database
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await db.product.count({
          where: {
            categorySlug: category.slug,
            isActive: true,
          },
        })

        // Update the category's productCount if it's stale
        if (category.productCount !== productCount) {
          await db.category.update({
            where: { id: category.id },
            data: { productCount },
          })
        }

        return {
          ...category,
          productCount,
        }
      })
    )

    return NextResponse.json({ categories: categoriesWithCounts })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
