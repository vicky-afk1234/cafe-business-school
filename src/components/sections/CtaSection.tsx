'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  firstName:      z.string().min(2, 'First name required'),
  lastName:       z.string().min(2, 'Last name required'),
  email:          z.string().email('Valid email required'),
  phone:          z.string().optional(),
  courseInterest: z.string().min(1, 'Please select a course'),
  studentType:    z.enum(['LOCAL', 'INTERNATIONAL', 'ONLINE']),
  message:        z.string().optional(),
  privacyConsent: z.boolean().refine((v) => v === true, 'Please accept privacy policy'),
  marketingConsent: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

const courses = [
  'Diploma in Café Management',
  'Barista Certification Programme',
  'Advanced Café Operations',
  'Coffee Roasting & Sourcing',
  'Postgraduate Diploma in Café Business',
  'Hospitality & Café Service',
  'Not sure yet — please advise',
]

export default function CtaSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { studentType: 'LOCAL', privacyConsent: false, marketingConsent: false },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="apply" className="section-padding bg-cream-100">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <span className="section-label">Get Started</span>
            <h2 className="section-title mb-6">
              Begin Your <span>Coffee Journey</span><br />Today
            </h2>
            <p className="text-coffee-600 leading-relaxed text-lg mb-8">
              Fill in your details and our admissions team will get back to you within 24 hours.
              No commitment required — just a conversation about your future.
            </p>

            <div className="space-y-4">
              {[
                { icon: '📞', text: '+65 0000 0000', sub: 'Mon–Fri, 9am–6pm' },
                { icon: '📧', text: 'enquiry@gcbs.edu.sg', sub: 'We reply within 24 hours' },
                { icon: '📍', text: '123 Orchard Road, Singapore', sub: '#10-01, 238858' },
              ].map((c) => (
                <div key={c.text} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-coffee-100">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-coffee-900 text-sm">{c.text}</div>
                    <div className="text-xs text-coffee-500">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-3xl shadow-xl border border-coffee-100 p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-coffee-950 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Enquiry Received!
                </h3>
                <p className="text-coffee-600">
                  Thank you for your interest. Our admissions team will contact you within 24 hours. 
                  ☕ In the meantime, feel free to explore our programmes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-coffee-950 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Enquire Now
                  </h3>
                  <p className="text-sm text-coffee-500">Free consultation. No commitment.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input {...register('firstName')} className="form-input" placeholder="Jane" />
                    {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input {...register('lastName')} className="form-input" placeholder="Tan" />
                    {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input {...register('email')} type="email" className="form-input" placeholder="jane@email.com" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="form-label">Phone Number</label>
                  <input {...register('phone')} type="tel" className="form-input" placeholder="+65 9123 4567" />
                </div>

                <div>
                  <label className="form-label">Course Interest *</label>
                  <select {...register('courseInterest')} className="form-input">
                    <option value="">Select a programme...</option>
                    {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.courseInterest && <p className="form-error">{errors.courseInterest.message}</p>}
                </div>

                <div>
                  <label className="form-label">Student Type *</label>
                  <select {...register('studentType')} className="form-input">
                    <option value="LOCAL">Local Student (Singapore PR / Citizen)</option>
                    <option value="INTERNATIONAL">International Student</option>
                    <option value="ONLINE">Online / Part-Time</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Message (Optional)</label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    className="form-input resize-none"
                    placeholder="Tell us about your goals or any questions..."
                  />
                </div>

                {/* Consents */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register('privacyConsent')} className="mt-0.5 rounded border-coffee-300 text-espresso-500 focus:ring-espresso-400" />
                    <span className="text-xs text-coffee-600">
                      I agree to the <a href="/privacy" className="text-espresso-600 underline">Privacy Policy</a> and consent to being contacted about my enquiry. *
                    </span>
                  </label>
                  {errors.privacyConsent && <p className="form-error">{errors.privacyConsent.message}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register('marketingConsent')} className="mt-0.5 rounded border-coffee-300 text-espresso-500 focus:ring-espresso-400" />
                    <span className="text-xs text-coffee-600">
                      I'd like to receive updates about courses, events, and promotions from GCBS.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Send Enquiry
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
