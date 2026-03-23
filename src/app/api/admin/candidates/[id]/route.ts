import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminSession()
    const candidate = await prisma.candidate.findUnique({
      where: { id: params.id },
      include: { activities: { orderBy: { createdAt: 'desc' } } },
    })
    if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(candidate)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdminSession()
    const data = await req.json()
    const { status, notes, followUpAt } = data

    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: {
        ...(status    && { status }),
        ...(notes     && { notes }),
        ...(followUpAt && { followUpAt: new Date(followUpAt) }),
      },
    })

    // Log activity if status changed
    if (status) {
      await prisma.candidateActivity.create({
        data: {
          candidateId: params.id,
          action: `Status changed to ${status}`,
          performedBy: (session as any).name || 'Admin',
        },
      })
    }

    return NextResponse.json(candidate)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminSession()
    await prisma.candidate.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
