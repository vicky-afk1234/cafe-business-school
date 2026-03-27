import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export default async function Footer() {
  const settingKeys = [
    'contact_phone',
    'contact_email',
    'contact_address',
    'contact_hours',
    'social_facebook',
    'social_instagram',
    'social_youtube',
    'social_linkedin',
    'school_edutrust_no',
    'school_reg_no',
  ]

  const settingsRows = await prisma.siteSetting.findMany({
    where: { key: { in: settingKeys } },
  })

  const settings = settingsRows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  const phoneText = settings.contact_phone || '+65 0000 0000'
  const phoneHref = `tel:${phoneText.replace(/[^\d+]/g, '')}`
  const emailText = settings.contact_email || 'enquiry@gcbs.edu.sg'
  const addressText = settings.contact_address || '123 Orchard Road, Singapore 238858'
  const hoursText = settings.contact_hours || 'Mon-Fri 9am-6pm'
  const regNo = settings.school_reg_no || '202000001X'
  const eduTrustNo = settings.school_edutrust_no || 'EduTrust Certified'

  return (
    <footer className="bg-coffee-950 text-coffee-200">
      {/* Top wave */}
      <div className="overflow-hidden">
        <svg viewBox="0 0 1440 60" className="w-full text-cream-100 fill-current" preserveAspectRatio="none" style={{ height: 60 }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container-main pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-espresso-500 flex items-center justify-center text-white text-xl font-bold">
                ☕
              </div>
              <div>
                <div className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Global Café
                </div>
                <div className="text-xs text-espresso-400 font-semibold tracking-widest uppercase">
                  Business School
                </div>
              </div>
            </div>
            <p className="text-sm text-coffee-400 leading-relaxed mb-6">
              Empowering the next generation of café entrepreneurs and barista professionals through world-class education and hands-on training.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: settings.social_facebook || '#', label: 'Facebook' },
                { icon: Instagram, href: settings.social_instagram || '#', label: 'Instagram' },
                { icon: Youtube, href: settings.social_youtube || '#', label: 'YouTube' },
                { icon: Linkedin, href: settings.social_linkedin || '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-coffee-800 flex items-center justify-center text-coffee-300 hover:bg-espresso-500 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Programmes', href: '/courses' },
                { label: 'Our Team', href: '/about#team' },
                { label: 'Our Facilities', href: '/about#facilities' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Student Testimonials', href: '/about#testimonials' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">Programmes</h4>
            <ul className="space-y-3">
              {[
                { label: 'Diploma in Café Management', href: '/courses/diploma-cafe-management' },
                { label: 'Barista Certification', href: '/courses/barista-certification' },
                { label: 'Advanced Café Operations', href: '/courses/advanced-cafe-operations' },
                { label: 'Postgraduate Diploma', href: '/courses/postgraduate-diploma' },
                { label: 'Apply Now', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-coffee-400">
                <MapPin size={16} className="text-espresso-400 mt-0.5 shrink-0" />
                {addressText}
              </li>
              <li>
                <Link href={phoneHref} className="flex items-center gap-3 text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                  <Phone size={16} className="text-espresso-400 shrink-0" />
                  {phoneText}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${emailText}`} className="flex items-center gap-3 text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                  <Mail size={16} className="text-espresso-400 shrink-0" />
                  {emailText}
                </Link>
              </li>
            </ul>

            <p className="text-xs text-coffee-500 mt-3">{hoursText}</p>

            <div className="mt-8 p-4 rounded-xl bg-coffee-900 border border-coffee-800">
              <div className="text-xs text-coffee-500 uppercase tracking-widest mb-1">Accreditation</div>
              <div className="text-sm text-coffee-300 font-medium">{eduTrustNo}</div>
              <div className="text-xs text-coffee-500 mt-0.5">PEI Reg. No.: {regNo}</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-coffee-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-coffee-600">
            © {new Date().getFullYear()} Global Café Business School. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Student Protection'].map((l) => (
              <Link key={l} href="#" className="text-xs text-coffee-600 hover:text-espresso-400 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
