import React from 'react';
import Link from 'next/link';
import { LiveCardDemo } from './LiveCardDemo';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-wabi-grid">
      {/* Ambient Wabi-Sabi Seal Background Watermark */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-display text-[220px] font-bold text-surface-raised/40 blur-[1px]"
      >
        侘寂
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Retro 8-bit RPG / Zen Chip */}
        <div className="inline-flex items-center gap-2 border-2 border-border bg-surface px-4 py-1.5 shadow-[3px_3px_0px_#0c0b0a] mb-6">
          <span className="h-2.5 w-2.5 bg-moss animate-pulse" />
          <span className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
            [ 侘寂 // Wabi-Sabi × 8-Bit Stats · LVL.99 ]
          </span>
        </div>

        {/* Main Headline: Shippori Mincho Serif */}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl max-w-3xl leading-tight">
          GitHub stats, sculpted in{' '}
          <span className="text-accent underline decoration-accent/50 decoration-wavy">
            stone & pixels
          </span>
          .
        </h1>

        {/* Serene, Effortless-to-read Subhead */}
        <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-xl font-sans leading-relaxed">
          Quiet imperfection meets 8-bit arcade craft. Pick your modules, customize your palette, and paste one permanent SVG into any README.
        </p>

        {/* Stepped Pixel Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="pixel-btn-gold flex items-center gap-2.5 px-8 py-3.5 font-sans text-sm font-bold tracking-wide"
          >
            <span>Connect with GitHub</span>
            <span className="font-mono text-xs">►</span>
          </Link>

          <a
            href="#themes"
            className="pixel-btn flex items-center gap-2 bg-surface px-6 py-3.5 font-sans text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-text-secondary"
          >
            <span>Browse 14 Palettes</span>
          </a>
        </div>

        {/* Embedded Live Card Demo */}
        <div className="mt-16 w-full flex justify-center">
          <LiveCardDemo />
        </div>
      </div>
    </section>
  );
}
