import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminSession()
    const heroes = await prisma.heroSection.findMany({ orderBy: { page: 'asc' } })
    return NextResponse.json(heroes)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data = await req.json()
    const hero = await prisma.heroSection.upsert({
      where: { page: data.page },
      create: data,
      update: data,
    })
    return NextResponse.json(hero, { status: 201 })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
