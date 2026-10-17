'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { GitHubIcon } from '../../components/icons/GitHubIcon';
import { API_BASE_URL, setAccessToken } from '../../lib/api';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  const handleDemoLogin = () => {
    // Generate demo dev token for immediate exploration
    setAccessToken('demo-preview-token');
    window.location.href = '/dashboard';
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Main Login Card (Section 5.5) */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-2xl">
        {/* Brand Icon Chip */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-surface-raised text-accent">
          <Terminal className="h-6 w-6" />
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Welcome to Instrument<span className="text-accent">Stats</span>
          </h1>
          <p className="mt-2 text-xs text-text-secondary">
            High-precision GitHub profile cards built under Direct Instruments.
          </p>
        </div>

        {/* OAuth Information Box */}
        <div className="mt-6 rounded-sm border border-border/60 bg-background p-3 text-xs text-text-tertiary">
          <div className="flex items-center gap-2 font-mono font-medium text-text-secondary">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>OAuth Mode: Connect securely via GitHub</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed">
            Default requested scope is <code className="text-accent">read:user</code> only. We never
            request write permissions or repository access without explicit confirmation.
          </p>
        </div>

        {/* Primary OAuth Button */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-accent py-3 font-mono text-sm font-bold text-accent-contrast shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover disabled:opacity-50"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>{isLoading ? 'Redirecting to GitHub...' : 'Continue with GitHub'}</span>
          </button>

          {/* Instant Sandbox / Demo Login */}
          <button
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-surface-raised py-2.5 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Explore Dashboard in Demo Mode</span>
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-4 font-mono text-[11px] text-text-tertiary">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Secure Encryption</span>
          </div>
          <span>v1.0.0</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="font-mono text-xs text-text-tertiary hover:text-text-secondary">
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
