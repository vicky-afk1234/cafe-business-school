import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
    const map = settings.reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})

    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
