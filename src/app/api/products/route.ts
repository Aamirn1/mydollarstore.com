import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET /api/products - Get all active products with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    const where: Record<string, unknown> = {
      isActive: true,
    }

    if (categorySlug) {
      where.categorySlug = categorySlug
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const products = await db.product.findMany({
      where,
      orderBy,
      include: {
        reviews: {
          where: { isApproved: true },
          select: { id: true, rating: true },
        },
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
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
    const {
      name,
      slug,
      price,
      originalPrice,
      categorySlug,
      imageUrl,
      images,
      description,
      specifications,
      tag,
      brand,
      inStock,
      stockCount,
    } = body

    if (!name || !slug || price === undefined || !categorySlug) {
      return NextResponse.json(
        { error: 'Name, slug, price, and categorySlug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        price: parseFloat(String(price)),
        originalPrice: originalPrice ? parseFloat(String(originalPrice)) : null,
        categorySlug,
        imageUrl: imageUrl || null,
        images: images ? JSON.stringify(images) : null,
        description: description || null,
        specifications: specifications ? JSON.stringify(specifications) : null,
        tag: tag || null,
        brand: brand || null,
        inStock: inStock !== undefined ? inStock : true,
        stockCount: stockCount || 0,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
