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

const levelLabels: Record<string, string> = {
  CERTIFICATE: 'Certificate',
  DIPLOMA: 'Diploma',
  ADVANCED_DIPLOMA: 'Advanced Diploma',
  HIGHER_DIPLOMA: 'Higher Diploma',
  POSTGRADUATE_DIPLOMA: 'Postgraduate Diploma',
}

const levelColors: Record<string, string> = {
  CERTIFICATE: 'bg-espresso-600 text-white',
  DIPLOMA: 'bg-espresso-500 text-white',
  ADVANCED_DIPLOMA: 'bg-coffee-700 text-white',
  HIGHER_DIPLOMA: 'bg-espresso-700 text-white',
  POSTGRADUATE_DIPLOMA: 'bg-coffee-800 text-white',
}

export default function CoursesSection({ courses }: { courses?: Course[] }) {
  const items = courses || []
  if (items.length === 0) return null

  return (
    <section className="section-padding bg-espresso-900">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label">Our Programmes</span>
          <h2 className="section-title">
            Craft Your <span>Coffee Career</span>
          </h2>
          <p className="mt-4 text-coffee-200 text-lg max-w-2xl mx-auto">
            Industry-aligned programmes designed with Singapore's leading café operators.
            From barista fundamentals to full business management.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((course) => (
            <article key={course.id} className="group bg-espresso-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 card-hover border border-espresso-600">
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden bg-coffee-200">
                {course.thumbnailDesktop && (
                  <Image
                    src={course.thumbnailDesktop}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Level badge */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColors[course.level] || 'bg-espresso-600 text-white'}`}>
                    {levelLabels[course.level] || course.level}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="text-xs text-espresso-500 font-semibold uppercase tracking-widest mb-2">
                  {course.category.name}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-coffee-100 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {course.title}
                </h3>
                {course.tagline && (
                  <p className="text-sm text-coffee-200 leading-relaxed mb-4">{course.tagline}</p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-coffee-300 mb-5">
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
                  className="flex items-center gap-1.5 text-coffee-100 text-sm font-semibold hover:gap-3 transition-all duration-200 group/link"
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
