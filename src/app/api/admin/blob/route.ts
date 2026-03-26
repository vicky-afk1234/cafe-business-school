import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { randomUUID } from 'crypto'
import { requireAdminSession } from '@/lib/auth'

function sanitizeFileName(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export async function POST(req: Request) {
  try {
    await requireAdminSession()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: 'BLOB_READ_WRITE_TOKEN is not configured. Contact your administrator.' },
      { status: 500 }
    )
  }

  const formData = await req.formData()
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Validate file size before uploading
  const MAX_UPLOAD_SIZE = 500 * 1024 * 1024 // 500MB
  if (buffer.length > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: `File size (${(buffer.length / 1024 / 1024).toFixed(2)}MB) exceeds maximum of 500MB` },
      { status: 413 }
    )
  }

  try {
    const originalName = file.name || 'upload'
    const safeName = sanitizeFileName(originalName) || `upload-${Date.now()}`
    const pathname = `admin-uploads/${Date.now()}-${randomUUID()}-${safeName}`

    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    })

    return NextResponse.json({
      url: blob.url,
      size: buffer.length,
      type: file.type,
      name: file.name,
    })
  } catch (error: any) {
    console.error('Blob upload error:', error)

    const message = String(error?.message || '')
    if (message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        {
          error: 'Blob storage misconfigured',
          details: 'Invalid BLOB_READ_WRITE_TOKEN. Check your Vercel project settings.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
