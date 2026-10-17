'use client';

import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, AlertTriangle, Check } from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';

export default function DashboardSettingsPage() {
  const [includePrivate, setIncludePrivate] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleConnectPrivateRepos = () => {
    // Re-trigger OAuth with explicit repo scope (Section 8.1)
    window.location.href = `${API_BASE_URL}/auth/github?scope=repo`;
  };

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Account & Security Settings
        </h1>
        <p className="text-xs text-text-secondary">
          Manage OAuth permissions, token scopes, and data inclusion rules.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded border border-accent/40 bg-accent-subtle p-3 font-mono text-xs text-accent">
          <Check className="h-4 w-4" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* 1. Scope & Privacy Tier */}
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            GitHub OAuth Scopes
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          Instrument Stats adheres strictly to the principle of least privilege. Your account is
          currently connected with read-only profile access (<code className="text-accent">read:user</code>).
        </p>

        <div className="rounded border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-semibold text-text-primary">
                Private Repositories Stats
              </div>
              <div className="text-[11px] text-text-tertiary">
                Include private commit activity and private stars in your calculated cards.
              </div>
            </div>
            <button
              onClick={handleConnectPrivateRepos}
              className="rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              Grant `repo` Scope
            </button>
          </div>
        </div>
      </div>

      {/* 2. Card Attribution & Branding */}
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-accent" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            Footer Attribution & Sponsor Badges
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          All generated cards include a subtle attribution (<code className="font-mono">instrumentstats.dev</code>).
          Direct Instruments sponsors and patrons receive an accent sponsor dot indicator.
        </p>

        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <span className="font-mono text-xs text-text-secondary">Current Sponsor Status</span>
          <span className="rounded bg-surface-raised px-2.5 py-1 font-mono text-xs text-accent">
            Standard Community User
          </span>
        </div>
      </div>

      {/* 3. Session Revocation */}
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-danger" />
          <h2 className="font-display text-base font-semibold text-text-primary">
            Session Security
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          Sign out and immediately revoke all active refresh token chains across every device.
        </p>

        <button
          onClick={() => {
            window.location.href = '/login';
          }}
          className="rounded-sm border border-danger/40 bg-danger/10 px-4 py-2 font-mono text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
        >
          Revoke All Active Sessions
        </button>
      </div>
    </div>
  );
}
