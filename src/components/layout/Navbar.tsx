'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import logo from '../../logo.jpeg'

type Course = {
  id: string
  title: string
  slug: string
}

type SiteSettings = {
  contact_phone?: string
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [settings, setSettings] = useState<SiteSettings>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, settingsRes] = await Promise.all([
          fetch('/api/public/courses', { cache: 'force-cache' }),
          fetch('/api/public/settings', { cache: 'force-cache' }),
        ])

        const coursesData = await coursesRes.json()
        if (Array.isArray(coursesData)) {
          setCourses(coursesData.map(c => ({ id: c.id, title: c.title, slug: c.slug })))
        }

        const settingsData = await settingsRes.json()
        if (settingsData && typeof settingsData === 'object' && !Array.isArray(settingsData)) {
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Failed to fetch navbar data:', error)
      }
    }
    fetchData()
  }, [])

  const phoneText = settings.contact_phone || '+65 0000 0000'
  const phoneHref = `tel:${phoneText.replace(/[^\d+]/g, '')}`

  const navLinks = [
    { label: 'About', href: '/about' },
    {
      label: 'Programmes',
      href: '/courses',
      sub: [
        ...courses.map(course => ({ label: course.title, href: `/courses/${course.slug}` })),
        { label: 'View All Programmes', href: '/courses', divider: true },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 bg-espresso-900 border-b border-espresso-700 shadow-lg transition-all duration-300"
    >
      <div className="container-main">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src={logo}
              alt="Global Café Business School Logo"
              width={80}
              height={85}
              className="group-hover:scale-100 transition-transform"
            />
            <div>
              <div
                className="text-lg font-bold leading-tight text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Global Café
              </div>
              <div className="text-xs text-coffee-300 font-semibold tracking-widest uppercase">
                Business School
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                {link.sub ? (
                  <button
                    className="nav-link flex items-center gap-1"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                )}

                {link.sub && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-espresso-900 rounded-2xl shadow-2xl border border-espresso-700 overflow-hidden min-w-[260px]">
                      {link.sub.map((sub, i) => (
                        <Link
                          key={sub.href + i}
                          href={sub.href}
                          className={`block px-5 py-3 text-sm text-coffee-100 hover:bg-espresso-700 hover:text-white transition-colors ${
                            (sub as any).divider ? 'border-t border-espresso-700 font-semibold text-coffee-200' : ''
                          }`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href={phoneHref} className="flex items-center gap-1.5 text-sm text-coffee-200 hover:text-white transition-colors">
              <Phone size={14} />
              {phoneText}
            </Link>
            <Link href="/contact" className="btn-primary text-sm py-3 px-6">
              Apply Now
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-espresso-700 transition-colors text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-espresso-900 border-t border-espresso-700 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="container-main py-6 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 px-4 text-coffee-100 font-medium text-base hover:text-white hover:bg-espresso-700 rounded-xl transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
                {link.sub && (
                  <div className="ml-4 border-l-2 border-espresso-600 pl-4 space-y-0.5">
                    {link.sub.filter(sub => !(sub as any).divider).map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-2 text-sm text-coffee-300 hover:text-white transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                    <Link
                      href="/courses"
                      className="block py-2 text-sm font-semibold text-coffee-100 border-t border-espresso-600 pt-3 mt-2 hover:text-white transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      View All Programmes
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-espresso-700 space-y-3">
              <Link href={phoneHref} className="flex items-center gap-2 py-3 px-4 text-coffee-200 text-sm">
                <Phone size={14} />
                {phoneText}
              </Link>
              <Link
                href="/contact"
                className="btn-primary w-full justify-center"
                onClick={() => setOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
