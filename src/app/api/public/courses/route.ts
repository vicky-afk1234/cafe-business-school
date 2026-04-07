import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      select: { id: true, title: true, slug: true, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    })
    return NextResponse.json(courses, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
