'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { GitHubIcon } from '../../components/icons/GitHubIcon';

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showManualLookup, setShowManualLookup] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const handleGitHubOAuth = () => {
    setIsLoading(true);
    window.location.href = '/auth/github';
  };

  const handleDirectUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) return;
    const clean = customUsername.trim().replace(/^@/, '');
    localStorage.setItem('instrument_preview_username', clean);
    router.push('/dashboard');
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
              [ AUTH GATEWAY // OFFICIAL GITHUB OAUTH ]
            </span>
          </div>
          <span className="font-mono text-xs text-text-muted">LIVE API</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Connect with <span className="text-accent underline decoration-accent/40 decoration-wavy">GitHub</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
            One click imports your live username, repositories, commits, and star metrics automatically.
          </p>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mt-4 border-2 border-danger/60 bg-danger/10 p-3 text-xs text-text-primary flex items-start gap-2 pixel-corners">
            <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-danger uppercase tracking-wider font-mono">[ Auth Notice ]</p>
              <p className="text-[11px] text-text-secondary mt-0.5 font-mono">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Real OAuth Action Button */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={handleGitHubOAuth}
            disabled={isLoading}
            className="pixel-btn-gold flex w-full flex-col items-center justify-center py-3.5 px-4 font-sans text-sm font-bold tracking-wide uppercase transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              <GitHubIcon className="h-5 w-5" />
              <span>{isLoading ? 'Connecting to GitHub...' : 'Continue with GitHub OAuth ►'}</span>
            </div>
            <span className="text-[11px] font-mono font-normal normal-case opacity-90 mt-1">
              Automatic 1-click import of your GitHub account
            </span>
          </button>

          {/* Read-Only Guarantee Box */}
          <div className="border border-border/80 bg-background/80 p-3 text-xs text-text-secondary">
            <div className="flex items-center gap-2 font-sans font-bold text-text-primary">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Read-only permissions</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted font-sans">
              We only read your public contributions and stars. No code is modified.
            </p>
          </div>

          {/* Optional: Preview another account */}
          <div className="text-center pt-2">
            {!showManualLookup ? (
              <button
                onClick={() => setShowManualLookup(true)}
                className="font-mono text-xs text-text-muted hover:text-accent transition-colors"
              >
                Inspect another user&apos;s stats without logging in →
              </button>
            ) : (
              <form onSubmit={handleDirectUserLogin} className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-accent">@</span>
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="Enter any public username..."
                    className="w-full pl-8 pr-3 py-2 font-mono text-xs bg-background border-2 border-border focus:border-accent text-text-primary focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="pixel-btn flex w-full items-center justify-center gap-2 border-2 border-border bg-surface-raised py-2 font-sans text-xs font-bold text-text-primary hover:border-accent hover:text-accent shadow-[2px_2px_0px_#0c0b0a]"
                >
                  <span>Preview User Cards ►</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3.5 font-mono text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-moss" />
            <span>Direct GitHub OAuth</span>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginContent />
    </Suspense>
  );
}
