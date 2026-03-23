'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'

type Course = {
  id: string; title: string; slug: string; level: string; duration: string;
  isActive: boolean; isFeatured: boolean; sortOrder: number;
  thumbnailDesktop?: string | null; localFee?: number | null; currency: string;
  category: { name: string }
}

const LEVELS = ['CERTIFICATE','DIPLOMA','ADVANCED_DIPLOMA','HIGHER_DIPLOMA','POSTGRADUATE_DIPLOMA']

const levelLabels: Record<string,string> = {
  CERTIFICATE: 'Certificate', DIPLOMA: 'Diploma',
  ADVANCED_DIPLOMA: 'Advanced Diploma', HIGHER_DIPLOMA: 'Higher Diploma',
  POSTGRADUATE_DIPLOMA: 'Postgraduate Diploma',
}

const levelColors: Record<string,string> = {
  CERTIFICATE: 'bg-emerald-100 text-emerald-700',
  DIPLOMA: 'bg-espresso-100 text-espresso-700',
  ADVANCED_DIPLOMA: 'bg-coffee-100 text-coffee-700',
  HIGHER_DIPLOMA: 'bg-amber-100 text-amber-700',
  POSTGRADUATE_DIPLOMA: 'bg-purple-100 text-purple-700',
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState({
    title: '', slug: '', tagline: '', description: '', duration: '12 months',
    level: 'DIPLOMA', language: 'English', currency: 'SGD',
    localFee: '', intlFee: '', categoryId: '',
    thumbnailDesktop: '', thumbnailMobile: '', bannerDesktop: '', bannerMobile: '',
    isFeatured: false, isActive: true, sortOrder: 0,
    metaTitle: '', metaDescription: '',
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(Array.isArray(data) ? data : [])
    } catch { setCourses([]) }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const openEdit = (c: Course) => {
    setEditing(c)
    setForm({ ...form, ...(c as any), localFee: c.localFee?.toString() || '' })
    setShowForm(true)
  }

  const handleSave = async () => {
    const payload = {
      ...form,
      localFee: form.localFee ? parseFloat(form.localFee) : null,
      intlFee:  form.intlFee  ? parseFloat(form.intlFee)  : null,
    }
    const url = editing ? `/api/admin/courses/${editing.id}` : '/api/admin/courses'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetch_() }
  }

  const toggleField = async (id: string, field: 'isActive' | 'isFeatured', value: boolean) => {
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    fetch_()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const F = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all programmes and course content</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> New Course
        </button>
      </div>

      {/* Image spec note */}
      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Course Image Specs:</strong>&nbsp;
        Thumbnail Desktop: <code className="bg-espresso-100 px-1 rounded">800×533px</code>&nbsp;
        Thumbnail Mobile: <code className="bg-espresso-100 px-1 rounded">400×533px (portrait)</code>&nbsp;
        Banner Desktop: <code className="bg-espresso-100 px-1 rounded">1440×480px</code>&nbsp;
        Banner Mobile: <code className="bg-espresso-100 px-1 rounded">768×400px</code>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Thumbnail', 'Title', 'Level', 'Duration', 'Fee', 'Featured', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : courses.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No courses yet. Add your first course!</td></tr>
              ) : courses.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    {c.thumbnailDesktop
                      ? <img src={c.thumbnailDesktop} alt="" className="w-16 h-12 object-cover rounded-lg" />
                      : <div className="w-16 h-12 bg-gray-100 rounded-lg" />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-400">/{c.slug}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${levelColors[c.level] || 'bg-gray-100 text-gray-600'}`}>
                      {levelLabels[c.level] || c.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{c.duration}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">
                    {c.localFee ? `${c.currency} ${Number(c.localFee).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleField(c.id, 'isFeatured', !c.isFeatured)} title="Toggle featured">
                      <Star size={16} className={c.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleField(c.id, 'isActive', !c.isActive)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? <><Eye size={11}/> Live</> : <><EyeOff size={11}/> Hidden</>}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Course' : 'New Course'}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Course Title *</label>
                  <input value={form.title} onChange={F('title')} className="form-input" placeholder="Diploma in Café Management" />
                </div>
                <div>
                  <label className="form-label">URL Slug *</label>
                  <input value={form.slug} onChange={F('slug')} className="form-input" placeholder="diploma-cafe-management" />
                </div>
                <div>
                  <label className="form-label">Level *</label>
                  <select value={form.level} onChange={F('level')} className="form-input">
                    {LEVELS.map(l => <option key={l} value={l}>{levelLabels[l]}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="form-label">Tagline</label>
                  <input value={form.tagline} onChange={F('tagline')} className="form-input" placeholder="Short compelling description" />
                </div>
                <div className="col-span-2">
                  <label className="form-label">Full Description *</label>
                  <textarea value={form.description} onChange={F('description')} rows={4} className="form-input resize-none" />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input value={form.duration} onChange={F('duration')} className="form-input" placeholder="12 months" />
                </div>
                <div>
                  <label className="form-label">Language</label>
                  <input value={form.language} onChange={F('language')} className="form-input" placeholder="English" />
                </div>
                <div>
                  <label className="form-label">Local Fee</label>
                  <input type="number" value={form.localFee} onChange={F('localFee')} className="form-input" placeholder="8500" />
                </div>
                <div>
                  <label className="form-label">International Fee</label>
                  <input type="number" value={form.intlFee} onChange={F('intlFee')} className="form-input" placeholder="12000" />
                </div>
              </div>

              {/* Images */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Course Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-xs">Thumbnail Desktop <span className="text-gray-400">(800×533px landscape)</span></label>
                    <input value={form.thumbnailDesktop} onChange={F('thumbnailDesktop')} className="form-input" placeholder="https://..." />
                    {form.thumbnailDesktop && <img src={form.thumbnailDesktop} className="mt-2 h-20 w-full object-cover rounded-lg" alt="" />}
                  </div>
                  <div>
                    <label className="form-label text-xs">Thumbnail Mobile <span className="text-gray-400">(400×533px portrait)</span></label>
                    <input value={form.thumbnailMobile} onChange={F('thumbnailMobile')} className="form-input" placeholder="https://..." />
                    {form.thumbnailMobile && <img src={form.thumbnailMobile} className="mt-2 h-20 w-32 object-cover rounded-lg" alt="" />}
                  </div>
                  <div>
                    <label className="form-label text-xs">Banner Desktop <span className="text-gray-400">(1440×480px)</span></label>
                    <input value={form.bannerDesktop} onChange={F('bannerDesktop')} className="form-input" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="form-label text-xs">Banner Mobile <span className="text-gray-400">(768×400px)</span></label>
                    <input value={form.bannerMobile} onChange={F('bannerMobile')} className="form-input" placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">SEO</h3>
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Meta Title</label>
                    <input value={form.metaTitle} onChange={F('metaTitle')} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Meta Description</label>
                    <textarea value={form.metaDescription} onChange={F('metaDescription')} rows={2} className="form-input resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={F('isFeatured')} className="rounded" />
                  <span className="text-sm text-gray-700">Featured on homepage</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">
                {editing ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
