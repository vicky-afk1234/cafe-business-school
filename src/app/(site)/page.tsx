import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import CoursesSection from '@/components/sections/CoursesSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import CtaSection from '@/components/sections/CtaSection'
import PartnersSection from '@/components/sections/PartnersSection'
import BannerStrip from '@/components/sections/BannerStrip'
import GalleryPreview from '@/components/sections/GalleryPreview'

export const revalidate = 60

async function getHomeData() {
  try {
    const [hero, stats, courses, partners, banner, gallery] = await prisma.$transaction([
      prisma.heroSection.findFirst({ where: { page: 'home', isActive: true } }),
      prisma.stat.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.course.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { sortOrder: 'asc' },
        take: 6,
      }),
      prisma.partner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.banner.findFirst({
        where: { isActive: true, placement: 'HOME_MID' },
      }),
      prisma.galleryImage.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 5,
      }),
    ])

    return { hero, stats, courses, partners, banner, gallery }
  } catch {
    return {
      hero: null,
      stats: [],
      courses: [],
      partners: [],
      banner: null,
      gallery: [],
    }
  }
}

export default async function HomePage() {
  const { hero, stats, courses, partners, banner, gallery } = await getHomeData()

  return (
    <>
      <HeroSection data={hero} />
      <StatsSection stats={stats} />
      <CoursesSection courses={courses} />
      <WhyUsSection />
      {banner && <BannerStrip banner={banner} />}
      <GalleryPreview images={gallery} />
      <PartnersSection partners={partners} />
      <CtaSection />
    </>
  )
}
