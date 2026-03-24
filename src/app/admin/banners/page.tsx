'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Image } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

type Banner = {
  id: string; title: string; placement: string; isActive: boolean;
  desktopImageUrl?: string | null; mobileImageUrl?: string | null;
  ctaLabel?: string | null; ctaUrl?: string | null;
  startsAt?: string | null; endsAt?: string | null;
  createdAt: string;
}

const placements = ['HOME_TOP','HOME_MID','HOME_BOTTOM','COURSES_TOP','SIDEBAR','POPUP','ANNOUNCEMENT_BAR']

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)

  const [form, setForm] = useState({
    title: '', subtitle: '', bodyText: '', ctaLabel: '', ctaUrl: '',
    desktopImageUrl: '', mobileImageUrl: '', placement: 'HOME_TOP',
    bgColor: '#1a0d08', textColor: '#ffffff', isActive: true,
    sortOrder: 0,
  })

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/banners')
      const data = await res.json()
      setBanners(Array.isArray(data) ? data : [])
    } catch { setBanners([]) }
    setLoading(false)
  }

  useEffect(() => { fetchBanners() }, [])

  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({
      ...form,
      ...b,
      ctaLabel: b.ctaLabel || '',
      ctaUrl: b.ctaUrl || '',
      desktopImageUrl: b.desktopImageUrl || '',
      mobileImageUrl: b.mobileImageUrl || '',
      sortOrder: 0
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    const url = editing ? `/api/admin/banners/${editing.id}` : '/api/admin/banners'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetchBanners() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    fetchBanners()
  }

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/admin/banners/${b.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !b.isActive }),
    })
    fetchBanners()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage site banners with separate desktop & mobile images</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> New Banner
        </button>
      </div>

      {/* Image spec notice */}
      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Image Specifications:</strong>&nbsp;
        Desktop banners: <code className="bg-espresso-100 px-1 rounded">1440×400px</code> (16:4 ratio) &nbsp;|&nbsp;
        Mobile banners: <code className="bg-espresso-100 px-1 rounded">768×300px</code> (balanced crop)
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Preview', 'Title', 'Placement', 'CTA', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No banners yet. Create your first banner!</td></tr>
              ) : banners.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    {b.desktopImageUrl ? (
                      <img src={b.desktopImageUrl} alt="" className="w-24 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={18} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    <div>{b.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {b.mobileImageUrl ? '✓ Mobile img' : '⚠ No mobile img'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-coffee-100 text-coffee-700 px-2.5 py-1 rounded-full font-medium">
                      {b.placement.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {b.ctaLabel || '—'}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(b)} className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.isActive ? <><Eye size={11} /> Live</> : <><EyeOff size={11} /> Hidden</>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Banner' : 'New Banner'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" placeholder="January Intake 2025" />
              </div>
              <div>
                <label className="form-label">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="form-input" />
              </div>
              <div>
                <label className="form-label">Body Text</label>
                <textarea value={form.bodyText} onChange={e => setForm({...form, bodyText: e.target.value})} className="form-input resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">CTA Label</label>
                  <input value={form.ctaLabel} onChange={e => setForm({...form, ctaLabel: e.target.value})} className="form-input" placeholder="Apply Now" />
                </div>
                <div>
                  <label className="form-label">CTA URL</label>
                  <input value={form.ctaUrl} onChange={e => setForm({...form, ctaUrl: e.target.value})} className="form-input" placeholder="/admissions/apply" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <div className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                  <Image size={14} /> Image URLs (Desktop & Mobile separately)
                </div>
                <ImageUploadField
                  label="Desktop Image URL"
                  value={form.desktopImageUrl}
                  required
                  onChange={(url) => setForm(f => ({ ...f, desktopImageUrl: url }))}
                  placeholder="https://..."
                />
                <ImageUploadField
                  label="Mobile Image URL"
                  value={form.mobileImageUrl}
                  onChange={(url) => setForm(f => ({ ...f, mobileImageUrl: url }))}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Placement</label>
                  <select value={form.placement} onChange={e => setForm({...form, placement: e.target.value})} className="form-input">
                    {placements.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} className="form-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.bgColor} onChange={e => setForm({...form, bgColor: e.target.value})} className="h-10 w-12 rounded-lg border border-gray-200 cursor-pointer" />
                    <input value={form.bgColor} onChange={e => setForm({...form, bgColor: e.target.value})} className="form-input flex-1" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.textColor} onChange={e => setForm({...form, textColor: e.target.value})} className="h-10 w-12 rounded-lg border border-gray-200 cursor-pointer" />
                    <input value={form.textColor} onChange={e => setForm({...form, textColor: e.target.value})} className="form-input flex-1" />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="rounded" />
                <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">
                {editing ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
