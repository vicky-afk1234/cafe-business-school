import Image from 'next/image'
import Link from 'next/link'
import { Coffee, ChevronDown } from 'lucide-react'

type HeroData = {
  badge?: string | null
  headline?: string | null
  headlineAccent?: string | null
  subheadline?: string | null
  bodyText?: string | null
  ctaPrimary?: string | null
  ctaPrimaryUrl?: string | null
  ctaSecondary?: string | null
  ctaSecondaryUrl?: string | null
  desktopImageUrl?: string | null
  mobileImageUrl?: string | null
  overlayOpacity?: number
  overlayColor?: string
} | null

const FALLBACK = {
  badge: '☕ Professional Training Institute',
  headline: 'Professional',
  headlineAccent: 'DIPLOMA IN CAFÉ MANAGEMENT',
  subheadline: '& Barista Skills',
  bodyText:
    'Learn the art and science of coffee from industry professionals. Our hands-on training prepares students for careers in cafés, restaurants, hotels, and coffee businesses.',
  ctaPrimary: 'Apply Now ☕',
  ctaPrimaryUrl: '/admissions/apply',
  ctaSecondary: 'View Course',
  ctaSecondaryUrl: '/courses',
  desktopImageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=85',
  mobileImageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=768&q=85',
  overlayOpacity: 0.65,
  overlayColor: '#1a0d08',
}

export default function HeroSection({ data }: { data: HeroData }) {
  const h = { ...FALLBACK, ...data }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image — art direction: different images desktop vs mobile */}
      <div className="absolute inset-0 z-0">
        {/* Desktop image */}
        <Image
          src={h.desktopImageUrl || FALLBACK.desktopImageUrl}
          alt="Barista crafting coffee"
          fill
          priority
          quality={90}
          className="object-cover hidden sm:block"
          sizes="100vw"
        />
        {/* Mobile image */}
        <Image
          src={h.mobileImageUrl || FALLBACK.mobileImageUrl}
          alt="Barista crafting coffee"
          fill
          priority
          quality={85}
          className="object-cover sm:hidden"
          sizes="768px"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${h.overlayColor}f0 0%, ${h.overlayColor}a0 60%, ${h.overlayColor}50 100%)`,
          }}
        />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-coffee-950 to-transparent" />
      </div>

      {/* Decorative coffee bean accent */}
      <div className="absolute top-1/4 right-8 md:right-16 lg:right-32 z-10 opacity-10 hidden md:block">
        <Coffee size={280} className="text-espresso-300 rotate-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container-main pt-40 pb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            {h.badge && (
              <div className="inline-flex items-center gap-2 bg-espresso-500/20 border border-espresso-400/40 text-espresso-300 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-8 backdrop-blur-sm animate-fade-up">
                {h.badge}
              </div>
            )}

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-4 animate-fade-up"
              style={{ fontFamily: 'var(--font-playfair)', animationDelay: '0.1s', opacity: 0 }}
            >
              {h.headline}
              {h.headlineAccent && (
                <>
                  <br />
                  <span className="text-espresso-400 italic">{h.headlineAccent}</span>
                </>
              )}
            </h1>

            {h.subheadline && (
              <div
                className="text-2xl md:text-3xl text-cream-200 font-light mb-8 animate-fade-up"
                style={{ fontFamily: 'var(--font-playfair)', animationDelay: '0.2s', opacity: 0 }}
              >
                {h.subheadline}
              </div>
            )}

            {/* Body */}
            {h.bodyText && (
              <p
                className="text-base md:text-lg text-coffee-200 leading-relaxed max-w-xl mb-10 animate-fade-up"
                style={{ animationDelay: '0.3s', opacity: 0 }}
              >
                {h.bodyText}
              </p>
            )}

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: '0.4s', opacity: 0 }}
            >
              {h.ctaPrimary && h.ctaPrimaryUrl && (
                <Link href={h.ctaPrimaryUrl} className="btn-primary text-base px-10 py-4">
                  {h.ctaPrimary}
                </Link>
              )}
              {h.ctaSecondary && h.ctaSecondaryUrl && (
                <Link
                  href={h.ctaSecondaryUrl}
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-base border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                >
                  {h.ctaSecondary}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick info strip */}
      <div className="relative z-10 border-t border-white/10 backdrop-blur-md bg-black/20">
        <div className="container-main py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Intake', value: 'Jan & Jul 2025' },
              { label: 'Duration', value: '12 Months' },
              { label: 'Mode', value: 'Full-time' },
              { label: 'Certification', value: 'EduTrust Approved' },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-espresso-400 text-xs font-semibold uppercase tracking-widest mb-1">
                  {item.label}
                </div>
                <div className="text-white text-sm font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-white transition-colors animate-float hidden md:flex flex-col items-center gap-1"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </a>
    </section>
  )
}
