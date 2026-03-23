'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

type Setting = { id: string; key: string; value: string; label?: string | null; group?: string | null; type: string }

const SETTING_GROUPS = [
  {
    group: 'contact',
    label: 'Contact Information',
    keys: [
      { key: 'contact_phone',   label: 'Phone Number',  type: 'text', placeholder: '+65 0000 0000' },
      { key: 'contact_email',   label: 'Email Address', type: 'text', placeholder: 'enquiry@gcbs.edu.sg' },
      { key: 'contact_address', label: 'Address',       type: 'text', placeholder: '123 Orchard Road, Singapore' },
      { key: 'contact_hours',   label: 'Office Hours',  type: 'text', placeholder: 'Mon–Fri 9am–6pm' },
    ],
  },
  {
    group: 'social',
    label: 'Social Media',
    keys: [
      { key: 'social_facebook',  label: 'Facebook URL',  type: 'text', placeholder: 'https://facebook.com/...' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
      { key: 'social_youtube',   label: 'YouTube URL',   type: 'text', placeholder: 'https://youtube.com/...' },
      { key: 'social_linkedin',  label: 'LinkedIn URL',  type: 'text', placeholder: 'https://linkedin.com/...' },
    ],
  },
  {
    group: 'seo',
    label: 'SEO & Meta',
    keys: [
      { key: 'seo_title',       label: 'Default Page Title',       type: 'text' },
      { key: 'seo_description', label: 'Default Meta Description', type: 'textarea' },
      { key: 'seo_keywords',    label: 'Meta Keywords',            type: 'text' },
      { key: 'seo_og_image',    label: 'OG Image URL',             type: 'text', placeholder: 'https://...' },
    ],
  },
  {
    group: 'school',
    label: 'School Information',
    keys: [
      { key: 'school_reg_no',       label: 'PEI Registration No.',     type: 'text' },
      { key: 'school_edutrust_no',  label: 'EduTrust Certificate No.', type: 'text' },
      { key: 'school_edutrust_exp', label: 'EduTrust Expiry',          type: 'text' },
      { key: 'school_intake_dates', label: 'Upcoming Intake Dates',    type: 'text', placeholder: 'January 2025, July 2025' },
    ],
  },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((data: Setting[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {}
          data.forEach(s => { map[s.key] = s.value })
          setSettings(map)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading settings...</div>

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Site Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Global configuration for the website</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 px-5">
          <Save size={14} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save All'}
        </button>
      </div>

      {SETTING_GROUPS.map(section => (
        <div key={section.group} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">{section.label}</h2>
          <div className="space-y-4">
            {section.keys.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    value={settings[key] || ''}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    rows={3}
                    className="form-input resize-none"
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    className="form-input"
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
