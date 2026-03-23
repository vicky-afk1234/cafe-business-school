'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'

type Testimonial = {
  id: string; name: string; role?: string | null; courseTitle?: string | null;
  quote: string; rating: number; photoDesktop?: string | null;
  isFeatured: boolean; isActive: boolean; sortOrder: number;
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({
    name: '', role: '', courseTitle: '', quote: '', rating: 5,
    photoDesktop: '', photoMobile: '', videoUrl: '',
    isFeatured: false, isActive: true, sortOrder: 0,
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch { setItems([]) }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ ...form, ...(t as any) }); setShowForm(true) }

  const handleSave = async () => {
    const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetch_() }
  }

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    })
    fetch_()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const F = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Testimonials</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage student testimonials displayed on the site</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Photo Specs:</strong>&nbsp;
        Desktop: <code className="bg-espresso-100 px-1 rounded">200×200px square</code>&nbsp;|&nbsp;
        Mobile: <code className="bg-espresso-100 px-1 rounded">160×160px square</code> — headshot, circular crop
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-400">No testimonials yet.</div>
        ) : items.map(t => (
          <div key={t.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${t.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {t.photoDesktop
                  ? <img src={t.photoDesktop} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  : <div className="w-10 h-10 rounded-full bg-espresso-100 flex items-center justify-center text-espresso-700 font-bold">{t.name[0]}</div>}
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                </div>
              </div>
              <div className="flex gap-1.5">
                {t.isFeatured && <Star size={13} className="fill-amber-400 text-amber-400" />}
                <button onClick={() => toggleActive(t)}>
                  {t.isActive ? <Eye size={13} className="text-green-500" /> : <EyeOff size={13} className="text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex gap-0.5 mb-2">
              {Array.from({length:5}).map((_,i) => (
                <Star key={i} size={11} className={i < t.rating ? 'fill-espresso-400 text-espresso-400' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-3">"{t.quote}"</p>
            {t.courseTitle && <div className="text-xs text-espresso-500 font-medium mb-3">{t.courseTitle}</div>}

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button onClick={() => openEdit(t)} className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1">
                <Pencil size={11} /> Edit
              </button>
              <button onClick={() => handleDelete(t.id)} className="flex-1 text-xs py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center gap-1">
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><h2 className="font-bold text-gray-900">{editing ? 'Edit' : 'Add'} Testimonial</h2></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input value={form.name} onChange={F('name')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Role</label>
                  <input value={form.role} onChange={F('role')} className="form-input" placeholder="Café Owner, Singapore" />
                </div>
              </div>
              <div>
                <label className="form-label">Course Title</label>
                <input value={form.courseTitle} onChange={F('courseTitle')} className="form-input" />
              </div>
              <div>
                <label className="form-label">Quote *</label>
                <textarea value={form.quote} onChange={F('quote')} rows={4} className="form-input resize-none" />
              </div>
              <div>
                <label className="form-label">Rating (1–5)</label>
                <select value={form.rating} onChange={F('rating')} className="form-input">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Photo Desktop URL <span className="text-gray-400">(200×200px square)</span></label>
                <input value={form.photoDesktop} onChange={F('photoDesktop')} className="form-input" placeholder="https://..." />
                {form.photoDesktop && <img src={form.photoDesktop} className="mt-2 w-16 h-16 object-cover rounded-full" alt="" />}
              </div>
              <div>
                <label className="form-label text-xs">Photo Mobile URL <span className="text-gray-400">(160×160px square)</span></label>
                <input value={form.photoMobile} onChange={F('photoMobile')} className="form-input" placeholder="https://..." />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={F('isFeatured')} className="rounded" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">{editing ? 'Save' : 'Add'} Testimonial</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
