import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GrainOverlay } from '../components/ui/GrainOverlay';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Instrument Stats — High-Precision GitHub Stats Cards',
  description:
    'Generate deeply customizable, embeddable SVG stats cards for your GitHub profile with terminal aesthetics, saved presets, and automatic theme switching.',
  keywords: ['github stats', 'svg cards', 'developer profile', 'readme stats', 'github streak'],
  authors: [{ name: 'Alistair Siddiqui', url: 'https://github.com/theneotic' }],
  metadataBase: new URL('https://instrumentstats.dev'),
  openGraph: {
    title: 'Instrument Stats — GitHub Cards for Engineers',
    description: 'High-precision, embeddable SVG cards with dark terminal aesthetics & transparent rankings.',
    url: 'https://instrumentstats.dev',
    siteName: 'Instrument Stats',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instrument Stats — High-Precision GitHub Stats Cards',
    description: 'Generate deeply customizable, embeddable SVG stats cards for your GitHub profile.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased selection:bg-accent/20 selection:text-accent">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
