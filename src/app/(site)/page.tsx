import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import CoursesSection from '@/components/sections/CoursesSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CtaSection from '@/components/sections/CtaSection'
import PartnersSection from '@/components/sections/PartnersSection'
import BannerStrip from '@/components/sections/BannerStrip'
import GalleryPreview from '@/components/sections/GalleryPreview'

async function getHomeData() {
  const [hero, stats, courses, testimonials, partners, banner] = await Promise.all([
    prisma.heroSection.findUnique({ where: { page: 'home' } }),
    prisma.stat.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.course.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isActive: true, isFeatured: true },
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
  ])
  return { hero, stats, courses, testimonials, partners, banner }
}

export default async function HomePage() {
  const { hero, stats, courses, testimonials, partners, banner } = await getHomeData()

  return (
    <>
      <HeroSection data={hero} />
      <StatsSection stats={stats} />
      <CoursesSection courses={courses} />
      <WhyUsSection />
      {banner && <BannerStrip banner={banner} />}
      <TestimonialsSection testimonials={testimonials} />
      <GalleryPreview />
      <PartnersSection partners={partners} />
      <CtaSection />
    </>
  )
}
