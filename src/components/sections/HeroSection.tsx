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

export default function HeroSection({ data }: { data: HeroData }) {
  const h = data
  if (!h) return null

  return (
    <section className="relative min-h-half flex flex-col overflow-hidden">
      {/* Background image — art direction: different images desktop vs mobile */}
      <div className="absolute inset-0 z-0">
        {/* Desktop image */}
        {h.desktopImageUrl && (
          <Image
            src={h.desktopImageUrl}
            alt="Barista crafting coffee"
            fill
            priority
            quality={90}
            className="object-cover hidden sm:block"
            sizes="100vw"
          />
        )}
        {/* Mobile image */}
        {h.mobileImageUrl && (
          <Image
            src={h.mobileImageUrl}
            alt="Barista crafting coffee"
            fill
            priority
            quality={85}
            className="object-cover sm:hidden"
            sizes="768px"
          />
        )}
      </div>

      {/* Decorative coffee bean accent */}
      <div className="absolute top-1/4 right-8 md:right-16 lg:right-32 z-10 hidden md:block">
        <Coffee size={280} className="text-espresso-300 rotate-12" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container-main pt-10 pb-20">
          <div className="max-w-6xl">
            {/* Badge */}
            {h.badge && (
              <div className="inline-flex items-center gap-2 bg-espresso-600 border border-espresso-600 text-white text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full mb-8">
                {h.badge}
              </div>
            )}

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
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
                  className="text-2xl md:text-3xl text-cream-200 font-light mb-8"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {h.subheadline}
                </div>
            )}

            {/* Body */}
            {h.bodyText && (
              <p
                className="text-base md:text-lg text-coffee-200 leading-relaxed max-w-xl mb-10"
              >
                {h.bodyText}
              </p>
            )}

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4"
            >
              {h.ctaPrimary && h.ctaPrimaryUrl && (
                <Link href={h.ctaPrimaryUrl} className="btn-primary text-base px-10 py-4">
                  {h.ctaPrimary}
                </Link>
              )}
              {h.ctaSecondary && h.ctaSecondaryUrl && (
                <Link
                  href={h.ctaSecondaryUrl}
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white text-base border-2 border-espresso-400 bg-espresso-600 hover:bg-espresso-700 transition-all duration-200"
                >
                  {h.ctaSecondary}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white hover:text-cream-100 transition-colors hidden md:flex flex-col items-center gap-1"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </a>
    </section>
  )
}
