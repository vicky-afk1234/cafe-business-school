'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react'
import logo from '../../logo.jpeg'

type SiteSettings = Record<string, string>

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/public/settings', { cache: 'no-store' })
        const data = await res.json()
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setSettings(data)
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const phoneText = settings.contact_phone || ''
  const phoneHref = phoneText ? `tel:${phoneText.replace(/[^\d+]/g, '')}` : '#'
  const emailText = settings.contact_email || ''
  const emailHref = emailText ? `mailto:${emailText}` : '#'
  const addressText = settings.contact_address || ''
  const hoursText = settings.contact_hours || ''
  const regNo = settings.school_reg_no || ''
  const eduTrustNo = settings.school_edutrust_no || ''

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
              <Image
                src={logo}
                alt="Global Café Business School Logo"
                width={56}
                height={60}
                className="object-contain"
              />
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
                {addressText || '—'}
              </li>
              <li>
                <Link href={phoneHref} className="flex items-center gap-3 text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                  <Phone size={16} className="text-espresso-400 shrink-0" />
                  {phoneText || '—'}
                </Link>
              </li>
              <li>
                <Link href={emailHref} className="flex items-center gap-3 text-sm text-coffee-400 hover:text-espresso-400 transition-colors">
                  <Mail size={16} className="text-espresso-400 shrink-0" />
                  {emailText || '—'}
                </Link>
              </li>
            </ul>

            {hoursText && <p className="text-xs text-coffee-500 mt-3">{hoursText}</p>}

            <div className="mt-8 p-4 rounded-xl bg-coffee-900 border border-coffee-800">
              <div className="text-xs text-coffee-500 uppercase tracking-widest mb-1">Accreditation</div>
              <div className="text-sm text-coffee-300 font-medium">{eduTrustNo || '—'}</div>
              <div className="text-xs text-coffee-500 mt-0.5">PEI Reg. No.: {regNo || '—'}</div>
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
