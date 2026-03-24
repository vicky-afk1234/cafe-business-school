'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

type GalleryImage = {
  id: string; title?: string | null; altText?: string | null;
  desktopUrl: string; mobileUrl: string; thumbUrl?: string | null;
  category: string; isActive: boolean; sortOrder: number;
}

const CATEGORIES = ['CAMPUS','TRAINING','EVENTS','STUDENTS','COFFEE_LAB','BARISTA_COMP']

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [form, setForm] = useState({
    title: '', altText: '', caption: '', category: 'CAMPUS',
    desktopUrl: '', mobileUrl: '', thumbUrl: '',
    isActive: true, sortOrder: 0,
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      setImages(Array.isArray(data) ? data : [])
    } catch { setImages([]) }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const handleSave = async () => {
    const res = await fetch('/api/admin/gallery', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setShowForm(false); fetch_() }
  }

  const toggleActive = async (img: GalleryImage) => {
    await fetch(`/api/admin/gallery/${img.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !img.isActive }),
    })
    fetch_()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete image?')) return
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const F = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const filtered = activeCategory === 'ALL' ? images : images.filter(i => i.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">{images.length} images across {CATEGORIES.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Image
        </button>
      </div>

      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Gallery Image Specs:</strong>&nbsp;
        Desktop: <code className="bg-espresso-100 px-1 rounded">1200×800px (3:2 landscape)</code>&nbsp;|&nbsp;
        Mobile: <code className="bg-espresso-100 px-1 rounded">600×400px or 400×600px (portrait for hero shots)</code>&nbsp;|&nbsp;
        Thumb: <code className="bg-espresso-100 px-1 rounded">400×300px</code>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === c ? 'bg-espresso-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {c.replace(/_/g,' ')}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-5 text-center py-12 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-5 text-center py-12 text-gray-400">No images in this category.</div>
        ) : filtered.map(img => (
          <div key={img.id} className={`group relative rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-sm ${!img.isActive ? 'opacity-50' : ''}`}>
            <img
              src={img.thumbUrl || img.desktopUrl}
              alt={img.altText || img.title || ''}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-end">
              <div className="p-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                {img.title && <div className="text-white text-xs font-medium truncate mb-1">{img.title}</div>}
                <div className="flex gap-1.5">
                  <button onClick={() => toggleActive(img)} className="flex-1 text-xs py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 flex items-center justify-center gap-1">
                    {img.isActive ? <EyeOff size={10}/> : <Eye size={10}/>}
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="flex-1 text-xs py-1 rounded-lg bg-red-500/70 text-white hover:bg-red-500 flex items-center justify-center">
                    <Trash2 size={10}/>
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <span className="text-xs bg-black/50 text-white px-1.5 py-0.5 rounded font-medium">
                {img.category.replace(/_/,' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="font-bold text-gray-900">Add Gallery Image</h2></div>
            <div className="p-6 space-y-4">
              <ImageUploadField
                label="Desktop Image URL"
                value={form.desktopUrl}
                required
                onChange={(url) => setForm(f => ({ ...f, desktopUrl: url }))}
                placeholder="https://..."
              />
              <ImageUploadField
                label="Mobile Image URL"
                value={form.mobileUrl}
                required
                onChange={(url) => setForm(f => ({ ...f, mobileUrl: url }))}
                placeholder="https://..."
              />
              <ImageUploadField
                label="Thumbnail URL"
                value={form.thumbUrl}
                onChange={(url) => setForm(f => ({ ...f, thumbUrl: url }))}
                placeholder="https://..."
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title</label>
                  <input value={form.title} onChange={F('title')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select value={form.category} onChange={F('category')} className="form-input">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/,' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Alt Text (accessibility)</label>
                <input value={form.altText} onChange={F('altText')} className="form-input" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                <span className="text-sm text-gray-700">Active (visible in gallery)</span>
              </label>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Add Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
