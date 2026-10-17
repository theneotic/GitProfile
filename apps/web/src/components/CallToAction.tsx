import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-surface to-background py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1 font-mono text-xs text-accent">
          <Terminal className="h-3.5 w-3.5" />
          <span>Zero Configuration Required</span>
        </div>

        <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
          Level up your GitHub README in 30 seconds.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary sm:text-base">
          Connect your GitHub account with read-only OAuth, pick from 10 high-precision card
          engines, customize layout density, and copy your permanent markdown badge.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-sm bg-accent px-8 py-3.5 font-mono text-sm font-bold text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30"
          >
            <span>Connect with GitHub</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/docs"
            className="flex items-center gap-2 rounded-sm border border-border bg-surface px-6 py-3.5 font-mono text-sm font-medium text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            <span>Read Documentation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
