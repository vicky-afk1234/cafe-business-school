import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: '🔬',
    title: 'Hands-On Coffee Lab',
    desc: 'Train on commercial-grade espresso machines, grinders, and roasters in our fully equipped 3,000 sq ft coffee laboratory.',
  },
  {
    icon: '👨‍🏫',
    title: 'Industry Expert Faculty',
    desc: 'Learn from World Barista Championship competitors, café owners, and F&B industry veterans with 15+ years experience.',
  },
  {
    icon: '🌐',
    title: 'International Certification',
    desc: 'Earn globally recognised certifications from SCA (Specialty Coffee Association) alongside your diploma.',
  },
  {
    icon: '💼',
    title: 'Job Placement Support',
    desc: '98% employment rate within 6 months of graduation. Our career services team connects you with top café brands.',
  },
  {
    icon: '🏆',
    title: 'EduTrust Accredited',
    desc: 'Registered with SkillsFuture Singapore as a Private Education Institution with EduTrust certification.',
  },
  {
    icon: '📅',
    title: 'Flexible Intake Schedule',
    desc: 'January and July intakes. Part-time options available for working professionals.',
  },
]

const highlights = [
  'SCA Certified Training Centre',
  'Industry-mentorship programme',
  'Real café project assignments',
  'Career coaching & placement',
  'Internship with partner cafés',
  'Alumni network across 20+ countries',
]

export default function WhyUsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left — images collage */}
          <div className="relative">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden h-96 lg:h-[500px] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=900&q=85"
                alt="Students in coffee lab"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/40 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-8 -right-6 bg-white rounded-2xl shadow-2xl p-5 max-w-[200px] border border-coffee-100">
              <div className="text-3xl font-bold text-espresso-500 mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>98%</div>
              <div className="text-xs text-coffee-600 font-medium">Graduate employment within 6 months</div>
            </div>
            {/* Small accent image */}
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80"
                alt="Latte art"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — content */}
          <div>
            <span className="section-label">Why Choose GCBS</span>
            <h2 className="section-title mb-6">
              Where <span>Passion</span> Meets<br />Professionalism
            </h2>
            <p className="text-coffee-600 leading-relaxed mb-8 text-lg">
              At Global Café Business School, we believe that exceptional coffee is both an art and a science.
              Our curriculum blends sensory training, business acumen, and hands-on practice to produce
              graduates who are truly café-ready from day one.
            </p>

            {/* Highlights */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-coffee-700">
                  <CheckCircle2 size={16} className="text-espresso-500 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.slice(0, 4).map((f) => (
                <div key={f.title} className="group p-4 rounded-xl border border-coffee-100 hover:border-espresso-300 hover:bg-espresso-50 transition-all duration-200">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-sm font-bold text-coffee-900 mb-1">{f.title}</div>
                  <div className="text-xs text-coffee-500 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom features row */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(4).map((f) => (
            <div key={f.title} className="flex gap-4 p-6 rounded-2xl bg-cream-100 hover:bg-espresso-50 transition-colors duration-200 border border-coffee-100">
              <div className="text-3xl shrink-0">{f.icon}</div>
              <div>
                <div className="font-bold text-coffee-900 mb-1">{f.title}</div>
                <div className="text-sm text-coffee-500 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
