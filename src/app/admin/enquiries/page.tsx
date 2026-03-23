'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Mail, Phone, User } from 'lucide-react'

type Candidate = {
  id: string; firstName: string; lastName: string; email: string;
  phone?: string; courseInterest?: string; studentType: string;
  status: string; message?: string; createdAt: string; marketingConsent: boolean;
}

const STATUSES = ['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'ENROLLED', 'REJECTED', 'WITHDRAWN']

const statusColors: Record<string, string> = {
  NEW:         'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  IN_PROGRESS: 'bg-orange-100 text-orange-700 border-orange-200',
  ENROLLED:    'bg-green-100 text-green-700 border-green-200',
  REJECTED:    'bg-red-100 text-red-700 border-red-200',
  WITHDRAWN:   'bg-gray-100 text-gray-600 border-gray-200',
}

export default function EnquiriesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Candidate | null>(null)
  const [page, setPage] = useState(1)

  const fetchCandidates = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (statusFilter !== 'ALL') params.set('status', statusFilter)
    if (search) params.set('search', search)
    try {
      const res = await fetch(`/api/admin/candidates?${params}`)
      const data = await res.json()
      setCandidates(data.candidates || [])
      setTotal(data.total || 0)
    } catch { setCandidates([]) }
    setLoading(false)
  }

  useEffect(() => { fetchCandidates() }, [statusFilter, page])
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchCandidates() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchCandidates()
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
          Enquiries & Candidates
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{total} total records</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === s
                  ? 'bg-espresso-500 text-white border-espresso-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-espresso-300'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Applicant', 'Course Interest', 'Type', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading...</td></tr>
                ) : candidates.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No enquiries found.</td></tr>
                ) : candidates.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`hover:bg-espresso-50 cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-espresso-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs max-w-[180px] truncate">{c.courseInterest || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{c.studentType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-espresso-100 flex items-center justify-center text-espresso-700 font-bold text-lg">
                  {selected.firstName[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{selected.firstName} {selected.lastName}</div>
                  <div className="text-xs text-gray-500">{selected.studentType} Student</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={13} className="shrink-0" />
                  <a href={`mailto:${selected.email}`} className="hover:text-espresso-600 truncate">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={13} className="shrink-0" />
                    {selected.phone}
                  </div>
                )}
              </div>

              {selected.courseInterest && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Course Interest</div>
                  <div className="text-sm text-gray-800 bg-espresso-50 p-3 rounded-xl">{selected.courseInterest}</div>
                </div>
              )}

              {selected.message && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Message</div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed">{selected.message}</div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.slice(1).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        selected.status === s
                          ? (statusColors[s] || 'bg-gray-100 text-gray-600 border-gray-200')
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                Submitted {new Date(selected.createdAt).toLocaleString('en-SG')}
                {selected.marketingConsent && <span className="ml-2 text-green-600">✓ Marketing consent</span>}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <User size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
