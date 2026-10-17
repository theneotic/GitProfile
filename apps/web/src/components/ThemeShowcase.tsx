'use client';

import React, { useState } from 'react';
import { Palette, Check, AlertCircle, Layers } from 'lucide-react';
import { API_BASE_URL } from '../config/env';

const ALL_14_THEMES = [
  { name: 'wabi-sabi', label: 'Wabi-Sabi', desc: 'Aged stone & kintsugi gold', bg: '#151412', accent: '#ca8a04' },
  { name: 'pixel-art', label: 'Pixel Art', desc: '16-bit arcade neon purple', bg: '#0f0d1b', accent: '#e879f9' },
  { name: 'terminal', label: 'Terminal', desc: 'Phosphor green terminal', bg: '#0a0a0c', accent: '#3ddc84' },
  { name: 'dark', label: 'GitHub Dark', desc: 'Classic GitHub slate & blue', bg: '#0d1117', accent: '#58a6ff' },
  { name: 'light', label: 'GitHub Light', desc: 'Pristine day mode white', bg: '#ffffff', accent: '#0969da' },
  { name: 'dracula', label: 'Dracula', desc: 'Vampire purple & green', bg: '#282a36', accent: '#50fa7b' },
  { name: 'nord', label: 'Nord', desc: 'Arctic bluish gray & frost', bg: '#2e3440', accent: '#88c0d0' },
  { name: 'tokyo-night', label: 'Tokyo Night', desc: 'Downtown neon twilight', bg: '#1a1b26', accent: '#7aa2f7' },
  { name: 'catppuccin-mocha', label: 'Catppuccin Mocha', desc: 'Soothing pastel lavender', bg: '#1e1e2e', accent: '#f5c2e7' },
  { name: 'catppuccin-latte', label: 'Catppuccin Latte', desc: 'Warm cream & magenta', bg: '#eff1f5', accent: '#ea76cb' },
  { name: 'solarized-dark', label: 'Solarized Dark', desc: 'Deep cyan precision', bg: '#002b36', accent: '#268bd2' },
  { name: 'solarized-light', label: 'Solarized Light', desc: 'Warm parchment solar', bg: '#fdf6e3', accent: '#268bd2' },
  { name: 'monokai', label: 'Monokai', desc: 'Vibrant lime & charcoal', bg: '#272822', accent: '#a6e22e' },
  { name: 'rose-pine', label: 'Rosé Pine', desc: 'Nordic dusk & lilac pink', bg: '#191724', accent: '#ebbcba' },
  { name: 'gruvbox', label: 'Gruvbox', desc: 'Retro warm terracotta', bg: '#282828', accent: '#fabd2f' },
  { name: 'github', label: 'GitHub Green', desc: 'Classic contribution green', bg: '#0d1117', accent: '#2ea44f' },
];

const PREVIEW_CARDS = [
  { id: 'stats', label: 'Stats' },
  { id: 'streak', label: 'Streak' },
  { id: 'languages', label: 'Languages' },
  { id: 'rankings', label: 'Rankings' },
];

export function ThemeShowcase() {
  const [activeTheme, setActiveTheme] = useState('wabi-sabi');
  const [previewCard, setPreviewCard] = useState('stats');
  const [hasError, setHasError] = useState(false);

  const basePath = API_BASE_URL ? API_BASE_URL : '';
  const previewUrl = `${basePath}/cards/${previewCard}.svg?username=octocat&theme=${activeTheme}&mock=true`;

  return (
    <section className="border-t-2 border-border bg-background py-24" id="themes">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-surface px-3 py-1 shadow-[2px_2px_0px_#0c0b0a] mb-4">
            <span className="h-2 w-2 bg-accent" />
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
              [ 14 HANDCRAFTED PALETTES ]
            </span>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            14 Palettes, Rendered Large.
          </h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base font-sans leading-relaxed">
            From Wabi-Sabi earthy stone and kintsugi gold to 16-bit retro arcade neons and verified developer classics.
          </p>
        </div>

        {/* 2-Column Showcase: Swatches on Left, Large Stage on Right */}
        <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Swatches Grid */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:col-span-6">
            {ALL_14_THEMES.map((theme) => {
              const isSelected = activeTheme === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => {
                    setActiveTheme(theme.name);
                    setHasError(false);
                  }}
                  className={`flex items-center justify-between border-2 p-3 text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-surface-raised shadow-[3px_3px_0px_#ca8a04]'
                      : 'border-border bg-surface hover:border-text-secondary hover:bg-surface-raised shadow-[2px_2px_0px_#0c0b0a]'
                  } active:translate-x-[1px] active:translate-y-[1px]`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Color Swatch Tile */}
                    <div
                      className="flex h-6 w-8 shrink-0 items-center justify-center border border-white/20 shadow-xs"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span
                        className="h-2.5 w-2.5"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    <div>
                      <div className="font-sans text-xs font-bold text-text-primary">
                        {theme.label}
                      </div>
                      <div className="font-sans text-[11px] text-text-muted">
                        {theme.desc}
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

          {/* MUCH BIGGER Live Preview Card Stage */}
          <div className="flex flex-col items-center border-2 border-border bg-surface p-6 sm:p-8 shadow-[8px_8px_0px_#0c0b0a] lg:col-span-6 pixel-corners">
            {/* Stage Header */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4 gap-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-accent" />
                <span className="font-sans text-sm font-bold text-text-primary uppercase">
                  Palette: <span className="text-accent">{activeTheme}</span>
                </span>
              </div>

              {/* Card Switcher in Showcase */}
              <div className="flex items-center gap-1">
                {PREVIEW_CARDS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setPreviewCard(card.id)}
                    className={`px-2.5 py-1 font-sans text-xs font-semibold transition-all ${
                      previewCard === card.id
                        ? 'border border-accent bg-accent text-accent-contrast'
                        : 'border border-border bg-background text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {card.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expansive Card Canvas */}
            <div className="relative mt-6 w-full flex items-center justify-center p-4 sm:p-6 bg-background/80 border-2 border-border/80 shadow-inner min-h-[320px]">
              {hasError ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-text-muted">
                  <AlertCircle className="h-6 w-6 mb-2 text-accent" />
                  <span className="font-sans text-sm font-semibold">Preview temporarily unavailable</span>
                </div>
              ) : (
                /* Always 100% visible, expansive rendering */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt={`Theme preview: ${activeTheme}`}
                  onError={() => setHasError(true)}
                  className="w-full max-w-[560px] h-auto object-contain block drop-shadow-lg transition-all"
                />
              )}
            </div>

            <div className="w-full mt-4 flex items-center justify-between font-mono text-xs text-text-muted">
              <span>Dynamic SVG</span>
              <span className="text-accent font-semibold">Ready to embed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
