import type { Metadata } from 'next'
import CtaSection from '@/components/sections/CtaSection'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const metadata: Metadata = { title: 'Contact & Enquiry' }
export const revalidate = 60

async function getContactHero() {
  try {
    return await prisma.heroSection.findFirst({ where: { page: 'contact', isActive: true } })
  } catch {
    return null
  }
}

export default async function ContactPage() {
  const hero = await getContactHero()

  return (
    <>
      <div className="relative bg-coffee-950 pt-40 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.desktopImageUrl && (
            <Image src={hero.desktopImageUrl} alt="" fill className="object-cover hidden sm:block" sizes="100vw" />
          )}
          {hero?.mobileImageUrl && (
            <Image src={hero.mobileImageUrl} alt="" fill className="object-cover sm:hidden" sizes="768px" />
          )}
        </div>
        <div className="container-main text-center relative z-10">
          <span className="section-label text-espresso-300">{hero?.badge || 'Get In Touch'}</span>
          <h1 className="text-5xl font-bold text-white mt-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            {hero?.headline || 'Contact'}{' '}
            <span className="text-espresso-300 italic">{hero?.headlineAccent || 'GCBS'}</span>
          </h1>
          {hero?.bodyText && <p className="text-coffee-200 mt-4 max-w-2xl mx-auto">{hero.bodyText}</p>}
        </div>
      </div>
      <CtaSection />
    </>
  )
}
