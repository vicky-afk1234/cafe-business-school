import Image from 'next/image'
import Link from 'next/link'

type GalleryItem = {
  id: string
  title?: string | null
  altText?: string | null
  desktopUrl: string
}

export default function GalleryPreview({ images }: { images?: GalleryItem[] }) {
  const items = (images || []).filter((img) => Boolean(img.desktopUrl)).slice(0, 5)
  if (items.length === 0) return null

  return (
    <section className="section-padding bg-espresso-900">
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
          {items.map((img, i) => (
            <div key={img.id} className={`relative rounded-2xl overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <Image
                src={img.desktopUrl}
                alt={img.altText || img.title || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title || img.altText || 'Campus'}
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
