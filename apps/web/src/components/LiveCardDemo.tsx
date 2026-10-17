'use client';

import React, { useState, useEffect } from 'react';
import { Check, Copy, Terminal, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/env';

interface ThemeSwatch {
  id: string;
  label: string;
  bg: string;
  accent: string;
}

const DEMO_THEMES: ThemeSwatch[] = [
  { id: 'terminal', label: 'Terminal', bg: '#0a0a0c', accent: '#3ddc84' },
  { id: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff' },
  { id: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b' },
  { id: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0' },
  { id: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7' },
  { id: 'auto', label: 'Auto (System)', bg: '#0d1117', accent: '#3ddc84' },
];

const CARD_TABS = [
  { id: 'stats', label: 'Stats' },
  { id: 'streak', label: 'Streak' },
  { id: 'languages', label: 'Languages' },
  { id: 'rankings', label: 'Rankings' },
];

export function LiveCardDemo() {
  const [selectedCard, setSelectedCard] = useState('stats');
  const [theme, setTheme] = useState('terminal');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [origin, setOrigin] = useState('https://instrumentstats.dev');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Use neutral octocat mock data by default
  const cardEndpoint = selectedCard;
  const basePath = API_BASE_URL ? API_BASE_URL : '';
  const svgRelativeUrl = `${basePath}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`;
  const svgAbsoluteUrl = API_BASE_URL
    ? `${API_BASE_URL}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`
    : `${origin}/cards/${cardEndpoint}.svg?username=octocat&theme=${theme}&mock=true`;

  const markdownEmbed = `[![GitHub Stats](${svgAbsoluteUrl})](https://instrumentstats.dev)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownEmbed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardChange = (cardId: string) => {
    setSelectedCard(cardId);
    setIsLoading(true);
    setHasError(false);
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <div className="w-full flex flex-col items-center" id="demo">
      {/* Centered Controls Container: One Clean Bordered Box */}
      <div className="w-full max-w-2xl rounded-lg border border-border bg-surface p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Card Type Tabs */}
          <div className="flex items-center gap-1 rounded-sm bg-background p-1 border border-border">
            {CARD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCardChange(tab.id)}
                className={`px-3 py-1 font-mono text-xs rounded-sm transition-colors ${
                  selectedCard === tab.id
                    ? 'bg-surface text-text-primary font-semibold shadow-xs'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Theme Swatches with Text Labels */}
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`flex items-center gap-2 rounded-sm px-2.5 py-1 text-left transition-all ${
                    isSelected
                      ? 'border border-accent/60 bg-surface-raised text-text-primary'
                      : 'border border-border/60 bg-background text-text-tertiary hover:text-text-secondary hover:border-border'
                  }`}
                >
                  {/* Mini Preview Box */}
                  <span
                    className="flex h-3 w-4.5 rounded-xs border border-white/10 shrink-0 overflow-hidden items-center justify-end px-0.5"
                    style={{ backgroundColor: t.bg }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: t.accent }}
                    />
                  </span>
                  <span className="font-mono text-xs">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SVG Preview: Sits naturally on page background with exact aspect ratio */}
      <div className="mt-8 flex w-full max-w-[495px] flex-col items-center">
        <div className="relative w-full aspect-[495/195] flex items-center justify-center overflow-hidden rounded-md border border-border/80">
          {/* Pulsing Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface animate-pulse">
              <div className="h-6 w-32 rounded bg-surface-raised mb-4" />
              <div className="h-3 w-48 rounded bg-surface-raised mb-2" />
              <div className="h-3 w-40 rounded bg-surface-raised" />
            </div>
          )}

          {/* Fallback State */}
          {hasError && !isLoading && (
            <div className="flex flex-col items-center justify-center p-6 text-center text-text-tertiary">
              <AlertCircle className="h-6 w-6 text-text-tertiary mb-2" />
              <p className="font-mono text-xs">Preview temporarily unavailable</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="mt-3 text-xs text-accent underline hover:text-accent-hover"
              >
                Retry
              </button>
            </div>
          )}

          {/* Real Live Rendered SVG */}
          {!hasError && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={svgRelativeUrl}
              alt={`Octocat ${selectedCard} card`}
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

        {/* Streamlined Markdown Embed Bar */}
        <div className="mt-4 flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate font-mono text-text-secondary">{markdownEmbed}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-sm bg-accent px-3 py-1 font-mono text-xs font-semibold text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
