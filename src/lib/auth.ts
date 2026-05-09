import { db } from '@/lib/db'

export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  if (!token) return null

  try {
    const user = await db.user.findUnique({ where: { id: token } })
    return user
  } catch {
    return null
  }
}

export async function requireAdmin(request: Request) {
  const user = await getUserFromRequest(request)
  if (!user || user.role !== 'admin') {
    return null
  }
  return user
}
