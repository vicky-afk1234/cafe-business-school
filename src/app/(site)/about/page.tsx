import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us' }

async function getData() {
  try {
    const [hero, team] = await Promise.all([
      prisma.heroSection.findUnique({ where: { page: 'about' } }),
      prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    ])
    return { hero, team }
  } catch { return { hero: null, team: [] } }
}

const values = [
  { icon: '🎯', title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we do — from teaching to customer service.' },
  { icon: '🤝', title: 'Industry Partnerships', desc: 'Our curriculum is co-developed with top café operators ensuring graduates are job-ready.' },
  { icon: '💡', title: 'Innovation', desc: 'We continuously update our programmes to reflect the latest trends in specialty coffee and café management.' },
  { icon: '🌱', title: 'Sustainability', desc: 'We teach ethical sourcing, sustainability practices, and responsible business from day one.' },
]

export default async function AboutPage() {
  const { hero, team } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-coffee-950 pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.mobileImageUrl && (
            <Image src={hero.mobileImageUrl} alt="" fill className="object-cover sm:hidden opacity-20" sizes="768px" />
          )}
          <Image
            src={hero?.desktopImageUrl || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80'}
            alt=""
            fill
            className={`object-cover ${hero?.mobileImageUrl ? 'hidden sm:block' : ''} opacity-20`}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-950/90 to-coffee-950/60" />
        </div>
        <div className="container-main relative z-10 text-center">
          <span className="section-label text-espresso-400">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            About Global Café<br /><span className="text-espresso-400 italic">Business School</span>
          </h1>
          <p className="text-coffee-300 max-w-xl mx-auto text-lg">
            Founded with a mission to elevate café culture through world-class education and industry mentorship.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Our Mission</span>
              <h2 className="section-title mb-6">Transforming Coffee Passion<br />into <span>Professional Careers</span></h2>
              <div className="space-y-4 text-coffee-700 leading-relaxed">
                <p>
                  Global Café Business School was established to address a critical gap in Singapore's F&B education landscape.
                  As café culture boomed, there was a clear need for structured, professional training that went beyond basic barista skills.
                </p>
                <p>
                  Our founders — experienced café operators and hospitality professionals — created a curriculum that combines
                  the science of coffee with practical business management, creating graduates who can thrive in any café environment.
                </p>
                <p>
                  Today, GCBS is recognised as a leading private education institution for café and hospitality management,
                  with graduates working across Singapore, Malaysia, Indonesia, and beyond.
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {['EduTrust Certified Private Education Institution','SCA Approved Training Centre','Industry Advisory Board with 10+ café leaders','Job placement support for all graduates'].map(h => (
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
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=900&q=85"
                  alt="GCBS Campus"
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
                <p className="text-sm text-coffee-600 leading-relaxed">{v.desc}</p>
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
                    <Image
                      src={member.photoDesktop || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
                      alt={member.name}
                      fill
                      className={`object-cover ${member.photoMobile ? 'hidden sm:block' : ''}`}
                      sizes="128px"
                    />
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
            Ready to Join Our <span className="text-espresso-400 italic">Community?</span>
          </h2>
          <p className="text-coffee-300 mb-8 max-w-md mx-auto">
            Take the first step towards your café career. Applications are open for the next intake.
          </p>
          <Link href="/#apply" className="btn-primary">Apply Now ☕</Link>
        </div>
      </section>
    </>
  )
}
