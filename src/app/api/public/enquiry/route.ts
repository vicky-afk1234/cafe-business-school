import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  firstName:        z.string().min(1),
  lastName:         z.string().min(1),
  email:            z.string().email(),
  phone:            z.string().optional(),
  courseInterest:   z.string().optional(),
  studentType:      z.enum(['LOCAL', 'INTERNATIONAL', 'ONLINE']).default('LOCAL'),
  message:          z.string().optional(),
  privacyConsent:   z.boolean(),
  marketingConsent: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (!data.privacyConsent) {
      return NextResponse.json({ error: 'Privacy consent required' }, { status: 400 })
    }

    const candidate = await prisma.candidate.create({
      data: {
        firstName:        data.firstName,
        lastName:         data.lastName,
        email:            data.email,
        phone:            data.phone,
        courseInterest:   data.courseInterest,
        studentType:      data.studentType,
        message:          data.message,
        privacyConsent:   data.privacyConsent,
        marketingConsent: data.marketingConsent ?? false,
        status:           'NEW',
        ipAddress:        req.headers.get('x-forwarded-for') || req.ip,
        userAgent:        req.headers.get('user-agent'),
        pageUrl:          req.headers.get('referer'),
        source:           'website_cta',
      },
    })

    return NextResponse.json({ success: true, id: candidate.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 422 })
    }
    console.error('[Enquiry API Error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
