'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Image, Layers, BookOpen, Users,
  MessageSquare, Star, GalleryHorizontal, Settings,
  LogOut, Coffee, Megaphone, Grid3x3, Handshake
} from 'lucide-react'

const sections = [
  {
    label: 'Overview',
    links: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/admin/hero',     icon: Layers,            label: 'Hero Sections' },
      { href: '/admin/about',    icon: BookOpen,          label: 'About Page' },
      { href: '/admin/admission', icon: BookOpen,         label: 'Admission Page' },
      { href: '/admin/banners',  icon: Image,             label: 'Banners' },
      { href: '/admin/announcements', icon: Megaphone,    label: 'Announcements' },
      { href: '/admin/course-categories', icon: Grid3x3, label: 'Categories' },
      { href: '/admin/courses',  icon: BookOpen,          label: 'Courses' },
      { href: '/admin/partners', icon: Handshake,         label: 'Partners' },
    ],
  },
  {
    label: 'People',
    links: [
      { href: '/admin/enquiries',    icon: MessageSquare, label: 'Enquiries' },
      { href: '/admin/testimonials', icon: Star,          label: 'Testimonials' },
      { href: '/admin/team',         icon: Users,         label: 'Team' },
      { href: '/admin/gallery',      icon: GalleryHorizontal, label: 'Gallery' },
    ],
  },
  {
    label: 'System',
    links: [
      { href: '/admin/settings', icon: Settings,          label: 'Site Settings' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-espresso-500 flex items-center justify-center text-white">
            <Coffee size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">GCBS Admin</div>
            <div className="text-xs text-gray-400">Content Manager</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.links.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link href={href} className={`admin-sidebar-link ${isActive ? 'active' : ''}`}>
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link href="/" target="_blank" className="admin-sidebar-link text-xs text-gray-500">
          <Coffee size={14} />
          View Live Site ↗
        </Link>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="admin-sidebar-link w-full text-red-500 hover:text-red-700 hover:bg-red-50">
            <LogOut size={14} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
