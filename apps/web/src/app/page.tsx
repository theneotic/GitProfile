import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeatureGrid } from '../components/FeatureGrid';
import { ThemeShowcase } from '../components/ThemeShowcase';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <ThemeShowcase />
      </main>
      <Footer />
    </div>
  );
}
