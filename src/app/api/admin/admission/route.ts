import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { handlePrismaError } from '@/lib/validation'

export async function GET() {
  try {
    const data = await prisma.admissionPage.findFirst()
    return NextResponse.json(data || {})
  } catch (err: any) {
    const { status, error, details } = handlePrismaError(err)
    return NextResponse.json({ error, details }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
    const data = await req.json()

    const admission = await prisma.admissionPage.upsert({
      where: { id: data.id || 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    })
    return NextResponse.json(admission, { status: 201 })
  } catch (err: any) {
    const { status, error, details } = handlePrismaError(err)
    return NextResponse.json({ error, details }, { status })
  }
}
