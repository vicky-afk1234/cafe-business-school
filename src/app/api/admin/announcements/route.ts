import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminSession()
    const items = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(items)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data = await req.json()
    const item = await prisma.announcement.create({ data })
    return NextResponse.json(item, { status: 201 })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
