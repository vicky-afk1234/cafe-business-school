import { prisma } from '@/lib/prisma'
import { Users, BookOpen, Image, Mail, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
  const [totalCandidates, newCandidates, totalCourses, activeBanners, recentEnquiries] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.count({ where: { status: 'NEW' } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.banner.count({ where: { isActive: true } }),
    prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ])
  return { totalCandidates, newCandidates, totalCourses, activeBanners, recentEnquiries }
}

const statusColors: Record<string, string> = {
  NEW:         'bg-blue-100 text-blue-700',
  CONTACTED:   'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  ENROLLED:    'bg-green-100 text-green-700',
  REJECTED:    'bg-red-100 text-red-700',
  WITHDRAWN:   'bg-gray-100 text-gray-600',
}

export default async function AdminDashboard() {
  const { totalCandidates, newCandidates, totalCourses, activeBanners, recentEnquiries } = await getDashboardStats()

  const stats = [
    { icon: Users,    label: 'Total Enquiries', value: totalCandidates, sub: `${newCandidates} new`, href: '/admin/enquiries', color: 'bg-blue-50 text-blue-600' },
    { icon: TrendingUp, label: 'New Enquiries', value: newCandidates,   sub: 'Awaiting follow-up', href: '/admin/enquiries?status=NEW', color: 'bg-green-50 text-green-600' },
    { icon: BookOpen, label: 'Active Courses', value: totalCourses,     sub: 'Published programmes', href: '/admin/courses', color: 'bg-espresso-50 text-espresso-600' },
    { icon: Image,    label: 'Active Banners',  value: activeBanners,   sub: 'Live on site', href: '/admin/banners', color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening at GCBS.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-espresso-500 transition-colors">View →</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
            </Link>
          )
        })}
      </div>

      {/* Recent enquiries */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Mail size={18} className="text-espresso-500" />
            Recent Enquiries
          </h2>
          <Link href="/admin/enquiries" className="text-sm text-espresso-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Course Interest', 'Type', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEnquiries.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{c.firstName} {c.lastName}</td>
                  <td className="px-5 py-4 text-gray-600">{c.email}</td>
                  <td className="px-5 py-4 text-gray-600 max-w-[200px] truncate">{c.courseInterest || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{c.studentType}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(c.createdAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentEnquiries.length === 0 && (
            <div className="text-center py-12 text-gray-400">No enquiries yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
