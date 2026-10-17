'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette, ExternalLink, ArrowRight, Search, Sparkles } from 'lucide-react';

const THEMES = [
  // 25 Design Archetypes
  { name: 'claymorphism', label: 'Claymorphism 3D', bg: '#11141e', accent: '#f472b6', border: 'rgba(255,255,255,0.12)', font: 'Quicksand', category: 'archetype' },
  { name: 'cybercore', label: 'Cybercore HUD', bg: '#07090e', accent: '#00f0ff', border: 'rgba(0,240,255,0.3)', font: 'Orbitron', category: 'archetype' },
  { name: 'neo-brutalism', label: 'Neo-Brutalism', bg: '#141414', accent: '#ccff00', border: '#ffffff', font: 'Space Grotesk', category: 'archetype' },
  { name: 'scrapbook', label: 'Scrapbook Craft', bg: '#1c1917', accent: '#fb923c', border: '#44403c', font: 'Caveat', category: 'archetype' },
  { name: 'surrealism', label: 'Surrealism Dark', bg: '#0b0914', accent: '#c084fc', border: 'rgba(192,132,252,0.35)', font: 'Cinzel Decorative', category: 'archetype' },
  { name: 'y2k', label: 'Y2K Cyber', bg: '#080b18', accent: '#00f0ff', border: 'rgba(0,240,255,0.4)', font: 'Audiowide', category: 'archetype' },
  { name: 'pixel-art', label: 'Pixel Art 8-Bit', bg: '#0f0d1b', accent: '#e879f9', border: '#a855f7', font: 'Press Start 2P', category: 'archetype' },
  { name: 'synthwave', label: 'Synthwave 80s', bg: '#0d0221', accent: '#ff007f', border: 'rgba(255,0,127,0.4)', font: 'Orbitron', category: 'archetype' },
  { name: 'glassmorphism', label: 'Glassmorphism', bg: '#0a0e17', accent: '#38bdf8', border: 'rgba(255,255,255,0.14)', font: 'Inter', category: 'archetype' },
  { name: 'neumorphism', label: 'Neumorphism Soft', bg: '#1e222d', accent: '#818cf8', border: '#292f3e', font: 'DM Sans', category: 'archetype' },
  { name: 'bento-grid', label: 'Bento Grid', bg: '#0a0a0c', accent: '#2997ff', border: '#27272a', font: 'Plus Jakarta Sans', category: 'archetype' },
  { name: 'editorial', label: 'Editorial Print', bg: '#0c0a09', accent: '#f43f5e', border: '#292524', font: 'Newsreader', category: 'archetype' },
  { name: 'swiss-design', label: 'Swiss Modernist', bg: '#111111', accent: '#ff3b3b', border: '#ffffff', font: 'Inter', category: 'archetype' },
  { name: 'minimalism', label: 'Minimalism Pure', bg: '#000000', accent: '#ffffff', border: '#262626', font: 'Inter', category: 'archetype' },
  { name: 'maximalism', label: 'Maximalism Pop', bg: '#1a051d', accent: '#f43f5e', border: '#e879f9', font: 'Syne', category: 'archetype' },
  { name: 'luxury', label: 'Luxury Champagne', bg: '#0a0908', accent: '#f59e0b', border: '#3b332b', font: 'Bodoni Moda', category: 'archetype' },
  { name: 'conceptual-sketch', label: 'Architect Blueprint', bg: '#0b192c', accent: '#38bdf8', border: 'rgba(56,189,248,0.35)', font: 'Courier Prime', category: 'archetype' },
  { name: 'ethereal', label: 'Ethereal Glow', bg: '#090915', accent: '#a78bfa', border: 'rgba(167,139,250,0.25)', font: 'Cormorant', category: 'archetype' },
  { name: 'bohemian', label: 'Bohemian Folk', bg: '#191410', accent: '#f97316', border: '#44372c', font: 'Playfair Display', category: 'archetype' },
  { name: 'victorian', label: 'Victorian Baroque', bg: '#140d09', accent: '#c2410c', border: '#4a3427', font: 'Cinzel Decorative', category: 'archetype' },
  { name: 'cyberpunk', label: 'Cyberpunk 2077', bg: '#05050a', accent: '#00f0ff', border: 'rgba(0,240,255,0.4)', font: 'Orbitron', category: 'archetype' },
  { name: 'wabi-sabi', label: 'Wabi-Sabi Zen', bg: '#151412', accent: '#ca8a04', border: '#383531', font: 'Shippori Mincho', category: 'archetype' },
  { name: 'modern-dark', label: 'Modern Dark SaaS', bg: '#090d16', accent: '#3b82f6', border: 'rgba(59,130,246,0.3)', font: 'Plus Jakarta Sans', category: 'archetype' },
  { name: 'bauhaus', label: 'Bauhaus Craft', bg: '#141416', accent: '#ef4444', border: '#ffffff', font: 'Space Grotesk', category: 'archetype' },
  { name: 'saas-modern', label: 'SaaS Modern Pulse', bg: '#0b0c10', accent: '#818cf8', border: '#262938', font: 'Plus Jakarta Sans', category: 'archetype' },

  // Developer Themes
  { name: 'terminal', label: 'Terminal Matrix', bg: '#0a0a0c', accent: '#3ddc84', border: '#26262c', font: 'JetBrains Mono', category: 'dev' },
  { name: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff', border: '#30363d', font: 'System Sans', category: 'dev' },
  { name: 'light', label: 'GitHub Light', bg: '#ffffff', accent: '#0969da', border: '#d0d7de', font: 'System Sans', category: 'dev' },
  { name: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b', border: '#44475a', font: 'Courier New', category: 'dev' },
  { name: 'nord', label: 'Nord Ice', bg: '#2e3440', accent: '#88c0d0', border: '#4c566a', font: 'System Sans', category: 'dev' },
  { name: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7', border: '#24283b', font: 'System Sans', category: 'dev' },
  { name: 'catppuccin-mocha', label: 'Catppuccin Mocha', bg: '#1e1e2e', accent: '#f5c2e7', border: '#313244', font: 'System Sans', category: 'dev' },
  { name: 'catppuccin-latte', label: 'Catppuccin Latte', bg: '#eff1f5', accent: '#ea76cb', border: '#ccd0da', font: 'System Sans', category: 'dev' },
  { name: 'solarized-dark', label: 'Solarized Dark', bg: '#002b36', accent: '#268bd2', border: '#073642', font: 'System Sans', category: 'dev' },
  { name: 'solarized-light', label: 'Solarized Light', bg: '#fdf6e3', accent: '#268bd2', border: '#eee8d5', font: 'System Sans', category: 'dev' },
  { name: 'monokai', label: 'Monokai High-Contrast', bg: '#272822', accent: '#a6e22e', border: '#49483e', font: 'JetBrains Mono', category: 'dev' },
  { name: 'rose-pine', label: 'Rosé Pine', bg: '#191724', accent: '#ebbcba', border: '#26233a', font: 'System Sans', category: 'dev' },
  { name: 'gruvbox', label: 'Gruvbox Dark', bg: '#282828', accent: '#fabd2f', border: '#3c3836', font: 'System Sans', category: 'dev' },
  { name: 'github', label: 'GitHub Green', bg: '#0d1117', accent: '#2ea44f', border: '#30363d', font: 'System Sans', category: 'dev' },
];

export default function DashboardThemesPage() {
  const [currentUser, setCurrentUser] = useState('theneotic');
  const [activeTab, setActiveTab] = useState<'all' | 'archetype' | 'dev'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('instrument_preview_username');
      if (saved) setCurrentUser(saved);
    }
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.username) {
          setCurrentUser(data.user.username);
        }
      })
      .catch(() => {});
  }, []);

  const filteredThemes = THEMES.filter((theme) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'archetype' && theme.category === 'archetype') ||
      (activeTab === 'dev' && theme.category === 'dev');
    const matchesQuery =
      !searchQuery.trim() ||
      theme.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Theme Gallery
          </h1>
          <p className="text-xs text-text-secondary">
            Explore all {THEMES.length} palettes (including all 25 design archetypes) rendered live for @{currentUser}. Click any theme to load it directly into Card Studio.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-border text-xs font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'all' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            All ({THEMES.length})
          </button>
          <button
            onClick={() => setActiveTab('archetype')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'archetype' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            25 Archetypes
          </button>
          <button
            onClick={() => setActiveTab('dev')}
            className={`px-3 py-1 rounded transition-colors ${activeTab === 'dev' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Dev Classics
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter themes (e.g. cybercore, glassmorphism, neo-brutalism)..."
          className="w-full rounded border border-border bg-surface py-2 pl-9 pr-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-hidden"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredThemes.map((theme) => {
          const previewUrl = `/cards/stats.svg?username=${encodeURIComponent(currentUser)}&theme=${theme.name}&layout=compact`;
          return (
            <div
              key={theme.name}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 transition-all hover:border-accent/60 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="font-display text-xs font-semibold text-text-primary">
                      {theme.label}
                    </span>
                  </div>
                  <span className="rounded bg-surface-raised px-2 py-0.5 font-mono text-[10px] text-text-tertiary">
                    {theme.font}
                  </span>
                </div>

                {/* SVG Card Thumbnail */}
                <div className="flex items-center justify-center rounded border border-border/50 bg-[#060608] p-3 my-2 min-h-[140px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={previewUrl}
                    src={previewUrl}
                    alt={theme.label}
                    className="max-w-full drop-shadow transition-transform hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <code className="font-mono text-[11px] text-text-tertiary">
                  ?theme={theme.name}
                </code>
                <Link
                  href={`/dashboard/cards?theme=${theme.name}`}
                  className="flex items-center gap-1 font-mono text-xs text-accent hover:underline font-bold"
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
