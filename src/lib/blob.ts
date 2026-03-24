export type BlobUploadResult = {
  id: string
  size: number
  url: string
  createdAt?: string
  updatedAt?: string
}

export async function uploadBlob(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/admin/blob', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const details = await res.text()
    throw new Error(`Blob upload failed (${res.status}): ${details}`)
  }

  const data = (await res.json()) as BlobUploadResult
  if (!data?.url) throw new Error('Invalid blob upload response')
  return data.url
}
