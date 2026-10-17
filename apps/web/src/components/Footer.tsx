import React from 'react';
import Link from 'next/link';
import { Terminal, Heart } from 'lucide-react';
import { GitHubIcon } from './icons/GitHubIcon';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 text-sm text-text-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-surface text-accent">
                <Terminal className="h-3 w-3" />
              </div>
              <span className="font-display font-bold text-text-primary">
                Instrument<span className="text-accent">Stats</span>
              </span>
              <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-accent">
                v1.0.0
              </span>
            </div>
            <p className="max-w-md text-xs text-text-tertiary">
              A high-precision developer tool built under the{' '}
              <span className="text-text-secondary">Direct Instruments</span> brand by{' '}
              <a
                href="https://github.com/theneotic"
                target="_blank"
                rel="noreferrer"
                className="text-text-primary hover:text-accent"
              >
                Alistair (Shamir Siddiqui)
              </a>
              .
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <Link href="/docs" className="hover:text-text-primary">
              Documentation
            </Link>
            <Link href="/#themes" className="hover:text-text-primary">
              14 Palettes
            </Link>
            <Link href="/#features" className="hover:text-text-primary">
              Features
            </Link>
            <a
              href="https://github.com/theneotic/instrument-stats"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-text-primary"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-text-tertiary sm:flex-row">
          <p>© {new Date().getFullYear()} Direct Instruments · Released under the MIT License.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for the open source community
          </p>
        </div>
      </div>
    </footer>
  );
}
