import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Global Café Business School | Diploma in Café Management & Barista Skills',
    template: '%s | Global Café Business School',
  },
  description:
    'Professional Diploma in Café Management & Barista Skills. Learn the art and science of coffee from industry professionals. Hands-on training for cafés, restaurants, hotels, and coffee businesses.',
  keywords: ['café management', 'barista training', 'coffee diploma', 'barista skills', 'café business school'],
  openGraph: {
    type: 'website',
    siteName: 'Global Café Business School',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
