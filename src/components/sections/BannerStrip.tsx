import Image from 'next/image'
import Link from 'next/link'

type Banner = {
  id: string
  title: string
  subtitle?: string | null
  bodyText?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  desktopImageUrl?: string | null
  mobileImageUrl?: string | null
  bgColor?: string | null
  textColor?: string | null
}

export default function BannerStrip({ banner }: { banner: Banner }) {
  const textColor = banner.textColor || '#ffffff'

  return (
    <section className="relative overflow-hidden" style={{ background: banner.bgColor || '#1a0d08' }}>
      {/* Desktop background */}
      {banner.desktopImageUrl && (
        <Image
          src={banner.desktopImageUrl}
          alt={banner.title}
          fill
          className="object-cover hidden sm:block opacity-30"
          sizes="100vw"
        />
      )}
      {/* Mobile background */}
      {banner.mobileImageUrl && (
        <Image
          src={banner.mobileImageUrl}
          alt={banner.title}
          fill
          className="object-cover sm:hidden opacity-30"
          sizes="768px"
        />
      )}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

      <div className="relative z-10 container-main py-16 md:py-20">
        <div className="max-w-2xl" style={{ color: textColor }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="text-xl opacity-90 mb-3">{banner.subtitle}</p>
          )}
          {banner.bodyText && (
            <p className="opacity-75 leading-relaxed mb-6">{banner.bodyText}</p>
          )}
          {banner.ctaLabel && banner.ctaUrl && (
            <Link href={banner.ctaUrl} className="btn-primary">
              {banner.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
