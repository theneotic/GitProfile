'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { GitHubIcon } from '../../components/icons/GitHubIcon';
import { API_BASE_URL, setAccessToken } from '../../lib/api';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    // If external API is configured, use it, otherwise use local Next.js /auth/github handler
    const targetUrl = API_BASE_URL ? `${API_BASE_URL}/auth/github` : '/auth/github';
    window.location.href = targetUrl;
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setAccessToken('demo-preview-token');
    window.location.href = '/dashboard';
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 bg-wabi-grid">
      {/* Ambient Wabi-Sabi Background Seal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-display text-[180px] font-bold text-surface-raised/30 blur-[1px]"
      >
        侘寂
      </div>

      {/* Main Login Card with Wabi-Sabi 8-Bit Framing */}
      <div className="relative z-10 w-full max-w-md border-2 border-border bg-surface p-6 sm:p-8 shadow-[8px_8px_0px_#0c0b0a] pixel-corners">
        {/* Retro Header Tag */}
        <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-moss animate-pulse" />
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
              [ AUTH GATEWAY // SECURE ]
            </span>
          </div>
          <span className="font-mono text-xs text-text-muted">LVL.99</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Connect to <span className="text-accent underline decoration-accent/40 decoration-wavy">Instrument Stats</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
            Generate high-precision SVG stats cards for your GitHub profile.
          </p>
        </div>

        {/* OAuth Information Box */}
        <div className="mt-6 border-2 border-border/80 bg-background/80 p-3.5 text-xs text-text-secondary shadow-inner">
          <div className="flex items-center gap-2 font-sans font-bold text-text-primary">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Read-only permissions</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted font-sans">
            We only request public profile metrics (<code className="text-accent font-mono">read:user</code>). We never modify code or repositories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="pixel-btn-gold flex w-full items-center justify-center gap-2.5 py-3 font-sans text-sm font-bold tracking-wide uppercase disabled:opacity-50"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>{isLoading ? 'Connecting...' : 'Connect with GitHub ►'}</span>
          </button>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="pixel-btn flex w-full items-center justify-center gap-2 border-2 border-border bg-surface-raised py-2.5 font-sans text-xs font-bold text-text-primary hover:border-accent hover:text-accent shadow-[2px_2px_0px_#0c0b0a]"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Instant Sandbox (Demo Mode)</span>
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5 font-mono text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-moss" />
            <span>Encrypted Session</span>
          </div>
          <span>Direct Instruments</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="font-mono text-xs text-text-muted hover:text-accent transition-colors">
          ◄ Return to Homepage
        </Link>
      </div>
    </div>
  );
}
