'use client';

import React, { useState } from 'react';
import { Check, Copy, Sparkles, Terminal, Palette, Sliders, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const DEMO_CARDS = [
  { id: 'stats', label: 'Stats Overview' },
  { id: 'streak', label: 'Streak' },
  { id: 'languages', label: 'Languages' },
  { id: 'activityGraph', label: 'Heatmap' },
  { id: 'rankings', label: 'Rankings' },
  { id: 'wrapped', label: 'Wrapped' },
];

const POPULAR_THEMES = [
  { id: 'terminal', label: 'Terminal', color: '#3ddc84', bg: '#0a0a0c' },
  { id: 'dracula', label: 'Dracula', color: '#ff79c6', bg: '#282a36' },
  { id: 'nord', label: 'Nord', color: '#88c0d0', bg: '#2e3440' },
  { id: 'tokyo-night', label: 'Tokyo Night', color: '#7aa2f7', bg: '#1a1b26' },
  { id: 'catppuccin-mocha', label: 'Catppuccin', color: '#f5c2e7', bg: '#1e1e2e' },
  { id: 'auto', label: 'Auto (System)', color: '#58a6ff', bg: '#0d1117' },
];

export function LiveCardDemo() {
  const [selectedCard, setSelectedCard] = useState('stats');
  const [username, setUsername] = useState('theneotic');
  const [theme, setTheme] = useState('terminal');
  const [density, setDensity] = useState<'compact' | 'cozy' | 'detailed'>('cozy');
  const [animated, setAnimated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build the public SVG query URL
  const queryParams = new URLSearchParams();
  queryParams.set('username', username.trim() || 'theneotic');
  queryParams.set('theme', theme);
  queryParams.set('layout', density);
  if (animated && (selectedCard === 'stats' || selectedCard === 'streak')) {
    queryParams.set('animated', 'true');
  }
  queryParams.set('mock', 'true'); // Demo always renders quickly and reliably

  const cardEndpoint = selectedCard === 'activityGraph' ? 'activity-graph' : selectedCard;
  const svgUrl = `${API_BASE_URL}/cards/${cardEndpoint}.svg?${queryParams.toString()}`;
  const markdownEmbed = `[![${username}'s Stats](${svgUrl})](https://instrumentstats.dev)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownEmbed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-lg border border-border bg-surface p-4 shadow-2xl sm:p-6" id="demo">
      {/* Top Controls Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Card Type Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {DEMO_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`rounded-sm px-3 py-1 font-mono text-xs transition-colors ${
                selectedCard === card.id
                  ? 'bg-accent text-accent-contrast font-bold'
                  : 'bg-surface-raised text-text-secondary hover:text-text-primary'
              }`}
            >
              {card.label}
            </button>
          ))}
        </div>

        {/* Username Input */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-tertiary">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="github-username"
            className="w-32 rounded-sm border border-border bg-background px-2 py-1 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Customizer Sub-Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-border/40 text-xs">
        {/* Theme Swatches */}
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-text-tertiary" />
          <span className="font-mono text-text-secondary">Theme:</span>
          <div className="flex items-center gap-1.5">
            {POPULAR_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-transform ${
                  theme === t.id
                    ? 'scale-110 border-accent ring-2 ring-accent/30'
                    : 'border-border/60 hover:scale-105'
                }`}
                style={{ backgroundColor: t.bg }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
              </button>
            ))}
          </div>
        </div>

        {/* Density & Animation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-text-tertiary" />
            <span className="font-mono text-text-secondary">Density:</span>
            {(['compact', 'cozy', 'detailed'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`rounded-sm px-2 py-0.5 font-mono text-[11px] capitalize ${
                  density === d
                    ? 'border border-accent/40 bg-accent-subtle text-accent'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {(selectedCard === 'stats' || selectedCard === 'streak') && (
            <label className="flex cursor-pointer items-center gap-1.5 font-mono text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={animated}
                onChange={(e) => setAnimated(e.target.checked)}
                className="accent-accent"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                Animated
              </span>
            </label>
          )}
        </div>
      </div>

      {/* SVG Canvas Preview Container */}
      <div className="my-6 flex min-h-[220px] items-center justify-center rounded-md border border-border/50 bg-[#060608] p-4 sm:p-8">
        <div className="overflow-x-auto py-2">
          {/* Direct live SVG image render */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svgUrl}
            alt={`${username}'s ${selectedCard} card`}
            className="max-w-full drop-shadow-xl transition-all duration-300"
          />
        </div>
      </div>

      {/* Embed Code Snippet Copy Bar */}
      <div className="flex flex-col gap-2 rounded-sm border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate font-mono text-xs text-text-secondary">
            {markdownEmbed}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={svgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-sm border border-border px-2 py-1 font-mono text-xs text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Open Raw</span>
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1 font-mono text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
