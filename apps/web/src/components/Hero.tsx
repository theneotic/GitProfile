import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, GitBranch, Terminal } from 'lucide-react';
import { LiveCardDemo } from './LiveCardDemo';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-secondary">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>Instrument Stats 1.0</span>
          <span className="text-text-tertiary">·</span>
          <span className="text-accent">10 Card Types & Auto Dark/Light</span>
        </div>

        {/* Main Asymmetric Headline */}
        <div className="mt-6 max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            GitHub profile cards,{' '}
            <span className="text-accent">engineered</span> for people who care about craft.
          </h1>
          <p className="mt-5 text-base text-text-secondary sm:text-lg">
            High-precision, embeddable SVGs with dark terminal aesthetics, 14 published palettes,
            saved preset slugs, layout densities, and native dark/light theme switching. Served
            stably with zero browser bloat.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-sm bg-accent px-6 py-3 font-mono text-sm font-bold text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30"
          >
            <span>Connect with GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#demo"
            className="flex items-center gap-2 rounded-sm border border-border bg-surface px-5 py-3 font-mono text-sm font-medium text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            <Terminal className="h-4 w-4" />
            <span>Interactive Builder</span>
          </a>
        </div>

        {/* Micro Features Row */}
        <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-xs text-text-tertiary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>OAuth Read-Only by Default</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span>5-Minute Edge Caching</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-accent" />
            <span>Permanent Shareable Slugs</span>
          </div>
        </div>

        {/* Interactive Live Card Demo */}
        <div className="mt-12">
          <LiveCardDemo />
        </div>
      </div>
    </section>
  );
}
