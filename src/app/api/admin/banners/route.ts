import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

// ─── GET /api/admin/banners ───────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await requireAdminSession()
    const banners = await prisma.banner.findMany({
      orderBy: [{ placement: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json(banners)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── POST /api/admin/banners ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data = await req.json()
    const banner = await prisma.banner.create({ data })
    return NextResponse.json(banner, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
