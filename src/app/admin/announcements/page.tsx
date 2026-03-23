'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

type Announcement = {
  id: string; message: string; ctaLabel?: string | null; ctaUrl?: string | null;
  bgColor: string; textColor: string; isActive: boolean;
  startsAt?: string | null; endsAt?: string | null;
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [form, setForm] = useState({
    message: '', ctaLabel: '', ctaUrl: '',
    bgColor: '#c8860a', textColor: '#ffffff',
    isActive: true, startsAt: '', endsAt: '',
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/announcements')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch { setItems([]) }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const openEdit = (a: Announcement) => {
    setEditing(a)
    setForm({ ...form, ...a, startsAt: a.startsAt || '', endsAt: a.endsAt || '' })
    setShowForm(true)
  }

  const handleSave = async () => {
    const url = editing ? `/api/admin/announcements/${editing.id}` : '/api/admin/announcements'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startsAt: form.startsAt || null,
        endsAt:   form.endsAt   || null,
      }),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetch_() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete announcement?')) return
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const toggleActive = async (a: Announcement) => {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !a.isActive }),
    })
    fetch_()
  }

  const F = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Announcements</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage the top announcement bar shown to all site visitors</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> New Announcement
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            No announcements yet. Create one to display at the top of the site.
          </div>
        ) : items.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border ${a.isActive ? 'border-espresso-200' : 'border-gray-100'} shadow-sm overflow-hidden`}>
            {/* Preview */}
            <div className="px-6 py-3 text-sm font-medium text-center" style={{ background: a.bgColor, color: a.textColor }}>
              {a.message}
              {a.ctaLabel && <span className="ml-2 underline font-semibold">{a.ctaLabel} →</span>}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm">
                {a.endsAt && <span className="text-xs text-gray-400">Ends {new Date(a.endsAt).toLocaleDateString()}</span>}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => toggleActive(a)} className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {a.isActive ? <><Eye size={11}/> Live</> : <><EyeOff size={11}/> Hidden</>}
                </button>
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b"><h2 className="font-bold text-gray-900">{editing ? 'Edit' : 'New'} Announcement</h2></div>
            <div className="p-6 space-y-4">
              {/* Live preview */}
              <div className="rounded-xl overflow-hidden">
                <div className="py-2.5 px-4 text-sm font-medium text-center" style={{ background: form.bgColor, color: form.textColor }}>
                  {form.message || 'Your announcement text here...'}
                  {form.ctaLabel && <span className="ml-2 underline font-semibold">{form.ctaLabel} →</span>}
                </div>
              </div>
              <div>
                <label className="form-label">Message *</label>
                <input value={form.message} onChange={F('message')} className="form-input" placeholder="🎓 January 2025 intake now open — Limited seats!" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">CTA Label</label>
                  <input value={form.ctaLabel} onChange={F('ctaLabel')} className="form-input" placeholder="Apply Now" />
                </div>
                <div>
                  <label className="form-label">CTA URL</label>
                  <input value={form.ctaUrl} onChange={F('ctaUrl')} className="form-input" placeholder="/admissions/apply" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.bgColor} onChange={F('bgColor')} className="h-10 w-12 rounded-lg border border-gray-200" />
                    <input value={form.bgColor} onChange={F('bgColor')} className="form-input flex-1" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={form.textColor} onChange={F('textColor')} className="h-10 w-12 rounded-lg border border-gray-200" />
                    <input value={form.textColor} onChange={F('textColor')} className="form-input flex-1" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Start Date (optional)</label>
                  <input type="datetime-local" value={form.startsAt} onChange={F('startsAt')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">End Date (optional)</label>
                  <input type="datetime-local" value={form.endsAt} onChange={F('endsAt')} className="form-input" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">{editing ? 'Save' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
