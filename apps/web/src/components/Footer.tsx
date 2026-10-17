import React from 'react';
import Link from 'next/link';
import { GitHubIcon } from './icons/GitHubIcon';

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-background py-14 text-sm text-text-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand & Author Attribution */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center border-2 border-border bg-surface text-accent shadow-[2px_2px_0px_#0c0b0a]">
                <span className="font-mono text-xs font-bold">儀</span>
              </div>
              <span className="font-display font-bold text-base text-text-primary">
                Instrument<span className="text-accent font-mono text-xs ml-1.5 uppercase">Stats</span>
              </span>
              <span className="border border-border bg-surface px-2.5 py-0.5 font-mono text-xs text-accent shadow-[1px_1px_0px_#0c0b0a]">
                v1.0.0 · 侘寂
              </span>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-text-muted font-sans">
              A high-precision developer tool built under the{' '}
              <span className="text-text-secondary font-medium">Direct Instruments</span> brand by{' '}
              <a
                href="https://github.com/theneotic"
                target="_blank"
                rel="noreferrer"
                className="text-text-primary hover:text-accent underline decoration-accent/40 font-medium"
              >
                Aurelius Valecrest (Alistair)
              </a>
              .
            </p>
          </div>

          {/* Stepped Pixel Nav Links */}
          <div className="flex flex-wrap items-center gap-6 font-sans text-xs sm:text-sm font-semibold">
            <Link href="/docs" className="hover:text-accent transition-colors">
              Docs
            </Link>
            <Link href="/#themes" className="hover:text-accent transition-colors">
              14 Palettes
            </Link>
            <Link href="/#features" className="hover:text-accent transition-colors">
              Four Pillars
            </Link>
            <a
              href="https://github.com/theneotic/GitProfile"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs text-text-tertiary sm:flex-row font-mono text-[11px]">
          <p>© {new Date().getFullYear()} Direct Instruments · Released under the MIT License</p>
          <p className="flex items-center gap-1.5 text-accent font-semibold">
            <span>「 侘寂 · Pixel Art Synthesis 」</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
