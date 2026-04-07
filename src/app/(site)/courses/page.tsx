import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Award, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Programmes & Courses' }
export const revalidate = 60

const levelLabels: Record<string,string> = {
  CERTIFICATE: 'Certificate', DIPLOMA: 'Diploma',
  ADVANCED_DIPLOMA: 'Advanced Diploma', HIGHER_DIPLOMA: 'Higher Diploma',
  POSTGRADUATE_DIPLOMA: 'Postgraduate Diploma',
}

export default async function CoursesPage() {
  const [courses, hero] = await prisma.$transaction([
    prisma.course.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    }),
    prisma.heroSection.findFirst({ where: { page: 'courses', isActive: true } }),
  ])

  return (
    <>
      {/* Page hero */}
      <section className="relative bg-coffee-950 pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.desktopImageUrl && (
            <Image src={hero.desktopImageUrl} alt="" fill className="object-cover hidden sm:block" sizes="100vw" />
          )}
          {hero?.mobileImageUrl && (
            <Image src={hero.mobileImageUrl} alt="" fill className="object-cover sm:hidden" sizes="768px" />
          )}
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="section-label text-espresso-300">{hero?.badge || 'Our Programmes'}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {hero?.headline || 'Programmes'}
            {hero?.headlineAccent && (
              <>
                <br />
                <span className="text-espresso-300 italic">{hero.headlineAccent}</span>
              </>
            )}
          </h1>
          {hero?.subheadline && <p className="text-cream-100 mt-3 max-w-2xl mx-auto">{hero.subheadline}</p>}
          {hero?.bodyText && <p className="text-coffee-300 mt-4 max-w-xl mx-auto">{hero.bodyText}</p>}
        </div>
      </section>

      {/* Courses grid */}
      <section className="section-padding bg-espresso-900">
        <div className="container-main">
          {courses.length === 0 ? (
            <div className="text-center py-20 text-coffee-400">No courses available at this time.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <article key={course.id} className="group bg-espresso-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-espresso-600 card-hover">
                  <div className="relative h-56 overflow-hidden bg-coffee-200">
                    {/* Art direction: show portrait on mobile, landscape on desktop */}
                    {course.thumbnailMobile && (
                      <Image
                        src={course.thumbnailMobile}
                        alt={course.title}
                        fill
                        className="object-cover sm:hidden group-hover:scale-105 transition-transform duration-500"
                        sizes="100vw"
                      />
                    )}
                    {course.thumbnailDesktop && (
                      <Image
                        src={course.thumbnailDesktop}
                        alt={course.title}
                        fill
                        className={`object-cover ${course.thumbnailMobile ? 'hidden sm:block' : ''} group-hover:scale-105 transition-transform duration-500`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-cream-200 text-espresso-900">
                        {levelLabels[course.level] || course.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-espresso-500 font-semibold uppercase tracking-widest mb-2">{course.category.name}</div>
                    <h3 className="text-xl font-bold text-coffee-950 mb-2 group-hover:text-espresso-600 transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {course.title}
                    </h3>
                    {course.tagline && <p className="text-sm text-coffee-600 leading-relaxed mb-4">{course.tagline}</p>}
                    <div className="flex items-center gap-4 text-xs text-coffee-500 mb-5">
                      <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                      {course.localFee && (
                        <span className="flex items-center gap-1"><Award size={12} />{course.currency} {Number(course.localFee).toLocaleString()}</span>
                      )}
                    </div>
                    <Link href={`/courses/${course.slug}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-espresso-600 hover:gap-3 transition-all group/link">
                      View Programme <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-20 text-center bg-coffee-950 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 text-espresso-400" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Not sure which programme is right for you?
              </h2>
              <p className="text-coffee-300 mb-8 max-w-lg mx-auto">
                Book a free consultation with our admissions team. We'll help you choose the right path for your career goals.
              </p>
              <Link href="/#apply" className="btn-primary">Book Free Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
