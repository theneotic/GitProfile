'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { GitHubIcon } from './icons/GitHubIcon';
import { getAccessToken } from '../lib/api';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand: Wabi-Sabi Serif + 8-Bit Pixel Seal */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border-2 border-border bg-surface text-accent shadow-[2px_2px_0px_#0c0b0a] transition-all group-hover:border-accent group-hover:shadow-[3px_3px_0px_#ca8a04]">
            <span className="font-mono text-xs font-bold text-accent">儀</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-display text-lg font-bold tracking-tight text-text-primary">
                Instrument
              </span>
              <span className="font-mono text-xs font-bold text-accent ml-1.5 uppercase">
                Stats
              </span>
            </div>
            <span className="font-mono text-[10px] text-text-muted tracking-wider">
              侘寂 · 8-BIT STATS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="font-sans text-sm font-semibold text-text-secondary transition-colors hover:text-accent"
          >
            Features
          </Link>
          <Link
            href="/#themes"
            className="font-sans text-sm font-semibold text-text-secondary transition-colors hover:text-accent"
          >
            14 Palettes
          </Link>
          <Link
            href="/docs"
            className="font-sans text-sm font-semibold text-text-secondary transition-colors hover:text-accent"
          >
            Docs
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/theneotic/GitProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 border-2 border-border bg-surface px-3.5 py-1.5 font-sans text-xs font-semibold text-text-secondary shadow-[2px_2px_0px_#0c0b0a] transition-all hover:border-text-secondary hover:text-text-primary sm:flex active:translate-x-[1px] active:translate-y-[1px]"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="pixel-btn-gold flex items-center gap-2 px-5 py-2 font-sans text-xs font-bold"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="pixel-btn-gold flex items-center gap-2 px-5 py-2 font-sans text-xs font-bold"
            >
              <span>Connect</span>
              <span className="font-mono text-xs">►</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
