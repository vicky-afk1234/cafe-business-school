import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

type Testimonial = {
  id: string
  name: string
  role?: string | null
  courseTitle?: string | null
  quote: string
  rating: number
  photoDesktop?: string | null
}

const FALLBACK: Testimonial[] = [
  {
    id: '1', name: 'Sarah Chen', role: 'Café Owner, Singapore', courseTitle: 'Diploma in Café Management',
    quote: 'GCBS gave me the complete package — from espresso extraction science to P&L management. I opened my own café 6 months after graduating and we\'re already turning a profit!',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: '2', name: 'Marcus Tan', role: 'Head Barista, The Coffee Bean', courseTitle: 'Barista Certification',
    quote: 'The hands-on training at GCBS is unmatched. Our instructors are actual competitors and café owners. I landed my dream job before I even graduated.',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: '3', name: 'Priya Nair', role: 'F&B Manager, Marriott Hotels', courseTitle: 'Advanced Café Operations',
    quote: 'The curriculum is incredibly practical. Every module had real-world projects. My employer noticed the difference immediately — I was promoted within my first year.',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    id: '4', name: 'James Lim', role: 'Coffee Entrepreneur', courseTitle: 'Postgraduate Diploma',
    quote: 'I came in knowing nothing about coffee. GCBS transformed me into a confident café owner. The business modules alone are worth the entire programme.',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    id: '5', name: 'Aisha Mohammed', role: 'Barista Trainer, TWG Tea', courseTitle: 'Barista Certification',
    quote: 'The SCA certification I earned through GCBS opened doors I never expected. I now train baristas across Southeast Asia.',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
  },
  {
    id: '6', name: 'Wei Hao', role: 'Café Chain Director', courseTitle: 'Diploma in Café Management',
    quote: 'GCBS understands what the industry needs. Every lecturer brought fresh real-world experience. The network I built at GCBS is still invaluable to my business today.',
    rating: 5, photoDesktop: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < rating ? 'fill-espresso-400 text-espresso-400' : 'text-coffee-200'} />
      ))}
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  const items = testimonials?.length ? testimonials : FALLBACK

  return (
    <section className="section-padding bg-coffee-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-espresso-500/5 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-espresso-500/5 translate-y-1/3 -translate-x-1/4" />

      <div className="container-main relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-espresso-400 mb-3">
            Student Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            Lives Transformed by <span className="text-espresso-400 italic">Coffee</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.id} className="group bg-coffee-900/60 backdrop-blur-sm border border-coffee-800 rounded-2xl p-6 hover:border-espresso-600 hover:bg-coffee-800/80 transition-all duration-300">
              {/* Quote icon */}
              <Quote size={28} className="text-espresso-500/40 mb-4" />

              {/* Rating */}
              <Stars rating={t.rating} />

              {/* Quote */}
              <p className="mt-4 text-coffee-300 text-sm leading-relaxed flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-coffee-800">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-coffee-700 shrink-0">
                  {t.photoDesktop && (
                    <Image src={t.photoDesktop} alt={t.name} fill className="object-cover" sizes="44px" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  {t.role && <div className="text-xs text-coffee-500">{t.role}</div>}
                  {t.courseTitle && (
                    <div className="text-xs text-espresso-400 mt-0.5">{t.courseTitle}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
