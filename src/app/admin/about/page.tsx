'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import ImageUploadField from '@/components/admin/ImageUploadField'

type AboutData = {
  id?: string
  missionBadge?: string
  missionTitle?: string
  missionAccent?: string
  missionBody?: string
  missionImageUrl?: string
  missionImageAlt?: string
  highlights?: string[]
  values?: Array<{ icon: string; title: string; description: string }>
  ctaHeading?: string
  ctaSubheading?: string
  ctaLabel?: string
  ctaUrl?: string
  isActive?: boolean
}

export default function AboutPage() {
  const [form, setForm] = useState<AboutData>({
    missionBadge: 'Our Mission',
    missionTitle: 'Transforming Coffee Passion',
    missionAccent: 'into Professional Careers',
    missionBody: '',
    missionImageUrl: '',
    highlights: [],
    values: [
      { icon: '🎯', title: 'Excellence', description: '' },
      { icon: '🤝', title: 'Industry Partnerships', description: '' },
      { icon: '💡', title: 'Innovation', description: '' },
      { icon: '🌱', title: 'Sustainability', description: '' },
    ],
    ctaHeading: 'Ready to Join Our Community?',
    ctaSubheading: 'Take the first step towards your café career.',
    ctaLabel: 'Apply Now',
    ctaUrl: '/#apply',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/about')
      .then(r => r.json())
      .then(data => {
        if (data && data.id) setForm(data)
      })
  }, [])

  const F = (field: keyof AboutData) => (e: any) => 
    setForm(f => ({ ...f, [field]: e.target.value }))

  const updateHighlight = (idx: number, value: string) => {
    const hl = [...(form.highlights || [])]
    hl[idx] = value
    setForm(f => ({ ...f, highlights: hl }))
  }

  const addHighlight = () => {
    setForm(f => ({ ...f, highlights: [...(f.highlights || []), ''] }))
  }

  const removeHighlight = (idx: number) => {
    setForm(f => ({ ...f, highlights: (f.highlights || []).filter((_, i) => i !== idx) }))
  }

  const updateValue = (idx: number, field: string, value: string) => {
    const vals = [...(form.values || [])]
    vals[idx] = { ...vals[idx], [field]: value } as any
    setForm(f => ({ ...f, values: vals }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        setForm(updated)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit About Page</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the About page content</p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Mission Section</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
          <input
            type="text"
            value={form.missionBadge || ''}
            onChange={F('missionBadge')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.missionTitle || ''}
              onChange={F('missionTitle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent</label>
            <input
              type="text"
              value={form.missionAccent || ''}
              onChange={F('missionAccent')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
          <textarea
            value={form.missionBody || ''}
            onChange={F('missionBody')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <ImageUploadField
          label="Mission Image"
          value={form.missionImageUrl || ''}
          onChange={(url) => setForm(f => ({ ...f, missionImageUrl: url }))}
        />
      </div>

      {/* Highlights Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Highlights/Certifications</h2>
          <button
            onClick={addHighlight}
            className="text-sm bg-espresso-500 text-white px-3 py-1 rounded hover:bg-espresso-600"
          >
            + Add Highlight
          </button>
        </div>
        
        <div className="space-y-3">
          {(form.highlights || []).map((hl, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={hl}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder="Enter highlight/certification"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
              />
              <button
                onClick={() => removeHighlight(idx)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Core Values</h2>
        
        <div className="space-y-6">
          {(form.values || []).map((val, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <input
                    type="text"
                    value={val.icon}
                    onChange={(e) => updateValue(idx, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                    placeholder="🎯"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => updateValue(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={val.description}
                  onChange={(e) => updateValue(idx, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Call to Action</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
          <input
            type="text"
            value={form.ctaHeading || ''}
            onChange={F('ctaHeading')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
          <input
            type="text"
            value={form.ctaSubheading || ''}
            onChange={F('ctaSubheading')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
            <input
              type="text"
              value={form.ctaLabel || ''}
              onChange={F('ctaLabel')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="text"
              value={form.ctaUrl || ''}
              onChange={F('ctaUrl')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && <div className="text-green-600 flex items-center">✓ Saved successfully!</div>}
      </div>
    </div>
  )
}
