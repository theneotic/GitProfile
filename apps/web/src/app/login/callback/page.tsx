'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Terminal, Loader2, AlertCircle } from 'lucide-react';
import { setAccessToken } from '../../../lib/api';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Verifying GitHub authentication...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const err = searchParams.get('error');

    // 1. If code is received directly on this page, forward to server callback
    if (code) {
      window.location.href = `/api/auth/callback?code=${encodeURIComponent(code)}`;
      return;
    }

    if (err) {
      setErrorMsg(err);
      setStatus(`Authentication failed: ${err}`);
      setTimeout(() => router.push('/login'), 2500);
      return;
    }

    // 2. Hash fragment access token check
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const token = hash.replace(/^#access_token=/, '').split('&')[0];
      setAccessToken(token);
      window.history.replaceState(null, '', window.location.pathname);
      setStatus('Authentication verified. Loading dashboard...');
      setTimeout(() => router.push('/dashboard'), 500);
    } else {
      router.push('/dashboard');
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 bg-wabi-grid">
      <div className="flex flex-col items-center gap-4 border-2 border-border bg-surface p-8 shadow-[6px_6px_0px_#0c0b0a] pixel-corners">
        <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-surface-raised text-accent">
          <Terminal className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
          {errorMsg ? (
            <AlertCircle className="h-4 w-4 text-danger" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          )}
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CallbackContent />
    </Suspense>
  );
}
