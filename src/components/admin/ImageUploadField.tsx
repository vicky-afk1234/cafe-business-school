'use client'

import { useState } from 'react'
import { uploadBlob } from '@/lib/blob'
import { CloudUpload } from 'lucide-react'

type Props = {
  label: string
  value?: string | null
  onChange: (url: string) => void
  placeholder?: string
  required?: boolean
}

export default function ImageUploadField({ label, value, onChange, placeholder, required }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)

    try {
      const uploadedUrl = await uploadBlob(file)
      onChange(uploadedUrl)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="form-label">
        {label}{required ? ' *' : ''}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'https://...'}
          className="form-input flex-1"
        />
        <label className="btn-secondary flex items-center gap-1" title="Upload from local file">
          <CloudUpload size={14} />
          <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
        </label>
      </div>
      {uploading && <p className="text-xs text-blue-600">Uploading image...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <img src={value} alt={label} className="mt-2 h-24 w-full object-cover rounded-lg border" />
      )}
    </div>
  )
}
