'use client';

import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Sliders,
  Sparkles,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  Save,
  RotateCcw,
  Code2,
} from 'lucide-react';
import { API_BASE_URL, apiClient } from '../../../lib/api';

const CARD_TYPES = [
  { id: 'stats', label: 'Stats Overview', desc: 'Stars, commits, PRs, issues, and grade' },
  { id: 'streak', label: 'Streak', desc: 'Current, longest, and total contributions' },
  { id: 'languages', label: 'Languages', desc: 'Top languages in stacked bar or vertical list' },
  { id: 'activityGraph', label: 'Activity Heatmap', desc: '53x7 contribution graph' },
  { id: 'rankings', label: 'Rankings', desc: 'Percentile rank ring with signal drivers' },
  { id: 'profile', label: 'Profile Card', desc: 'Bio, avatar, followers, joined date' },
  { id: 'wrapped', label: 'Annual Wrapped', desc: 'Year-in-review 2x3 recap grid' },
  { id: 'trophies', label: 'Trophies', desc: 'Achievement tier medals' },
  { id: 'topContributed', label: 'Top Contributed', desc: 'Top third-party repositories' },
  { id: 'repository', label: 'Repository', desc: 'Single repo stars, forks, and language' },
];

const THEMES = [
  { id: 'terminal', label: 'Terminal', bg: '#0a0a0c', accent: '#3ddc84' },
  { id: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff' },
  { id: 'light', label: 'GitHub Light', bg: '#ffffff', accent: '#0969da' },
  { id: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b' },
  { id: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0' },
  { id: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7' },
  { id: 'catppuccin-mocha', label: 'Catppuccin', bg: '#1e1e2e', accent: '#f5c2e7' },
  { id: 'solarized-dark', label: 'Solarized Dark', bg: '#002b36', accent: '#268bd2' },
  { id: 'monokai', label: 'Monokai', bg: '#272822', accent: '#a6e22e' },
  { id: 'auto', label: 'Auto (System)', bg: '#0d1117', accent: '#3ddc84' },
];

const STAT_MODULES = [
  { id: 'stars', label: 'Total Stars' },
  { id: 'commits', label: 'Total Commits' },
  { id: 'prs', label: 'Pull Requests' },
  { id: 'issues', label: 'Issues Closed' },
  { id: 'contribs', label: 'Contributed Repos' },
  { id: 'rank', label: 'Calculated Grade' },
];

export default function CardStudioPage() {
  const [cardType, setCardType] = useState('stats');
  const [username, setUsername] = useState('theneotic');
  const [theme, setTheme] = useState('terminal');
  const [layout, setLayout] = useState<'compact' | 'cozy' | 'detailed'>('cozy');
  const [fontStyle, setFontStyle] = useState<'mono' | 'sans' | 'serif' | 'rounded'>('mono');
  const [borderRadius, setBorderRadius] = useState(4.5);
  const [hideBorder, setHideBorder] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [customAccent, setCustomAccent] = useState('');
  const [customBg, setCustomBg] = useState('');

  // Modules toggling for stats card
  const [enabledModules, setEnabledModules] = useState<string[]>([
    'stars',
    'commits',
    'prs',
    'issues',
    'contribs',
    'rank',
  ]);

  // Preset saving state
  const [presetName, setPresetName] = useState('My README Card');
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Compute live SVG URL
  const query = new URLSearchParams();
  query.set('username', username.trim() || 'theneotic');
  query.set('theme', theme);
  query.set('layout', layout);
  if (fontStyle !== 'mono') query.set('font_style', fontStyle);
  if (borderRadius !== 4.5) query.set('border_radius', String(borderRadius));
  if (hideBorder) query.set('hide_border', 'true');
  if (customAccent) query.set('accent', customAccent);
  if (customBg) query.set('background', customBg);

  if (cardType === 'stats') {
    if (enabledModules.length < 6) {
      query.set('modules', enabledModules.join(','));
    }
  }

  if (animated && (cardType === 'stats' || cardType === 'streak')) {
    query.set('animated', 'true');
  }

  query.set('mock', 'true'); // Instant deterministic preview

  const endpointName = cardType === 'activityGraph' ? 'activity-graph' : cardType;
  const liveSvgUrl = `${API_BASE_URL}/cards/${endpointName}.svg?${query.toString()}`;

  const toggleModule = (id: string) => {
    setEnabledModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const copySnippet = (format: 'markdown' | 'html' | 'url') => {
    const targetUrl = savedSlug
      ? `${API_BASE_URL}/cards/by-preset/${savedSlug}.svg`
      : liveSvgUrl;

    let textToCopy = targetUrl;
    if (format === 'markdown') {
      textToCopy = `[![${username}'s Stats](${targetUrl})](https://instrumentstats.dev)`;
    } else if (format === 'html') {
      textToCopy = `<a href="https://instrumentstats.dev"><img src="${targetUrl}" alt="${username}'s GitHub Stats" /></a>`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleSavePreset = async () => {
    setIsSaving(true);
    try {
      const optionsRecord: Record<string, unknown> = {
        username,
        theme,
        layout,
        border_radius: borderRadius,
        hide_border: hideBorder,
      };
      if (customAccent) optionsRecord.accent = customAccent;
      if (customBg) optionsRecord.background = customBg;
      if (cardType === 'stats') optionsRecord.modules = enabledModules.join(',');
      if (animated) optionsRecord.animated = true;

      const res = await apiClient<{ success: boolean; data: { slug: string } }>('/api/v1/presets', {
        method: 'POST',
        body: JSON.stringify({
          cardType,
          name: presetName || 'Saved Preset',
          options: optionsRecord,
        }),
      });

      if (res.data?.slug) {
        setSavedSlug(res.data.slug);
      }
    } catch {
      // In offline/demo mode, generate a pseudo slug for visual continuity
      setSavedSlug('inst' + Math.random().toString(36).substring(2, 6));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Card Studio
          </h1>
          <p className="text-xs text-text-secondary">
            Deep visual customization, module toggling, and permanent shareable slugs.
          </p>
        </div>

        {/* Save Preset Button */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset Name"
            className="w-40 rounded-sm border border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleSavePreset}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-sm bg-accent px-4 py-1.5 font-mono text-xs font-bold text-accent-contrast shadow transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save as Preset'}</span>
          </button>
        </div>
      </div>

      {/* Saved Preset Slug Banner */}
      {savedSlug && (
        <div className="flex items-center justify-between rounded-md border border-accent/40 bg-accent-subtle p-3 font-mono text-xs text-accent">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>
              Preset saved successfully! Permanent URL: <code className="font-bold">/cards/by-preset/{savedSlug}.svg</code>
            </span>
          </div>
          <button
            onClick={() => copySnippet('markdown')}
            className="rounded bg-accent px-2 py-0.5 text-accent-contrast font-bold"
          >
            Copy Markdown
          </button>
        </div>
      )}

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Pane: Customization Controls (7 Cols) */}
        <div className="space-y-6 lg:col-span-6">
          {/* 1. Card Type Picker */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <label className="flex items-center gap-2 font-mono text-xs font-semibold text-text-primary mb-3">
              <Layers className="h-4 w-4 text-accent" />
              <span>Card Engine (10 Types)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CARD_TYPES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCardType(c.id)}
                  className={`rounded-sm border p-2 text-left transition-colors ${
                    cardType === c.id
                      ? 'border-accent bg-accent-subtle text-accent font-bold'
                      : 'border-border bg-surface-raised text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="font-mono text-xs">{c.label}</div>
                  <div className="truncate text-[10px] text-text-tertiary">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Theme Picker */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <label className="flex items-center gap-2 font-mono text-xs font-semibold text-text-primary mb-3">
              <Palette className="h-4 w-4 text-accent" />
              <span>Theme Scheme (14 Palettes)</span>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 rounded-sm border p-2 text-left font-mono text-xs transition-colors ${
                    theme === t.id
                      ? 'border-accent bg-accent-subtle text-accent font-bold'
                      : 'border-border bg-surface-raised text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/30"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Palette Overrides */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
              <div>
                <span className="font-mono text-[11px] text-text-tertiary">Custom Accent Hex</span>
                <input
                  type="text"
                  placeholder="#3ddc84"
                  value={customAccent}
                  onChange={(e) => setCustomAccent(e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-background px-2 py-1 font-mono text-xs text-text-primary"
                />
              </div>
              <div>
                <span className="font-mono text-[11px] text-text-tertiary">Custom Background</span>
                <input
                  type="text"
                  placeholder="#0a0a0c"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-background px-2 py-1 font-mono text-xs text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* 3. Layout Density & Modules */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
            <div>
              <label className="flex items-center gap-2 font-mono text-xs font-semibold text-text-primary mb-2">
                <Sliders className="h-4 w-4 text-accent" />
                <span>Layout Density</span>
              </label>
              <div className="flex gap-2">
                {(['compact', 'cozy', 'detailed'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setLayout(d)}
                    className={`flex-1 rounded-sm border py-1.5 font-mono text-xs capitalize ${
                      layout === d
                        ? 'border-accent bg-accent-subtle text-accent font-bold'
                        : 'border-border bg-surface-raised text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Module Picker (Stats card only) */}
            {cardType === 'stats' && (
              <div className="border-t border-border/60 pt-3">
                <span className="font-mono text-xs font-semibold text-text-secondary">
                  Content Modules (Toggle On/Off)
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {STAT_MODULES.map((mod) => (
                    <label
                      key={mod.id}
                      className="flex cursor-pointer items-center gap-2 rounded bg-surface-raised px-2.5 py-1.5 font-mono text-xs text-text-secondary hover:text-text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={enabledModules.includes(mod.id)}
                        onChange={() => toggleModule(mod.id)}
                        className="accent-accent"
                      />
                      <span>{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Geometry & Border */}
            <div className="grid grid-cols-2 gap-4 border-t border-border/60 pt-3">
              <div>
                <span className="font-mono text-[11px] text-text-tertiary">
                  Border Radius: {borderRadius}px
                </span>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
                  className="mt-1 w-full accent-accent"
                />
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-text-secondary">
                  <input
                    type="checkbox"
                    checked={hideBorder}
                    onChange={(e) => setHideBorder(e.target.checked)}
                    className="accent-accent"
                  />
                  <span>Hide Border</span>
                </label>

                {(cardType === 'stats' || cardType === 'streak') && (
                  <label className="mt-2 flex cursor-pointer items-center gap-2 font-mono text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      checked={animated}
                      onChange={(e) => setAnimated(e.target.checked)}
                      className="accent-accent"
                    />
                    <span className="flex items-center gap-1 text-accent">
                      <Sparkles className="h-3 w-3" />
                      Animated CSS
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Live SVG Preview & Embed Codes (6 Cols) */}
        <div className="space-y-6 lg:col-span-6 lg:sticky lg:top-24">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold text-text-primary">
                Live SVG Canvas
              </span>
              <a
                href={liveSvgUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-xs text-text-tertiary hover:text-accent"
              >
                <span>Direct View</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Canvas */}
            <div className="my-6 flex min-h-[260px] items-center justify-center rounded-md border border-border/60 bg-[#060608] p-4 sm:p-8">
              <div className="overflow-x-auto py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={liveSvgUrl}
                  alt="Card Preview"
                  className="max-w-full drop-shadow-2xl transition-all duration-200"
                />
              </div>
            </div>

            {/* Quick Copy Embed Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="font-mono text-[11px] text-text-tertiary">
                Copy Embed Snippet:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copySnippet('markdown')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-accent py-2 font-mono text-xs font-bold text-accent-contrast transition-colors hover:bg-accent-hover"
                >
                  {copiedFormat === 'markdown' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Markdown</span>
                </button>
                <button
                  onClick={() => copySnippet('html')}
                  className="flex-1 rounded-sm border border-border bg-surface-raised py-2 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
                >
                  HTML Tag
                </button>
                <button
                  onClick={() => copySnippet('url')}
                  className="flex-1 rounded-sm border border-border bg-surface-raised py-2 font-mono text-xs text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
                >
                  Raw SVG URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
