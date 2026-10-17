'use client';

import React from 'react';
import Link from 'next/link';
import { Palette, ExternalLink, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';

const THEMES = [
  { name: 'terminal', label: 'Terminal (House Palette)', bg: '#0a0a0c', accent: '#3ddc84', border: '#26262c', font: 'JetBrains Mono' },
  { name: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff', border: '#30363d', font: 'System Sans' },
  { name: 'light', label: 'GitHub Light', bg: '#ffffff', accent: '#0969da', border: '#d0d7de', font: 'System Sans' },
  { name: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b', border: '#44475a', font: 'Courier New' },
  { name: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0', border: '#4c566a', font: 'System Sans' },
  { name: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7', border: '#24283b', font: 'System Sans' },
  { name: 'catppuccin-mocha', label: 'Catppuccin Mocha', bg: '#1e1e2e', accent: '#f5c2e7', border: '#313244', font: 'System Sans' },
  { name: 'catppuccin-latte', label: 'Catppuccin Latte', bg: '#eff1f5', accent: '#ea76cb', border: '#ccd0da', font: 'System Sans' },
  { name: 'solarized-dark', label: 'Solarized Dark', bg: '#002b36', accent: '#268bd2', border: '#073642', font: 'System Sans' },
  { name: 'solarized-light', label: 'Solarized Light', bg: '#fdf6e3', accent: '#268bd2', border: '#eee8d5', font: 'System Sans' },
  { name: 'monokai', label: 'Monokai', bg: '#272822', accent: '#a6e22e', border: '#49483e', font: 'JetBrains Mono' },
  { name: 'rose-pine', label: 'Rosé Pine', bg: '#191724', accent: '#ebbcba', border: '#26233a', font: 'System Sans' },
  { name: 'gruvbox', label: 'Gruvbox', bg: '#282828', accent: '#fabd2f', border: '#3c3836', font: 'System Sans' },
  { name: 'github', label: 'GitHub Green', bg: '#0d1117', accent: '#2ea44f', border: '#30363d', font: 'System Sans' },
];

export default function DashboardThemesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Theme Gallery
        </h1>
        <p className="text-xs text-text-secondary">
          Explore all 14 published palettes. Click any theme to load it into Card Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => {
          const previewUrl = `${API_BASE_URL}/cards/stats.svg?username=theneotic&theme=${theme.name}&mock=true&layout=compact`;
          return (
            <div
              key={theme.name}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/30"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="font-display text-xs font-semibold text-text-primary">
                      {theme.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-text-tertiary">{theme.font}</span>
                </div>

                {/* SVG Card Thumbnail */}
                <div className="flex items-center justify-center rounded border border-border/50 bg-[#060608] p-3 my-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt={theme.label} className="max-w-full drop-shadow" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <code className="font-mono text-[11px] text-text-tertiary">
                  ?theme={theme.name}
                </code>
                <Link
                  href={`/dashboard/cards?theme=${theme.name}`}
                  className="flex items-center gap-1 font-mono text-xs text-accent hover:underline"
                >
                  <span>Use in Studio</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
