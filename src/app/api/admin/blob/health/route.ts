import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { del, put } from '@vercel/blob'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdminSession()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Blob storage misconfigured',
        details: 'BLOB_READ_WRITE_TOKEN is not configured.',
      },
      { status: 500 }
    )
  }

  const pathname = `healthchecks/${Date.now()}-${randomUUID()}.txt`

  try {
    const probe = await put(pathname, Buffer.from('blob-health-check'), {
      access: 'public',
      contentType: 'text/plain',
      addRandomSuffix: false,
    })

    await del(probe.url)

    return NextResponse.json({
      ok: true,
      message: 'Blob storage write/delete check passed',
    })
  } catch (error: any) {
    const message = String(error?.message || 'Unknown blob error')
    return NextResponse.json(
      {
        ok: false,
        error: 'Blob health check failed',
        details: message,
      },
      { status: 500 }
    )
  }
}
