import type { Metadata } from 'next';
import './globals.css';
import { GrainOverlay } from '../components/ui/GrainOverlay';

export const metadata: Metadata = {
  title: 'Instrument Stats — Wabi-Sabi & Pixel GitHub Stats Cards',
  description:
    'Generate deeply customizable, embeddable SVG stats cards for your GitHub profile with wabi-sabi stone aesthetics, 8-bit pixel precision, and transparent rankings.',
  keywords: ['github stats', 'svg cards', 'wabi-sabi', 'pixel art', 'developer profile', 'readme stats', 'github streak'],
  authors: [{ name: 'Aurelius Valecrest', url: 'https://github.com/theneotic' }],
  metadataBase: new URL('https://gitprofilestat.vercel.app'),
  openGraph: {
    title: 'Instrument Stats — Wabi-Sabi & 8-Bit Pixel GitHub Cards',
    description: 'High-precision, embeddable SVG cards with wabi-sabi stone palettes, pixel-art geometry, and transparent formulas.',
    url: 'https://gitprofilestat.vercel.app',
    siteName: 'Instrument Stats',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instrument Stats — Wabi-Sabi & Pixel GitHub Stats Cards',
    description: 'Generate deeply customizable, embeddable SVG stats cards with wabi-sabi aesthetics and 8-bit pixel precision.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary antialiased selection:bg-accent/25 selection:text-accent-bright">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
