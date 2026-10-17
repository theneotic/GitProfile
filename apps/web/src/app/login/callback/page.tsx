'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Loader2 } from 'lucide-react';
import { setAccessToken } from '../../../lib/api';

export default function LoginCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Verifying GitHub authentication...');

  useEffect(() => {
    // Read access token from URL hash fragment (Section 8.2)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const token = hash.replace(/^#access_token=/, '').split('&')[0];
      setAccessToken(token);
      // Clean fragment from browser history immediately to avoid lingering credentials
      window.history.replaceState(null, '', window.location.pathname);
      setStatus('Authentication verified. Loading dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      // Check query param error
      const searchParams = new URLSearchParams(window.location.search);
      const error = searchParams.get('error');
      if (error) {
        setStatus(`Authentication failed: ${error}. Redirecting...`);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        // Fallback for direct navigation
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-8 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-surface-raised text-accent">
          <Terminal className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}
