import type { Metadata } from 'next'
import CtaSection from '@/components/sections/CtaSection'

export const metadata: Metadata = { title: 'Contact & Enquiry' }

export default function ContactPage() {
  return (
    <>
      <div className="bg-coffee-950 pt-40 pb-16">
        <div className="container-main text-center">
          <span className="section-label text-espresso-400">Get In Touch</span>
          <h1 className="text-5xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Contact <span className="text-espresso-400 italic">GCBS</span>
          </h1>
        </div>
      </div>
      <CtaSection />
    </>
  )
}
