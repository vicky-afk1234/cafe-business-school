import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await requireAdminSession()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN is not set' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const uploadRes = await fetch('https://api.vercel.com/v1/edge/blob', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: buffer,
  })

  const result = await uploadRes.json()
  if (!uploadRes.ok) {
    return NextResponse.json({ error: 'Vercel blob upload error', details: result }, { status: uploadRes.status })
  }

  return NextResponse.json(result)
}
