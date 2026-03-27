'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

type Partner = {
  id: string
  name: string
  logoUrl: string
  logoUrlDark?: string | null
  websiteUrl?: string | null
  type: 'ACCREDITATION' | 'INDUSTRY' | 'PLACEMENT' | 'MEDIA'
  isActive: boolean
  sortOrder: number
}

const PARTNER_TYPES = [
  { value: 'INDUSTRY', label: 'Industry' },
  { value: 'ACCREDITATION', label: 'Accreditation' },
  { value: 'PLACEMENT', label: 'Placement' },
  { value: 'MEDIA', label: 'Media' },
]

export default function PartnersPage() {
  const [items, setItems] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    logoUrlDark: '',
    websiteUrl: '',
    type: 'INDUSTRY',
    isActive: true,
    sortOrder: 0,
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/partners')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch_()
  }, [])

  const openEdit = (partner: Partner) => {
    setEditing(partner)
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      logoUrlDark: partner.logoUrlDark || '',
      websiteUrl: partner.websiteUrl || '',
      type: partner.type,
      isActive: partner.isActive,
      sortOrder: partner.sortOrder,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.logoUrl) return

    const payload = {
      ...form,
      logoUrlDark: form.logoUrlDark || null,
      websiteUrl: form.websiteUrl || null,
      sortOrder: Number(form.sortOrder) || 0,
    }

    const url = editing ? `/api/admin/partners/${editing.id}` : '/api/admin/partners'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      fetch_()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return
    await fetch(`/api/admin/partners/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const F = (key: string) => (e: any) => {
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Partners & Accreditations
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage logos shown in the home page partner section</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Partner
        </button>
      </div>

      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Logo Specs:</strong>&nbsp;
        Use transparent PNG/WebP with similar visual height for cleaner alignment.
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Logo', 'Name', 'Type', 'Status', 'Sort', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No partners yet.</td></tr>
              ) : items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    {item.logoUrl
                      ? <img src={item.logoUrl} alt="" className="w-20 h-10 object-contain" />
                      : <div className="w-20 h-10 bg-gray-100 rounded" />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.websiteUrl && <div className="text-xs text-gray-500 truncate max-w-[280px]">{item.websiteUrl}</div>}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">{item.type.replace('_', ' ')}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.isActive ? <><Eye size={11}/> Visible</> : <><EyeOff size={11}/> Hidden</>}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{item.sortOrder}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit' : 'Add'} Partner</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Partner Name *</label>
                <input value={form.name} onChange={F('name')} className="form-input" placeholder="Specialty Coffee Association" />
              </div>

              <ImageUploadField
                label="Logo (Light background) *"
                value={form.logoUrl}
                onChange={(url) => setForm(f => ({ ...f, logoUrl: url }))}
              />

              <ImageUploadField
                label="Logo (Dark background, optional)"
                value={form.logoUrlDark}
                onChange={(url) => setForm(f => ({ ...f, logoUrlDark: url }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Type</label>
                  <select value={form.type} onChange={F('type')} className="form-input">
                    {PARTNER_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={F('sortOrder')} className="form-input" />
                </div>
              </div>

              <div>
                <label className="form-label">Website URL</label>
                <input value={form.websiteUrl} onChange={F('websiteUrl')} className="form-input" placeholder="https://example.org" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">
                {editing ? 'Save Changes' : 'Add Partner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
