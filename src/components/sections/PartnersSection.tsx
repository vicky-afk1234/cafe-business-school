import Image from 'next/image'

// ─── Partners ───────────────────────────────────
type Partner = { id: string; name: string; logoUrl: string; websiteUrl?: string | null }

export function PartnersSection({ partners }: { partners?: Partner[] }) {
  const items = partners || []
  if (items.length === 0) return null

  return (
    <section className="py-16 bg-espresso-900 border-y border-espresso-700">
      <div className="container-main">
        <div className="text-center mb-10">
          <span className="section-label">Our Partners & Accreditations</span>
          <p className="text-coffee-200 text-sm">Trusted by leading industry organisations worldwide</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {items.map((p) => (
            <div key={p.id} className="transition-transform duration-200 hover:scale-105">
              <Image
                src={p.logoUrl}
                alt={p.name}
                width={180}
                height={64}
                className="object-contain h-14 w-auto"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
