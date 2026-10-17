'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Terminal, ArrowRight, LayoutDashboard } from 'lucide-react';
import { GitHubIcon } from './icons/GitHubIcon';
import { getAccessToken } from '../lib/api';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-surface text-accent transition-colors group-hover:border-accent">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-text-primary">
              Instrument<span className="text-accent">Stats</span>
            </span>
            <span className="font-mono text-[10px] text-text-tertiary">by Direct Instruments</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Features
          </Link>
          <Link
            href="/#themes"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Themes
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Docs
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/theneotic/instrument-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary sm:flex"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-sm bg-accent px-4 py-1.5 font-mono text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-sm bg-accent px-4 py-1.5 font-mono text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
            >
              <span>Connect</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
