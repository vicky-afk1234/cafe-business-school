'use client'

import { useState, useEffect } from 'react'
import { Save, Eye } from 'lucide-react'

const PAGES = ['home', 'about', 'courses', 'admissions', 'contact', 'gallery']

type HeroData = {
  id?: string; page: string; badge?: string; headline?: string;
  headlineAccent?: string; subheadline?: string; bodyText?: string;
  ctaPrimary?: string; ctaPrimaryUrl?: string; ctaSecondary?: string;
  ctaSecondaryUrl?: string; desktopImageUrl?: string; mobileImageUrl?: string;
  overlayOpacity?: number; overlayColor?: string; isActive?: boolean;
}

export default function HeroPage() {
  const [heroes, setHeroes] = useState<HeroData[]>([])
  const [selected, setSelected] = useState('home')
  const [form, setForm] = useState<HeroData>({ page: 'home', overlayOpacity: 0.65, overlayColor: '#1a0d08', isActive: true })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/hero')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setHeroes(data) })
  }, [])

  useEffect(() => {
    const h = heroes.find(h => h.page === selected)
    if (h) setForm(h)
    else setForm({ page: selected, overlayOpacity: 0.65, overlayColor: '#1a0d08', isActive: true })
  }, [selected, heroes])

  const F = (field: keyof HeroData) => (e: any) => setForm(f => ({ ...f, [field]: e.target.value }))

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/hero', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const updated = await res.json()
      setHeroes(hs => {
        const idx = hs.findIndex(h => h.page === selected)
        if (idx >= 0) { const n = [...hs]; n[idx] = updated; return n }
        return [...hs, updated]
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Hero Sections</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit hero content for each page. Separate desktop & mobile images for perfect responsive display.</p>
        </div>
        <div className="flex gap-3">
          <a href={`/${selected === 'home' ? '' : selected}`} target="_blank" className="btn-ghost text-sm py-2.5 px-4">
            <Eye size={14} /> Preview
          </a>
          <button onClick={save} disabled={saving} className="btn-primary text-sm py-2.5 px-5">
            <Save size={14} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 flex-wrap">
        {PAGES.map(p => (
          <button key={p} onClick={() => setSelected(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              selected === p ? 'bg-espresso-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-espresso-300'
            }`}
          >
            {p} {heroes.find(h => h.page === p) ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Image spec guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <strong className="text-blue-800">Hero Image Specs:</strong>
        <div className="mt-2 grid grid-cols-2 gap-4 text-blue-700">
          <div>
            <div className="font-semibold">🖥 Desktop</div>
            <div className="text-xs mt-0.5">1920×1080px minimum (16:9 ratio)</div>
            <div className="text-xs">Format: JPEG/WebP, under 500KB</div>
          </div>
          <div>
            <div className="font-semibold">📱 Mobile</div>
            <div className="text-xs mt-0.5">768×1024px recommended (3:4 portrait)</div>
            <div className="text-xs">Different crop/composition from desktop</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-5">
          {/* Text fields */}
          <div className="col-span-2">
            <label className="form-label">Badge / Eyebrow Text</label>
            <input value={form.badge || ''} onChange={F('badge')} className="form-input" placeholder="☕ Professional Training Institute" />
          </div>
          <div>
            <label className="form-label">Headline</label>
            <input value={form.headline || ''} onChange={F('headline')} className="form-input" placeholder="Professional" />
          </div>
          <div>
            <label className="form-label">Headline Accent (italic gold)</label>
            <input value={form.headlineAccent || ''} onChange={F('headlineAccent')} className="form-input" placeholder="DIPLOMA IN CAFÉ MANAGEMENT" />
          </div>
          <div>
            <label className="form-label">Subheadline</label>
            <input value={form.subheadline || ''} onChange={F('subheadline')} className="form-input" placeholder="& Barista Skills" />
          </div>
          <div className="col-span-2">
            <label className="form-label">Body Text</label>
            <textarea value={form.bodyText || ''} onChange={F('bodyText')} rows={3} className="form-input resize-none" />
          </div>
          <div>
            <label className="form-label">Primary CTA Label</label>
            <input value={form.ctaPrimary || ''} onChange={F('ctaPrimary')} className="form-input" placeholder="Apply Now ☕" />
          </div>
          <div>
            <label className="form-label">Primary CTA URL</label>
            <input value={form.ctaPrimaryUrl || ''} onChange={F('ctaPrimaryUrl')} className="form-input" placeholder="/admissions/apply" />
          </div>
          <div>
            <label className="form-label">Secondary CTA Label</label>
            <input value={form.ctaSecondary || ''} onChange={F('ctaSecondary')} className="form-input" placeholder="View Course" />
          </div>
          <div>
            <label className="form-label">Secondary CTA URL</label>
            <input value={form.ctaSecondaryUrl || ''} onChange={F('ctaSecondaryUrl')} className="form-input" placeholder="/courses" />
          </div>
        </div>

        {/* Images */}
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">Background Images</h3>
          <div>
            <label className="form-label">Desktop Image URL <span className="text-gray-400 font-normal">(1920×1080 or wider, landscape focus)</span></label>
            <input value={form.desktopImageUrl || ''} onChange={F('desktopImageUrl')} className="form-input" placeholder="https://images.unsplash.com/..." />
            {form.desktopImageUrl && (
              <img src={form.desktopImageUrl} className="mt-2 h-28 w-full object-cover rounded-xl" alt="Desktop preview" />
            )}
          </div>
          <div>
            <label className="form-label">Mobile Image URL <span className="text-gray-400 font-normal">(768×1024 or taller, portrait crop — can be a different composition)</span></label>
            <input value={form.mobileImageUrl || ''} onChange={F('mobileImageUrl')} className="form-input" placeholder="https://images.unsplash.com/..." />
            {form.mobileImageUrl && (
              <img src={form.mobileImageUrl} className="mt-2 h-28 w-48 object-cover rounded-xl" alt="Mobile preview" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Overlay Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.overlayColor || '#1a0d08'} onChange={F('overlayColor')} className="h-10 w-12 rounded-lg border border-gray-200" />
                <input value={form.overlayColor || ''} onChange={F('overlayColor')} className="form-input flex-1" />
              </div>
            </div>
            <div>
              <label className="form-label">Overlay Opacity ({Math.round((form.overlayOpacity || 0.65) * 100)}%)</label>
              <input type="range" min="0" max="1" step="0.05"
                value={form.overlayOpacity || 0.65}
                onChange={e => setForm(f => ({ ...f, overlayOpacity: parseFloat(e.target.value) }))}
                className="w-full mt-3"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-2">
          <input type="checkbox" checked={form.isActive ?? true}
            onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
            className="rounded" />
          <span className="text-sm font-medium text-gray-700">Active (show on site)</span>
        </label>
      </div>
    </div>
  )
}
