import Image from 'next/image'
import Link from 'next/link'
import { Clock, Award, ArrowRight } from 'lucide-react'

type Course = {
  id: string
  title: string
  slug: string
  tagline?: string | null
  duration: string
  level: string
  thumbnailDesktop?: string | null
  thumbnailMobile?: string | null
  localFee?: any
  currency?: string
  category: { name: string }
}

const FALLBACK_COURSES: Course[] = [
  {
    id: '1', title: 'Diploma in Café Management', slug: 'diploma-cafe-management',
    tagline: 'Master every aspect of running a profitable café business',
    duration: '12 months', level: 'DIPLOMA', currency: 'SGD', localFee: 8500,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
    category: { name: 'Management' },
  },
  {
    id: '2', title: 'Barista Certification Programme', slug: 'barista-certification',
    tagline: 'Professional barista skills recognised worldwide',
    duration: '6 months', level: 'CERTIFICATE', currency: 'SGD', localFee: 4500,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400&q=80',
    category: { name: 'Barista Skills' },
  },
  {
    id: '3', title: 'Advanced Café Operations', slug: 'advanced-cafe-operations',
    tagline: 'Take your café from good to exceptional',
    duration: '9 months', level: 'ADVANCED_DIPLOMA', currency: 'SGD', localFee: 7200,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80',
    category: { name: 'Operations' },
  },
  {
    id: '4', title: 'Coffee Roasting & Sourcing', slug: 'coffee-roasting-sourcing',
    tagline: 'From bean to cup — the complete journey',
    duration: '3 months', level: 'CERTIFICATE', currency: 'SGD', localFee: 3200,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
    category: { name: 'Roasting' },
  },
  {
    id: '5', title: 'Postgraduate Diploma in Café Business', slug: 'postgraduate-diploma',
    tagline: 'Executive-level training for café entrepreneurs',
    duration: '18 months', level: 'POSTGRADUATE_DIPLOMA', currency: 'SGD', localFee: 12000,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80',
    category: { name: 'Business' },
  },
  {
    id: '6', title: 'Hospitality & Café Service', slug: 'hospitality-cafe-service',
    tagline: 'Delivering memorable guest experiences',
    duration: '6 months', level: 'DIPLOMA', currency: 'SGD', localFee: 5800,
    thumbnailDesktop: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    thumbnailMobile: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=80',
    category: { name: 'Hospitality' },
  },
]

const levelLabels: Record<string, string> = {
  CERTIFICATE: 'Certificate',
  DIPLOMA: 'Diploma',
  ADVANCED_DIPLOMA: 'Advanced Diploma',
  HIGHER_DIPLOMA: 'Higher Diploma',
  POSTGRADUATE_DIPLOMA: 'Postgraduate Diploma',
}

const levelColors: Record<string, string> = {
  CERTIFICATE: 'bg-emerald-100 text-emerald-800',
  DIPLOMA: 'bg-espresso-100 text-espresso-800',
  ADVANCED_DIPLOMA: 'bg-coffee-100 text-coffee-800',
  HIGHER_DIPLOMA: 'bg-amber-100 text-amber-800',
  POSTGRADUATE_DIPLOMA: 'bg-purple-100 text-purple-800',
}

export default function CoursesSection({ courses }: { courses?: Course[] }) {
  const items = courses?.length ? courses : FALLBACK_COURSES

  return (
    <section className="section-padding bg-cream-100">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">Our Programmes</span>
          <h2 className="section-title">
            Craft Your <span>Coffee Career</span>
          </h2>
          <p className="mt-4 text-coffee-600 text-lg max-w-2xl mx-auto">
            Industry-aligned programmes designed with Singapore's leading café operators.
            From barista fundamentals to full business management.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((course) => (
            <article key={course.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 card-hover border border-coffee-100">
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden bg-coffee-200">
                <Image
                  // art-direction: mobile uses portrait crop, desktop landscape
                  src={course.thumbnailDesktop || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Level badge */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                    {levelLabels[course.level] || course.level}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-xs text-espresso-500 font-semibold uppercase tracking-widest mb-2">
                  {course.category.name}
                </div>
                <h3 className="text-xl font-bold text-coffee-950 mb-2 group-hover:text-espresso-600 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {course.title}
                </h3>
                {course.tagline && (
                  <p className="text-sm text-coffee-600 leading-relaxed mb-4">{course.tagline}</p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-coffee-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {course.duration}
                  </span>
                  {course.localFee && (
                    <span className="flex items-center gap-1">
                      <Award size={13} />
                      {course.currency} {Number(course.localFee).toLocaleString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="flex items-center gap-1.5 text-sm font-semibold text-espresso-600 hover:gap-3 transition-all duration-200 group/link"
                >
                  Learn More
                  <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View all */}
        <div className="mt-14 text-center">
          <Link href="/courses" className="btn-secondary">
            View All Programmes
          </Link>
        </div>
      </div>
    </section>
  )
}
