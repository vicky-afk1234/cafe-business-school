import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, FileText, Mail, Phone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admissions' }
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [hero, admission] = await prisma.$transaction([
      prisma.heroSection.findFirst({ where: { page: 'admissions', isActive: true } }),
      prisma.admissionPage.findFirst(),
    ])
    return { hero, admission }
  } catch { return { hero: null, admission: null } }
}

export default async function AdmissionPage() {
  const { hero, admission } = await getData()

  // Hero section defaults
  const heroHeadline = hero?.headline || 'Admissions'
  const heroAccent = hero?.headlineAccent || 'Open Now'
  const heroBody = hero?.bodyText ||
    'Start your journey towards a thriving café career. Apply now and join our next intake.'
  const heroBadge = hero?.badge || 'Apply'
  const heroSubheadline = hero?.subheadline
  const overlayColor = hero?.overlayColor || '#0f0d2f'
  const overlayOpacity = Math.min(Math.max(hero?.overlayOpacity ?? 0.72, 0), 1)

  // Admission section defaults
  const reqTitle = admission?.reqTitle || 'Entry Requirements'
  const reqSubtitle = admission?.reqSubtitle || ''
  const requirements = (admission?.requirements as Array<{ title: string; description: string }> || []) || []
  const processTitle = admission?.processTitle || 'Application Process'
  const processSteps = (admission?.processSteps as Array<{ number: number; title: string; description: string }> || []) || []
  const faqTitle = admission?.faqTitle || 'Frequently Asked Questions'
  const faqs = (admission?.faqs as Array<{ question: string; answer: string }> || []) || []
  const documents = (admission?.documents as string[] || []) || []
  const contactEmail = admission?.contactEmail || 'admissions@gcbs.edu.sg'
  const contactPhone = admission?.contactPhone || '+65 6XXX XXXX'
  const contactHeading = admission?.contactHeading || 'Questions? Get in Touch'
  const contactBody = admission?.contactBody || 'Our admissions team is here to help and answer any questions you may have.'
  const ctaLabel = admission?.ctaLabel || 'Start Your Application'

  return (
    <>
      {/* Hero */}
      <section className="relative bg-coffee-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.mobileImageUrl && (
            <Image src={hero.mobileImageUrl} alt="" fill className="object-cover sm:hidden opacity-20" sizes="768px" />
          )}
          {hero?.desktopImageUrl && (
            <Image
              src={hero.desktopImageUrl}
              alt=""
              fill
              className={`object-cover ${hero?.mobileImageUrl ? 'hidden sm:block' : ''} opacity-20`}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-coffee-950/70" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="section-label text-espresso-300">{heroBadge}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {heroHeadline}<br /><span className="text-espresso-300 italic">{heroAccent}</span>
          </h1>
          {heroSubheadline && <p className="text-cream-100 max-w-2xl mx-auto text-xl mb-3">{heroSubheadline}</p>}
          <p className="text-coffee-300 max-w-xl mx-auto text-lg">
            {heroBody}
          </p>
        </div>
      </section>

      {/* Entry Requirements */}
      {requirements.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="text-center mb-16">
              <span className="section-label">Before You Apply</span>
              <h2 className="section-title">{reqTitle}</h2>
              {reqSubtitle && <p className="mt-4 text-lg text-coffee-700 max-w-2xl mx-auto">{reqSubtitle}</p>}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map((req, idx) => (
                <div key={idx} className="bg-gradient-to-br from-cream-100 to-white p-6 rounded-2xl border border-coffee-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-espresso-500 text-white flex items-center justify-center shrink-0 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-coffee-950 mb-2">{req.title}</h3>
                      <p className="text-sm text-coffee-600">{req.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Required Documents */}
      {documents.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="container-main">
            <div className="text-center mb-16">
              <span className="section-label">What You Need</span>
              <h2 className="section-title">Required <span>Documents</span></h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-coffee-200">
                  <FileText className="text-espresso-500 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-coffee-950">{doc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Application Process */}
      {processSteps.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="text-center mb-16">
              <span className="section-label">Your Journey</span>
              <h2 className="section-title">{processTitle}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Connection line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 left-[calc(50%+2rem)] right-[calc(-50%-2rem)] h-1 bg-gradient-to-r from-espresso-500 to-espresso-200" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-espresso-500 text-white flex items-center justify-center font-bold mb-4 text-xl">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-coffee-950 mb-2">{step.title}</h3>
                    <p className="text-sm text-coffee-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="container-main">
            <div className="text-center mb-16">
              <span className="section-label">Common Questions</span>
              <h2 className="section-title">{faqTitle}</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-lg border border-coffee-200 p-6 cursor-pointer hover:border-espresso-400 transition-colors group">
                  <summary className="font-semibold text-coffee-950 flex items-center justify-between">
                    {faq.question}
                    <span className="text-espresso-500 group-open:rotate-180 transition-transform">+</span>
                  </summary>
                  <div className="mt-4 text-coffee-700 leading-relaxed text-sm">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Get Support</span>
              <h2 className="section-title mb-8">{contactHeading}</h2>
              <p className="text-lg text-coffee-700 mb-8">{contactBody}</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-espresso-100 text-espresso-500 flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-coffee-950 mb-1">Email</div>
                    <a href={`mailto:${contactEmail}`} className="text-espresso-600 hover:underline">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-espresso-100 text-espresso-500 flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-coffee-950 mb-1">Phone</div>
                    <a href={`tel:${contactPhone}`} className="text-espresso-600 hover:underline">
                      {contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cream-100 to-white rounded-3xl p-8 border border-coffee-200 shadow-lg">
              <h3 className="text-2xl font-bold text-coffee-950 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Ready to Apply?
              </h3>
              <p className="text-coffee-700 mb-8">
                Start your application today. The admissions team will review your submission and get back to you within 24-48 hours.
              </p>
              <Link href="/contact" className="btn-primary inline-block w-full text-center">
                {ctaLabel}
              </Link>
              <p className="text-xs text-coffee-500 text-center mt-4">
                Already applied? <Link href="/#apply" className="text-espresso-600 font-medium hover:underline">Track your status</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="section-padding bg-coffee-950">
        <div className="container-main">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              What Happens <span className="text-espresso-400">After You Apply</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-espresso-500 text-white flex items-center justify-center font-bold">1</div>
                  <h3 className="text-xl font-bold text-white">Review</h3>
                </div>
                <p className="text-coffee-300">Your application is reviewed by our admissions team within 24-48 hours.</p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-espresso-500 text-white flex items-center justify-center font-bold">2</div>
                  <h3 className="text-xl font-bold text-white">Interview</h3>
                </div>
                <p className="text-coffee-300">We may invite you for a brief interview to discuss your goals and background.</p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-espresso-500 text-white flex items-center justify-center font-bold">3</div>
                  <h3 className="text-xl font-bold text-white">Decision</h3>
                </div>
                <p className="text-coffee-300">Receive your admission decision and payment details within 5 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
