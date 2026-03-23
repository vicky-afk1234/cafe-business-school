import Image from 'next/image'
import Link from 'next/link'

// ─── Partners ───────────────────────────────────
type Partner = { id: string; name: string; logoUrl: string; websiteUrl?: string | null }

const FALLBACK_PARTNERS: Partner[] = [
  { id: '1', name: 'SkillsFuture Singapore', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=SkillsFuture' },
  { id: '2', name: 'SCA — Specialty Coffee Association', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=SCA' },
  { id: '3', name: 'Lavazza', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=Lavazza' },
  { id: '4', name: 'The Coffee Bean & Tea Leaf', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=CBTL' },
  { id: '5', name: 'Marriott Hotels', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=Marriott' },
  { id: '6', name: 'EduTrust', logoUrl: 'https://via.placeholder.com/160x60/f9eedb/7d5130?text=EduTrust' },
]

export function PartnersSection({ partners }: { partners?: Partner[] }) {
  const items = partners?.length ? partners : FALLBACK_PARTNERS
  return (
    <section className="py-16 bg-cream-100 border-y border-coffee-100">
      <div className="container-main">
        <div className="text-center mb-10">
          <span className="section-label">Our Partners & Accreditations</span>
          <p className="text-coffee-500 text-sm">Trusted by leading industry organisations worldwide</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {items.map((p) => (
            <div key={p.id} className="opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0">
              <Image
                src={p.logoUrl}
                alt={p.name}
                width={140}
                height={50}
                className="object-contain h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection

// ─── Gallery Preview ─────────────────────────────
const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', alt: 'Coffee Lab', className: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', alt: 'Latte Art', className: '' },
  { src: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&q=80', alt: 'Training', className: '' },
  { src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', alt: 'Roasting', className: '' },
  { src: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400&q=80', alt: 'Barista', className: '' },
]

export function GalleryPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label">Our Campus & Facilities</span>
            <h2 className="section-title">Inside <span>GCBS</span></h2>
          </div>
          <Link href="/gallery" className="btn-ghost hidden sm:flex">
            View Gallery →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden group ${img.className}`}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/gallery" className="btn-ghost">View Full Gallery →</Link>
        </div>
      </div>
    </section>
  )
}
