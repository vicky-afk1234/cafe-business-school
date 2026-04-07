import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Global Café Business School',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-theme">
      <AnnouncementBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
