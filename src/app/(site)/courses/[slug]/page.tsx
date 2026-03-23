import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Award, Globe, CheckCircle2, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const course = await prisma.course.findUnique({ where: { slug: params.slug } })
    if (!course) return { title: 'Course Not Found' }
    return {
      title: course.metaTitle || course.title,
      description: course.metaDescription || course.tagline || undefined,
    }
  } catch { return { title: 'Course' } }
}

export default async function CourseDetailPage({ params }: Props) {
  let course: any
  try {
    course = await prisma.course.findUnique({
      where: { slug: params.slug, isActive: true },
      include: { category: true },
    })
  } catch {
    // fallback sample
    course = null
  }

  if (!course) notFound()

  const outcomes: string[] = Array.isArray(course.outcomes) ? course.outcomes : []
  const curriculum: { module: string; topics: string[] }[] = Array.isArray(course.curriculum) ? course.curriculum : []
  const careerPaths: string[] = Array.isArray(course.careerPaths) ? course.careerPaths : []

  return (
    <>
      {/* Hero banner — art-directed desktop vs mobile */}
      <section className="relative bg-coffee-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          {course.bannerMobile && (
            <Image src={course.bannerMobile} alt={course.title} fill className="object-cover sm:hidden opacity-25" sizes="768px" />
          )}
          <Image
            src={course.bannerDesktop || course.thumbnailDesktop || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80'}
            alt={course.title}
            fill
            className={`object-cover ${course.bannerMobile ? 'hidden sm:block' : ''} opacity-25`}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-coffee-950 via-coffee-950/80 to-transparent" />
        </div>
        <div className="container-main relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-coffee-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link href="/courses" className="hover:text-white">Programmes</Link>
            <ChevronRight size={12} />
            <span className="text-white">{course.title}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-espresso-500/20 border border-espresso-400/30 text-espresso-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-5">
              {course.category.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              {course.title}
            </h1>
            {course.tagline && <p className="text-coffee-300 text-xl mb-8">{course.tagline}</p>}

            <div className="flex flex-wrap gap-4 text-sm mb-8">
              {[
                { icon: Clock,  label: course.duration },
                { icon: Award,  label: course.level.replace(/_/g, ' ') },
                { icon: Globe,  label: course.language || 'English' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  <Icon size={14} className="text-espresso-400" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Link href="/#apply" className="btn-primary">Apply Now ☕</Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white border-2 border-white/30 hover:border-white/60 transition-all text-sm font-semibold">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-padding bg-cream-100">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-coffee-950 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>About This Programme</h2>
                <div className="text-coffee-700 leading-relaxed whitespace-pre-line">{course.description}</div>
              </div>

              {/* Outcomes */}
              {outcomes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-coffee-950 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>What You'll Learn</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {outcomes.map((o: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-coffee-700">
                        <CheckCircle2 size={16} className="text-espresso-500 mt-0.5 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curriculum */}
              {curriculum.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-coffee-950 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Curriculum</h2>
                  <div className="space-y-3">
                    {curriculum.map((mod: { module: string; topics: string[] }, i: number) => (
                      <div key={i} className="border border-coffee-100 rounded-xl overflow-hidden">
                        <div className="bg-coffee-50 px-5 py-3 font-semibold text-coffee-900 text-sm">{mod.module}</div>
                        <ul className="px-5 py-3 space-y-1.5">
                          {mod.topics.map((t: string, j: number) => (
                            <li key={j} className="text-sm text-coffee-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-espresso-400 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career paths */}
              {careerPaths.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-coffee-950 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Career Opportunities</h2>
                  <div className="flex flex-wrap gap-3">
                    {careerPaths.map((c: string, i: number) => (
                      <span key={i} className="bg-espresso-50 text-espresso-700 border border-espresso-200 px-4 py-2 rounded-full text-sm font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-coffee-100 shadow-sm p-6 sticky top-32">
                <h3 className="font-bold text-coffee-950 mb-5 text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>Programme Details</h3>
                <dl className="space-y-4 text-sm">
                  {[
                    { label: 'Duration', value: course.duration },
                    { label: 'Level', value: course.level.replace(/_/g,' ') },
                    { label: 'Language', value: course.language || 'English' },
                    ...(course.localFee ? [{ label: 'Local Fee', value: `${course.currency} ${Number(course.localFee).toLocaleString()}` }] : []),
                    ...(course.intlFee  ? [{ label: 'Intl Fee',  value: `${course.currency} ${Number(course.intlFee).toLocaleString()}`  }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-coffee-50 pb-3 last:border-0">
                      <dt className="text-coffee-500">{label}</dt>
                      <dd className="font-semibold text-coffee-900 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 space-y-3">
                  <Link href="/#apply" className="btn-primary w-full justify-center">Apply Now</Link>
                  <Link href="/contact" className="btn-secondary w-full justify-center">Download Brochure</Link>
                </div>

                <div className="mt-6 bg-espresso-50 rounded-xl p-4 text-xs text-espresso-700">
                  <div className="font-semibold mb-1">Next Intake</div>
                  <div>January 2025 & July 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
