import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { validateRequired, handlePrismaError } from '@/lib/validation'

export async function GET() {
  try {
    await requireAdminSession()
    const heroes = await prisma.heroSection.findMany({ orderBy: { page: 'asc' } })
    return NextResponse.json(heroes)
  } catch (err: any) {
    const { status, error, details } = handlePrismaError(err)
    return NextResponse.json({ error, details }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data = await req.json()

    // Validate required fields
    const errors = validateRequired(data, ['page', 'headline'])
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 })
    }

    const hero = await prisma.heroSection.upsert({
      where: { page: data.page },
      create: data,
      update: data,
    })

    const targetPath = data.page === 'home' ? '/' : `/${data.page}`
    revalidatePath('/', 'layout')
    revalidatePath(targetPath)

    return NextResponse.json(hero, { status: 201 })
  } catch (err: any) {
    const { status, error, details } = handlePrismaError(err)
    return NextResponse.json({ error, details }, { status })
  }
}
