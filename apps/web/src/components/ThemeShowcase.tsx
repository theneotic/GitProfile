'use client';

import React, { useState } from 'react';
import { Palette, Check, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/env';

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const basePath = API_BASE_URL ? API_BASE_URL : '';
  const previewUrl = `${basePath}/cards/stats.svg?username=octocat&theme=${activeTheme}&mock=true`;

  const handleThemeChange = (name: string) => {
    setActiveTheme(name);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <section className="border-t border-border bg-background py-24" id="themes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            14 Hand-Crafted Palettes.
          </h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            Verified community hex codes from Dracula, Nord, Tokyo Night, and Catppuccin.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Swatches Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {ALL_14_THEMES.map((theme) => {
              const isSelected = activeTheme === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`flex items-center justify-between rounded-md border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-surface-raised shadow-sm'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-raised'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Mini Swatch Pill */}
                    <div
                      className="flex h-5 w-8 rounded-xs border border-white/10 items-center justify-end px-1"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-medium text-text-primary">
                        {theme.label}
                      </div>
                      <div className="font-mono text-[10px] text-text-tertiary uppercase">
                        {theme.accent}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="h-4 w-4 text-accent shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Card Preview Box */}
          <div className="flex flex-col items-center rounded-lg border border-border bg-surface p-6 lg:col-span-5">
            <div className="w-full flex items-center justify-between border-b border-border/50 pb-3 font-mono text-xs text-text-tertiary">
              <span className="flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-accent" />
                <span>Active: {activeTheme}</span>
              </span>
              <span>495 × 195</span>
            </div>

            <div className="relative mt-6 w-full max-w-[495px] aspect-[495/195] flex items-center justify-center overflow-hidden rounded-md border border-border/60">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface animate-pulse">
                  <div className="h-5 w-28 rounded bg-surface-raised mb-3" />
                  <div className="h-3 w-40 rounded bg-surface-raised" />
                </div>
              )}

              {hasError && !isLoading && (
                <div className="flex flex-col items-center justify-center text-center text-text-tertiary">
                  <AlertCircle className="h-5 w-5 mb-1 text-text-tertiary" />
                  <span className="font-mono text-xs">Preview unavailable</span>
                </div>
              )}

              {!hasError && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt={`Theme preview: ${activeTheme}`}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                  className={`w-full h-full object-contain transition-opacity duration-200 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
