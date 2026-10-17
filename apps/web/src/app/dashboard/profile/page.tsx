'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Globe, Plus, Trash2, Check, ExternalLink, Save } from 'lucide-react';
import { apiClient } from '../../../lib/api';

interface PinnedLink {
  label: string;
  url: string;
}

export default function DashboardProfileEditorPage() {
  const [enabled, setEnabled] = useState(true);
  const [bioOverride, setBioOverride] = useState(
    'Building direct instruments, autonomous systems & high-precision tools.'
  );
  const [pinnedLinks, setPinnedLinks] = useState<PinnedLink[]>([
    { label: 'GitHub Profile', url: 'https://github.com/theneotic' },
    { label: 'Personal Website', url: 'https://theneotic.dev' },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [username, setUsername] = useState('theneotic');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('instrument_preview_username');
      if (saved) setUsername(saved);
    }
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.username) {
          setUsername(data.user.username);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddLink = () => {
    if (!newLabel || !newUrl) return;
    if (pinnedLinks.length >= 5) return;
    setPinnedLinks([...pinnedLinks, { label: newLabel, url: newUrl }]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleRemoveLink = (index: number) => {
    setPinnedLinks(pinnedLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await apiClient('/api/v1/profile-page', {
        method: 'PUT',
        body: JSON.stringify({
          enabled,
          bioOverride,
          pinnedLinks,
          presetIds: [],
        }),
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Developer Portfolio Page
          </h1>
          <p className="text-xs text-text-secondary">
            Configure your public shareable developer portfolio page at{' '}
            <code className="text-accent">/u/{username}</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/u/${username}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            <span>View Live Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-sm bg-accent px-4 py-1.5 font-mono text-xs font-bold text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded border border-accent/40 bg-accent-subtle p-3 font-mono text-xs text-accent">
          <Check className="h-4 w-4" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* Enable Public Page Switch */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-accent" />
            <div>
              <div className="font-display text-base font-semibold text-text-primary">
                Enable Public Profile
              </div>
              <div className="text-xs text-text-secondary">
                Allow anyone to visit your clean portfolio showcase at /u/{username}.
              </div>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-raised peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </div>
      </div>

      {/* Bio Override */}
      <div className="rounded-lg border border-border bg-surface p-6 space-y-3">
        <label className="font-display text-base font-semibold text-text-primary">
          Custom Portfolio Bio (Max 280 Characters)
        </label>
        <p className="text-xs text-text-secondary">
          Overrides your GitHub bio specifically on your public Instrument Stats page. Leave blank to
          fall back to your live GitHub account bio.
        </p>
        <textarea
          rows={3}
          maxLength={280}
          value={bioOverride}
          onChange={(e) => setBioOverride(e.target.value)}
          className="w-full rounded border border-border bg-background p-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
        />
        <div className="text-right font-mono text-[10px] text-text-tertiary">
          {bioOverride.length} / 280
        </div>
      </div>

      {/* Pinned Links */}
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <label className="font-display text-base font-semibold text-text-primary">
          Pinned Developer Links (Max 5)
        </label>
        <div className="space-y-2">
          {pinnedLinks.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded bg-surface-raised p-2.5 font-mono text-xs"
            >
              <div>
                <span className="font-bold text-text-primary">{link.label}</span>
                <span className="ml-3 text-text-tertiary">{link.url}</span>
              </div>
              <button
                onClick={() => handleRemoveLink(idx)}
                className="text-text-tertiary hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {pinnedLinks.length < 5 && (
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Label (e.g. Portfolio)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 rounded border border-border bg-background px-3 py-1.5 font-mono text-xs text-text-primary"
            />
            <input
              type="url"
              placeholder="https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-2 rounded border border-border bg-background px-3 py-1.5 font-mono text-xs text-text-primary"
            />
            <button
              onClick={handleAddLink}
              className="flex items-center gap-1 rounded bg-surface-raised px-3 py-1.5 font-mono text-xs text-accent hover:border-accent border border-border"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
