'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

type Member = {
  id: string; name: string; title: string; department?: string | null;
  bio?: string | null; photoDesktop?: string | null; photoMobile?: string | null;
  isActive: boolean; sortOrder: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState({
    name: '', title: '', department: '', bio: '',
    photoDesktop: '', photoMobile: '', linkedinUrl: '', email: '',
    isActive: true, sortOrder: 0,
  })

  const fetch_ = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/team')
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch { setMembers([]) }
    setLoading(false)
  }

  useEffect(() => { fetch_() }, [])

  const openEdit = (m: Member) => { setEditing(m); setForm({ ...form, ...(m as any) }); setShowForm(true) }

  const handleSave = async () => {
    const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setShowForm(false); setEditing(null); fetch_() }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete team member?')) return
    await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
    fetch_()
  }

  const F = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Team Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage faculty and staff displayed on the site</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Member
        </button>
      </div>

      <div className="bg-espresso-50 border border-espresso-200 rounded-xl p-4 text-sm text-espresso-800">
        <strong>Photo Specs:</strong>&nbsp;
        Desktop: <code className="bg-espresso-100 px-1 rounded">400×500px (portrait, 4:5 ratio)</code>&nbsp;|&nbsp;
        Mobile: <code className="bg-espresso-100 px-1 rounded">300×380px (cropped tighter for mobile)</code>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Photo', 'Name & Title', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No team members yet.</td></tr>
              ) : members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    {m.photoDesktop
                      ? <img src={m.photoDesktop} alt="" className="w-12 h-14 object-cover rounded-xl" />
                      : <div className="w-12 h-14 bg-espresso-100 rounded-xl flex items-center justify-center text-espresso-700 font-bold text-lg">{m.name[0]}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.title}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm">{m.department || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.isActive ? <><Eye size={11}/> Visible</> : <><EyeOff size={11}/> Hidden</>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
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
            <div className="p-6 border-b"><h2 className="font-bold text-gray-900">{editing ? 'Edit' : 'Add'} Team Member</h2></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input value={form.name} onChange={F('name')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Job Title *</label>
                  <input value={form.title} onChange={F('title')} className="form-input" placeholder="Head of Barista Training" />
                </div>
              </div>
              <div>
                <label className="form-label">Department</label>
                <input value={form.department} onChange={F('department')} className="form-input" placeholder="Faculty / Administration" />
              </div>
              <div>
                <label className="form-label">Bio</label>
                <textarea value={form.bio} onChange={F('bio')} rows={3} className="form-input resize-none" />
              </div>
              <div>
                <label className="form-label text-xs">Photo Desktop URL <span className="text-gray-400">(400×500px portrait)</span></label>
                <input value={form.photoDesktop} onChange={F('photoDesktop')} className="form-input" placeholder="https://..." />
                {form.photoDesktop && <img src={form.photoDesktop} className="mt-2 w-20 h-24 object-cover rounded-xl" alt="" />}
              </div>
              <div>
                <label className="form-label text-xs">Photo Mobile URL <span className="text-gray-400">(300×380px tighter crop)</span></label>
                <input value={form.photoMobile} onChange={F('photoMobile')} className="form-input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email</label>
                  <input value={form.email} onChange={F('email')} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={F('sortOrder')} className="form-input" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={F('isActive')} className="rounded" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">{editing ? 'Save' : 'Add'} Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
