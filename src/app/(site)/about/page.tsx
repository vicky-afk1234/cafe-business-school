import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us' }
export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [hero, team, about] = await prisma.$transaction([
      prisma.heroSection.findFirst({ where: { page: 'about', isActive: true } }),
      prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.aboutPage.findFirst(),
    ])
    return { hero, team, about }
  } catch { return { hero: null, team: [], about: null } }
}

export default async function AboutPage() {
  const { hero, team, about } = await getData()
  const heroHeadline = hero?.headline || 'About Global Cafe'
  const heroAccent = hero?.headlineAccent || 'Business School'
  const heroBody = hero?.bodyText ||
    'Founded with a mission to elevate cafe culture through world-class education and industry mentorship.'
  const heroBadge = hero?.badge || 'Our Story'
  const heroSubheadline = hero?.subheadline
  const ctaLabel = hero?.ctaPrimary || 'Apply Now'
  const ctaHref = hero?.ctaPrimaryUrl || '/#apply'
  const overlayColor = hero?.overlayColor || '#0f0d2f'
  const overlayOpacity = Math.min(Math.max(hero?.overlayOpacity ?? 0.72, 0), 1)

  // About section defaults
  const missionBadge = about?.missionBadge || 'Our Mission'
  const missionTitle = about?.missionTitle || 'Transforming Coffee Passion'
  const missionAccent = about?.missionAccent || 'into Professional Careers'
  const missionBody = about?.missionBody || 
    'Global Café Business School was established to address a critical gap in Singapore\'s F&B education landscape. As café culture boomed, there was a clear need for structured, professional training that went beyond basic barista skills.\n\nOur founders — experienced café operators and hospitality professionals — created a curriculum that combines the science of coffee with practical business management, creating graduates who can thrive in any café environment.\n\nToday, GCBS is recognised as a leading private education institution for café and hospitality management, with graduates working across Singapore, Malaysia, Indonesia, and beyond.'
  const missionImageUrl = about?.missionImageUrl || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=85'
  const missionImageAlt = about?.missionImageAlt || 'GCBS Campus'
  const highlights = (about?.highlights as string[] | undefined) || [
    'EduTrust Certified Private Education Institution',
    'SCA Approved Training Centre',
    'Industry Advisory Board with 10+ café leaders',
    'Job placement support for all graduates'
  ]
  const values = (about?.values as Array<{ icon: string; title: string; description: string }> | undefined) || [
    { icon: '🎯', title: 'Excellence', description: 'We hold ourselves to the highest standards in everything we do — from teaching to customer service.' },
    { icon: '🤝', title: 'Industry Partnerships', description: 'Our curriculum is co-developed with top café operators ensuring graduates are job-ready.' },
    { icon: '💡', title: 'Innovation', description: 'We continuously update our programmes to reflect the latest trends in specialty coffee and café management.' },
    { icon: '🌱', title: 'Sustainability', description: 'We teach ethical sourcing, sustainability practices, and responsible business from day one.' },
  ]
  const ctaHeading = about?.ctaHeading || 'Ready to Join Our Community?'
  const ctaSubheading = about?.ctaSubheading || 'Take the first step towards your café career.'

  return (
    <>
      {/* Hero */}
      <section className="relative bg-coffee-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.mobileImageUrl && (
            <Image src={hero.mobileImageUrl} alt="" fill className="object-cover sm:hidden opacity-20" sizes="768px" />
          )}
          {hero?.desktopImageUrl && (
            <Image
              src={hero.desktopImageUrl}
              alt=""
              fill
              className={`object-cover ${hero?.mobileImageUrl ? 'hidden sm:block' : ''} opacity-20`}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-coffee-950/70" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="section-label text-espresso-300">{heroBadge}</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {heroHeadline}<br /><span className="text-espresso-300 italic">{heroAccent}</span>
          </h1>
          {heroSubheadline && <p className="text-cream-100 max-w-2xl mx-auto text-xl mb-3">{heroSubheadline}</p>}
          <p className="text-coffee-300 max-w-xl mx-auto text-lg">
            {heroBody}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">{missionBadge}</span>
              <h2 className="section-title mb-6">{missionTitle}<br /><span>{missionAccent}</span></h2>
              <div className="space-y-4 text-coffee-700 leading-relaxed">
                {missionBody.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-3">
                {highlights.map(h => (
                  <li key={h} className="flex items-center gap-2.5 text-sm text-coffee-700">
                    <CheckCircle2 size={16} className="text-espresso-500 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-96 lg:h-[500px] shadow-2xl">
                <Image
                  src={missionImageUrl}
                  alt={missionImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-espresso-500 text-white rounded-2xl p-5 shadow-2xl max-w-[180px]">
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>2010</div>
                <div className="text-xs font-medium opacity-90">Est. in Singapore. 15+ years of excellence.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-cream-100">
        <div className="container-main">
          <div className="text-center mb-16">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our <span>Core Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-coffee-950 mb-2">{v.title}</h3>
                <p className="text-sm text-coffee-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="section-padding bg-white">
          <div className="container-main">
            <div className="text-center mb-16">
              <span className="section-label">Our People</span>
              <h2 className="section-title">Meet the <span>Faculty</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map(member => (
                <div key={member.id} className="group text-center">
                  <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-coffee-100 mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                    {/* Art-directed: portrait photo, different crops for mobile/desktop handled via CSS */}
                    {member.photoMobile && (
                      <Image src={member.photoMobile} alt={member.name} fill className="object-cover sm:hidden" sizes="128px" />
                    )}
                    {member.photoDesktop && (
                      <Image
                        src={member.photoDesktop}
                        alt={member.name}
                        fill
                        className={`object-cover ${member.photoMobile ? 'hidden sm:block' : ''}`}
                        sizes="128px"
                      />
                    )}
                  </div>
                  <h3 className="font-bold text-coffee-950" style={{ fontFamily: 'var(--font-playfair)' }}>{member.name}</h3>
                  <p className="text-sm text-espresso-500 font-medium mt-0.5">{member.title}</p>
                  {member.department && <p className="text-xs text-coffee-400 mt-0.5">{member.department}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-coffee-950 relative overflow-hidden">
        <div className="container-main text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            {ctaHeading}
          </h2>
          <p className="text-coffee-300 mb-8 max-w-md mx-auto">
            {ctaSubheading}
          </p>
          <Link href={ctaHref} className="btn-primary">{ctaLabel}</Link>
        </div>
      </section>
    </>
  )
}
