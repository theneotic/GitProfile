import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PEAKER // Cybercore GitHub Stat Matrix',
  description: 'Next-Gen Cybercore Telemetry & HUD Stat Cards for GitHub Profiles',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-[#f0f6fc] selection:bg-[#00f0ff] selection:text-black">
        {children}
      </body>
    </html>
  );
}
