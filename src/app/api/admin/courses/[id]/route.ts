import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession()
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(course)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession()
    const { id } = await params
    const raw = await req.json()

    const {
      categoryId,
      category: _category,
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...data
    } = raw

    // Validate categoryId if it's being updated
    if (categoryId !== undefined) {
      if (!categoryId || typeof categoryId !== 'string') {
        return NextResponse.json({ error: 'categoryId is required' }, { status: 400 })
      }

      const categoryExists = await prisma.courseCategory.findUnique({
        where: { id: categoryId },
      })
      if (!categoryExists) {
        const categories = await prisma.courseCategory.findMany()
        return NextResponse.json(
          {
            error: 'Invalid categoryId',
            message: `Category with ID "${categoryId}" does not exist`,
            availableCategories: categories,
          },
          { status: 400 }
        )
      }

      data.category = { connect: { id: categoryId } }
    }

    const course = await prisma.course.update({
      where: { id },
      data,
      include: { category: true },
    })
    return NextResponse.json(course)
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    if (err.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 })
    }
    console.error('Course update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession()
    const { id } = await params
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
