'use client';

import React, { useState, useEffect } from 'react';
import { Check, Copy, AlertCircle, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/env';

interface ThemeSwatch {
  id: string;
  label: string;
  bg: string;
  accent: string;
}

const DEMO_THEMES: ThemeSwatch[] = [
  { id: 'wabi-sabi', label: 'Wabi-Sabi', bg: '#151412', accent: '#ca8a04' },
  { id: 'pixel-art', label: 'Pixel Art', bg: '#0f0d1b', accent: '#e879f9' },
  { id: 'terminal', label: 'Terminal', bg: '#0a0a0c', accent: '#3ddc84' },
  { id: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff' },
  { id: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b' },
  { id: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0' },
];

const CARD_TABS = [
  { id: 'stats', label: 'Stats' },
  { id: 'streak', label: 'Streak' },
  { id: 'languages', label: 'Languages' },
  { id: 'rankings', label: 'Rankings' },
];

export function LiveCardDemo() {
  const [selectedCard, setSelectedCard] = useState('stats');
  const [theme, setTheme] = useState('wabi-sabi');
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [origin, setOrigin] = useState('https://gitprofilestat.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const cardEndpoint = selectedCard;
  const basePath = API_BASE_URL ? API_BASE_URL : '';
  const svgRelativeUrl = `${basePath}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`;
  const svgAbsoluteUrl = API_BASE_URL
    ? `${API_BASE_URL}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`
    : `${origin}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`;

  const markdownEmbed = `[![GitHub Stats](${svgAbsoluteUrl})](https://gitprofilestat.vercel.app)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownEmbed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardChange = (cardId: string) => {
    setSelectedCard(cardId);
    setHasError(false);
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setHasError(false);
  };

  return (
    <div className="w-full flex flex-col items-center" id="demo">
      {/* 8-Bit Stone HUD Controls Container */}
      <div className="w-full max-w-3xl border-2 border-border bg-surface p-5 sm:p-6 shadow-[6px_6px_0px_#0c0b0a] pixel-corners">
        <div className="flex items-center justify-between border-b border-border/80 pb-3.5 mb-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-moss animate-pulse" />
            <span className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
              [ LIVE STUDIO // 600 × 280 HIGH-RES ]
            </span>
          </div>
          <span className="font-mono text-xs text-text-muted">
            Theme: <span className="text-text-primary font-semibold capitalize">{theme}</span>
          </span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Card Inventory Slot Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CARD_TABS.map((tab) => {
              const isActive = selectedCard === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCardChange(tab.id)}
                  className={`px-3.5 py-1.5 font-sans text-xs font-bold transition-all ${
                    isActive
                      ? 'border-2 border-accent bg-accent text-accent-contrast shadow-[2px_2px_0px_#78350f]'
                      : 'border-2 border-border bg-surface-raised text-text-secondary hover:border-text-secondary hover:text-text-primary shadow-[2px_2px_0px_#0c0b0a]'
                  } active:translate-x-[1px] active:translate-y-[1px]`}
                >
                  [{tab.label}]
                </button>
              );
            })}
          </div>

          {/* Theme Palette Swatches */}
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-left transition-all ${
                    isSelected
                      ? 'border-2 border-accent bg-surface-raised text-text-primary shadow-[2px_2px_0px_#ca8a04]'
                      : 'border-2 border-border bg-surface text-text-secondary hover:text-text-primary hover:border-text-secondary shadow-[2px_2px_0px_#0c0b0a]'
                  } active:translate-x-[1px] active:translate-y-[1px]`}
                >
                  {/* Color Swatch Block */}
                  <span
                    className="flex h-3.5 w-4 shrink-0 items-center justify-center border border-white/20"
                    style={{ backgroundColor: t.bg }}
                  >
                    <span
                      className="h-1.5 w-1.5"
                      style={{ backgroundColor: t.accent }}
                    />
                  </span>
                  <span className="font-sans text-xs font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Much Bigger, Majestic Live Card Display */}
      <div className="mt-8 flex w-full max-w-3xl flex-col items-center">
        <div className="w-full border-2 border-border bg-surface p-4 sm:p-8 shadow-[8px_8px_0px_#0c0b0a] pixel-corners">
          <div className="w-full flex items-center justify-between border-b border-border/60 pb-3 mb-5 font-mono text-xs text-text-muted">
            <span className="flex items-center gap-2 text-text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-text-primary font-bold uppercase">{selectedCard} card</span>
              <span>·</span>
              <span className="text-accent font-semibold">{theme}</span>
            </span>
            <span className="font-mono text-xs text-text-tertiary">Live Rendered SVG</span>
          </div>

          {/* Large Card Stage */}
          <div className="relative w-full min-h-[300px] flex items-center justify-center p-2 sm:p-6 bg-background/80 border-2 border-border/60 shadow-inner">
            {/* Fallback State if 404 */}
            {hasError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-text-muted">
                <AlertCircle className="h-7 w-7 text-accent mb-2" />
                <p className="font-sans text-sm font-semibold">Preview temporarily unavailable</p>
                <button
                  onClick={() => setHasError(false)}
                  className="mt-3 font-mono text-xs text-accent underline hover:text-accent-bright"
                >
                  [ Retry Preview ► ]
                </button>
              </div>
            ) : (
              /* High-Resolution Scale SVG Image - Always Visible */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={svgRelativeUrl}
                src={svgRelativeUrl}
                alt={`${selectedCard} stats card preview`}
                onError={() => setHasError(true)}
                className="w-full max-w-[620px] h-auto object-contain block drop-shadow-xl transition-all"
              />
            )}
          </div>
        </div>

        {/* Crisp Markdown Embed Bar */}
        <div className="mt-4 flex w-full items-center justify-between gap-3 border-2 border-border bg-surface px-4 py-2.5 text-xs shadow-[4px_4px_0px_#0c0b0a]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="font-mono text-xs font-bold text-accent shrink-0">►</span>
            <span className="truncate font-mono text-xs text-text-secondary">{markdownEmbed}</span>
          </div>

          <button
            onClick={handleCopy}
            className="pixel-btn-gold flex shrink-0 items-center gap-2 px-4 py-1.5 font-sans text-xs font-bold uppercase"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
