'use client';

import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const ALL_14_THEMES = [
  { name: 'terminal', label: 'Terminal (House)', bg: '#0a0a0c', accent: '#3ddc84', border: '#26262c', text: '#e8e8ec' },
  { name: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff', border: '#30363d', text: '#c9d1d9' },
  { name: 'light', label: 'GitHub Light', bg: '#ffffff', accent: '#0969da', border: '#d0d7de', text: '#24292f' },
  { name: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b', border: '#44475a', text: '#f8f8f2' },
  { name: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0', border: '#4c566a', text: '#eceff4' },
  { name: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7', border: '#24283b', text: '#c0caf5' },
  { name: 'catppuccin-mocha', label: 'Catppuccin Mocha', bg: '#1e1e2e', accent: '#f5c2e7', border: '#313244', text: '#cdd6f4' },
  { name: 'catppuccin-latte', label: 'Catppuccin Latte', bg: '#eff1f5', accent: '#ea76cb', border: '#ccd0da', text: '#4c4f69' },
  { name: 'solarized-dark', label: 'Solarized Dark', bg: '#002b36', accent: '#268bd2', border: '#073642', text: '#839496' },
  { name: 'solarized-light', label: 'Solarized Light', bg: '#fdf6e3', accent: '#268bd2', border: '#eee8d5', text: '#657b83' },
  { name: 'monokai', label: 'Monokai', bg: '#272822', accent: '#a6e22e', border: '#49483e', text: '#f8f8f2' },
  { name: 'rose-pine', label: 'Rosé Pine', bg: '#191724', accent: '#ebbcba', border: '#26233a', text: '#e0def4' },
  { name: 'gruvbox', label: 'Gruvbox', bg: '#282828', accent: '#fabd2f', border: '#3c3836', text: '#ebdbb2' },
  { name: 'github', label: 'GitHub Green', bg: '#0d1117', accent: '#2ea44f', border: '#30363d', text: '#c9d1d9' },
];

export function ThemeShowcase() {
  const [activeTheme, setActiveTheme] = useState('terminal');

  const previewUrl = `${API_BASE_URL}/cards/stats.svg?username=theneotic&theme=${activeTheme}&mock=true&layout=cozy`;

  return (
    <section className="border-t border-border bg-background py-20" id="themes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">
            Color Science
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            14 Hand-Crafted Palettes. No Drift.
          </h2>
          <p className="mt-4 text-sm text-text-secondary sm:text-base">
            Every theme uses canonical, verified community hex codes from Dracula, Nord, Tokyo
            Night, Catppuccin, and Solarized. Plus full support for custom palettes and auto
            dark/light mode.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Swatches Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {ALL_14_THEMES.map((theme) => {
              const isSelected = activeTheme === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => setActiveTheme(theme.name)}
                  className={`flex items-center justify-between rounded-md border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-surface-raised shadow-md'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Color Dot */}
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-sm border border-black/20 shadow-inner"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <div>
                      <div className="font-display text-xs font-semibold text-text-primary">
                        {theme.label}
                      </div>
                      <div className="font-mono text-[10px] text-text-tertiary">
                        {theme.accent}
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>

          {/* Live Theme Preview */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-[#060608] p-6 lg:col-span-5">
            <span className="font-mono text-xs text-text-tertiary mb-4">
              Previewing: <span className="text-accent">{activeTheme}</span>
            </span>
            <div className="overflow-hidden rounded-md shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`${activeTheme} theme preview`}
                className="max-w-full drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
