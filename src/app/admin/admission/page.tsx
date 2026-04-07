'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

type AdmissionData = {
  id?: string
  reqTitle?: string
  reqSubtitle?: string
  requirements?: Array<{ title: string; description: string }>
  processTitle?: string
  processSteps?: Array<{ number: number; title: string; description: string }>
  faqTitle?: string
  faqs?: Array<{ question: string; answer: string }>
  documents?: string[]
  contactEmail?: string
  contactPhone?: string
  contactHeading?: string
  contactBody?: string
  ctaLabel?: string
  ctaUrl?: string
  isActive?: boolean
}

export default function AdmissionPage() {
  const [form, setForm] = useState<AdmissionData>({
    reqTitle: 'Entry Requirements',
    reqSubtitle: '',
    requirements: [],
    processTitle: 'Application Process',
    processSteps: [],
    faqTitle: 'Frequently Asked Questions',
    faqs: [],
    documents: [],
    contactHeading: 'Questions? Get in Touch',
    contactBody: '',
    ctaLabel: 'Start Your Application',
    ctaUrl: '',
    isActive: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/admission')
      .then(r => r.json())
      .then(data => {
        if (data && data.id) setForm(data)
      })
  }, [])

  const F = (field: keyof AdmissionData) => (e: any) => 
    setForm(f => ({ ...f, [field]: e.target.value }))

  // Requirements
  const addRequirement = () => {
    setForm(f => ({ ...f, requirements: [...(f.requirements || []), { title: '', description: '' }] }))
  }

  const updateRequirement = (idx: number, field: string, value: string) => {
    const reqs = [...(form.requirements || [])]
    reqs[idx] = { ...reqs[idx], [field]: value } as any
    setForm(f => ({ ...f, requirements: reqs }))
  }

  const removeRequirement = (idx: number) => {
    setForm(f => ({ ...f, requirements: (f.requirements || []).filter((_, i) => i !== idx) }))
  }

  // Process Steps
  const addStep = () => {
    const step = { number: (form.processSteps || []).length + 1, title: '', description: '' }
    setForm(f => ({ ...f, processSteps: [...(f.processSteps || []), step] }))
  }

  const updateStep = (idx: number, field: string, value: any) => {
    const steps = [...(form.processSteps || [])]
    steps[idx] = { ...steps[idx], [field]: value } as any
    setForm(f => ({ ...f, processSteps: steps }))
  }

  const removeStep = (idx: number) => {
    setForm(f => ({ ...f, processSteps: (f.processSteps || []).filter((_, i) => i !== idx) }))
  }

  // FAQs
  const addFaq = () => {
    setForm(f => ({ ...f, faqs: [...(f.faqs || []), { question: '', answer: '' }] }))
  }

  const updateFaq = (idx: number, field: string, value: string) => {
    const faqs = [...(form.faqs || [])]
    faqs[idx] = { ...faqs[idx], [field]: value } as any
    setForm(f => ({ ...f, faqs }))
  }

  const removeFaq = (idx: number) => {
    setForm(f => ({ ...f, faqs: (f.faqs || []).filter((_, i) => i !== idx) }))
  }

  // Documents
  const addDocument = () => {
    setForm(f => ({ ...f, documents: [...(f.documents || []), ''] }))
  }

  const updateDocument = (idx: number, value: string) => {
    const docs = [...(form.documents || [])]
    docs[idx] = value
    setForm(f => ({ ...f, documents: docs }))
  }

  const removeDocument = (idx: number) => {
    setForm(f => ({ ...f, documents: (f.documents || []).filter((_, i) => i !== idx) }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/admission', {
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Admission Page</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the Admission page content</p>
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Entry Requirements</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.reqTitle || ''}
              onChange={F('reqTitle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea
            value={form.reqSubtitle || ''}
            onChange={F('reqSubtitle')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Requirements</h3>
            <button
              onClick={addRequirement}
              className="text-sm bg-espresso-500 text-white px-3 py-1 rounded hover:bg-espresso-600"
            >
              + Add Requirement
            </button>
          </div>
          
          <div className="space-y-4">
            {(form.requirements || []).map((req, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  value={req.title}
                  onChange={(e) => updateRequirement(idx, 'title', e.target.value)}
                  placeholder="Requirement title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                />
                <textarea
                  value={req.description}
                  onChange={(e) => updateRequirement(idx, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                />
                <button
                  onClick={() => removeRequirement(idx)}
                  className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Steps Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Application Process</h2>
          <button
            onClick={addStep}
            className="text-sm bg-espresso-500 text-white px-3 py-1 rounded hover:bg-espresso-600"
          >
            + Add Step
          </button>
        </div>
        
        <div className="space-y-4">
          {(form.processSteps || []).map((step, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Step #</label>
                  <input
                    type="number"
                    value={step.number}
                    onChange={(e) => updateStep(idx, 'number', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(idx, 'title', e.target.value)}
                    placeholder="Step title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(idx, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
                />
              </div>
              <button
                onClick={() => removeStep(idx)}
                className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
            <p className="text-sm text-gray-500 mt-1">Frequently asked questions</p>
          </div>
          <button
            onClick={addFaq}
            className="text-sm bg-espresso-500 text-white px-3 py-1 rounded hover:bg-espresso-600"
          >
            + Add FAQ
          </button>
        </div>
        
        <div className="space-y-4">
          {(form.faqs || []).map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                placeholder="Answer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
              />
              <button
                onClick={() => removeFaq(idx)}
                className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
          <button
            onClick={addDocument}
            className="text-sm bg-espresso-500 text-white px-3 py-1 rounded hover:bg-espresso-600"
          >
            + Add Document
          </button>
        </div>
        
        <div className="space-y-3">
          {(form.documents || []).map((doc, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={doc}
                onChange={(e) => updateDocument(idx, e.target.value)}
                placeholder="e.g. Passport copy, Qualification certificate"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
              />
              <button
                onClick={() => removeDocument(idx)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.contactEmail || ''}
              onChange={F('contactEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.contactPhone || ''}
              onChange={F('contactPhone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
          <input
            type="text"
            value={form.contactHeading || ''}
            onChange={F('contactHeading')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
          <textarea
            value={form.contactBody || ''}
            onChange={F('contactBody')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso-500"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Call to Action</h2>
        
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
