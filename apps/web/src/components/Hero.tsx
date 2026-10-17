import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LiveCardDemo } from './LiveCardDemo';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Main Headline */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl max-w-3xl">
          GitHub stats,{' '}
          <span className="text-accent">engineered</span> with craft.
        </h1>

        {/* Compressed, De-robotified Subhead */}
        <p className="mt-5 text-base text-text-secondary sm:text-lg max-w-xl">
          Pick your stats. Pick your look. Get one URL that works in any README.
        </p>

        {/* Hero CTA Button */}
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-sm bg-accent px-7 py-3 font-mono text-sm font-bold text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30"
          >
            <span>Connect with GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Embedded Live Card Demo */}
        <div className="mt-16 w-full flex justify-center">
          <LiveCardDemo />
        </div>
      </div>
    </section>
  );
}
