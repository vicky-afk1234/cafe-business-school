import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminSession()
    const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json(settings)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data: Record<string, string> = await req.json()

    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value, type: 'text' },
          update: { value },
        })
      )
    )

    revalidatePath('/', 'layout')
    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/courses')
    revalidatePath('/contact')

    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
