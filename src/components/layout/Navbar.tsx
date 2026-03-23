'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/about' },
  {
    label: 'Programmes',
    href: '/courses',
    sub: [
      { label: 'Diploma in Café Management', href: '/courses/diploma-cafe-management' },
      { label: 'Barista Certification', href: '/courses/barista-certification' },
      { label: 'Advanced Café Operations', href: '/courses/advanced-cafe-operations' },
      { label: 'Postgraduate Diploma', href: '/courses/postgraduate-diploma' },
      { label: 'View All Programmes', href: '/courses' },
    ],
  },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      style={{ top: 'var(--announcement-height, 40px)' }}
    >
      <div className="container-main">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-espresso-500 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-105 transition-transform">
              ☕
            </div>
            <div>
              <div
                className="text-lg font-bold leading-tight text-coffee-950"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Global Café
              </div>
              <div className="text-xs text-espresso-600 font-semibold tracking-widest uppercase">
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
                    <div className="bg-white rounded-2xl shadow-2xl border border-coffee-100 overflow-hidden min-w-[260px]">
                      {link.sub.map((sub, i) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`block px-5 py-3 text-sm text-coffee-800 hover:bg-espresso-50 hover:text-espresso-700 transition-colors ${
                            i === link.sub!.length - 1
                              ? 'border-t border-coffee-100 font-semibold text-espresso-600'
                              : ''
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
            <Link href="tel:+6500000000" className="flex items-center gap-1.5 text-sm text-coffee-700 hover:text-espresso-600 transition-colors">
              <Phone size={14} />
              +65 0000 0000
            </Link>
            <Link href="/admissions/apply" className="btn-primary text-sm py-3 px-6">
              Apply Now
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-coffee-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-coffee-100 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="container-main py-6 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 px-4 text-coffee-800 font-medium text-base hover:text-espresso-600 hover:bg-espresso-50 rounded-xl transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
                {link.sub && (
                  <div className="ml-4 border-l-2 border-espresso-200 pl-4 space-y-0.5">
                    {link.sub.slice(0, -1).map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-2 text-sm text-coffee-600 hover:text-espresso-600 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-coffee-100 space-y-3">
              <Link href="tel:+6500000000" className="flex items-center gap-2 py-3 px-4 text-coffee-700 text-sm">
                <Phone size={14} />
                +65 0000 0000
              </Link>
              <Link
                href="/admissions/apply"
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
