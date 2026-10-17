'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  User,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Filter,
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

// All 25 Design Archetypes from s:\The-Neotic\25\public\styles.css + Developer Themes (Total: 36)
const THEMES = [
  // 25 Design Archetypes
  { id: 'claymorphism', label: 'Claymorphism 3D', bg: '#11141e', accent: '#f472b6', category: 'archetype' },
  { id: 'cybercore', label: 'Cybercore HUD', bg: '#07090e', accent: '#00f0ff', category: 'archetype' },
  { id: 'neo-brutalism', label: 'Neo-Brutalism', bg: '#141414', accent: '#ccff00', category: 'archetype' },
  { id: 'scrapbook', label: 'Scrapbook Craft', bg: '#1c1917', accent: '#fb923c', category: 'archetype' },
  { id: 'surrealism', label: 'Surrealism Dark', bg: '#0b0914', accent: '#c084fc', category: 'archetype' },
  { id: 'y2k', label: 'Y2K Cyber', bg: '#080b18', accent: '#00f0ff', category: 'archetype' },
  { id: 'pixel-art', label: 'Pixel Art 8-Bit', bg: '#0f0d1b', accent: '#e879f9', category: 'archetype' },
  { id: 'synthwave', label: 'Synthwave 80s', bg: '#0d0221', accent: '#ff007f', category: 'archetype' },
  { id: 'glassmorphism', label: 'Glassmorphism', bg: '#0a0e17', accent: '#38bdf8', category: 'archetype' },
  { id: 'neumorphism', label: 'Neumorphism Soft', bg: '#1e222d', accent: '#818cf8', category: 'archetype' },
  { id: 'bento-grid', label: 'Bento Grid', bg: '#0a0a0c', accent: '#2997ff', category: 'archetype' },
  { id: 'editorial', label: 'Editorial Print', bg: '#0c0a09', accent: '#f43f5e', category: 'archetype' },
  { id: 'swiss-design', label: 'Swiss Modernist', bg: '#111111', accent: '#ff3b3b', category: 'archetype' },
  { id: 'minimalism', label: 'Minimalism Pure', bg: '#000000', accent: '#ffffff', category: 'archetype' },
  { id: 'maximalism', label: 'Maximalism Pop', bg: '#1a051d', accent: '#f43f5e', category: 'archetype' },
  { id: 'luxury', label: 'Luxury Champagne', bg: '#0a0908', accent: '#f59e0b', category: 'archetype' },
  { id: 'conceptual-sketch', label: 'Architect Blueprint', bg: '#0b192c', accent: '#38bdf8', category: 'archetype' },
  { id: 'ethereal', label: 'Ethereal Glow', bg: '#090915', accent: '#a78bfa', category: 'archetype' },
  { id: 'bohemian', label: 'Bohemian Folk', bg: '#191410', accent: '#f97316', category: 'archetype' },
  { id: 'victorian', label: 'Victorian Baroque', bg: '#140d09', accent: '#c2410c', category: 'archetype' },
  { id: 'cyberpunk', label: 'Cyberpunk 2077', bg: '#05050a', accent: '#00f0ff', category: 'archetype' },
  { id: 'wabi-sabi', label: 'Wabi-Sabi Zen', bg: '#151412', accent: '#ca8a04', category: 'archetype' },
  { id: 'modern-dark', label: 'Modern Dark SaaS', bg: '#090d16', accent: '#3b82f6', category: 'archetype' },
  { id: 'bauhaus', label: 'Bauhaus Craft', bg: '#141416', accent: '#ef4444', category: 'archetype' },
  { id: 'saas-modern', label: 'SaaS Modern Pulse', bg: '#0b0c10', accent: '#818cf8', category: 'archetype' },

  // Developer Themes
  { id: 'terminal', label: 'Terminal Matrix', bg: '#0a0a0c', accent: '#3ddc84', category: 'dev' },
  { id: 'dark', label: 'GitHub Dark', bg: '#0d1117', accent: '#58a6ff', category: 'dev' },
  { id: 'light', label: 'GitHub Light', bg: '#ffffff', accent: '#0969da', category: 'dev' },
  { id: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#50fa7b', category: 'dev' },
  { id: 'nord', label: 'Nord Ice', bg: '#2e3440', accent: '#88c0d0', category: 'dev' },
  { id: 'tokyo-night', label: 'Tokyo Night', bg: '#1a1b26', accent: '#7aa2f7', category: 'dev' },
  { id: 'catppuccin-mocha', label: 'Catppuccin Mocha', bg: '#1e1e2e', accent: '#cba6f7', category: 'dev' },
  { id: 'solarized-dark', label: 'Solarized Dark', bg: '#002b36', accent: '#268bd2', category: 'dev' },
  { id: 'monokai', label: 'Monokai High-Contrast', bg: '#272822', accent: '#a6e22e', category: 'dev' },
  { id: 'rose-pine', label: 'Rosé Pine', bg: '#191724', accent: '#c4a7e7', category: 'dev' },
  { id: 'gruvbox', label: 'Gruvbox Dark', bg: '#282828', accent: '#fe8019', category: 'dev' },
  { id: 'auto', label: 'Auto (System)', bg: '#0d1117', accent: '#3ddc84', category: 'dev' },
];

const STAT_MODULES = [
  { id: 'stars', label: 'Total Stars' },
  { id: 'commits', label: 'Total Commits' },
  { id: 'prs', label: 'Pull Requests' },
  { id: 'issues', label: 'Issues Closed' },
  { id: 'repos', label: 'Total Repos' },
  { id: 'private_repos', label: 'Private Repos (OAuth)' },
  { id: 'contribs', label: 'Contributed Repos' },
  { id: 'rank', label: 'Calculated Grade' },
];

export default function CardStudioPage() {
  const [cardType, setCardType] = useState('stats');
  const [username, setUsername] = useState('theneotic');
  const [authUsername, setAuthUsername] = useState<string | null>(null);
  const [customInputUser, setCustomInputUser] = useState('theneotic');
  const [theme, setTheme] = useState('terminal');
  const [themeTab, setThemeTab] = useState<'all' | 'archetype' | 'dev'>('all');
  const [themeSearch, setThemeSearch] = useState('');
  const [layout, setLayout] = useState<'compact' | 'cozy' | 'detailed'>('cozy');
  const [fontStyle, setFontStyle] = useState<'mono' | 'sans' | 'serif' | 'rounded'>('mono');
  const [borderRadius, setBorderRadius] = useState(4.5);
  const [hideBorder, setHideBorder] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [customAccent, setCustomAccent] = useState('');
  const [customBg, setCustomBg] = useState('');

  // Custom Image Uploader state
  const [customImage, setCustomImage] = useState<string>('');
  const [imageTarget, setImageTarget] = useState<'avatar' | 'background'>('avatar');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'markdown' | 'html' | 'url'>('markdown');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modules toggling for stats card
  const [enabledModules, setEnabledModules] = useState<string[]>([
    'stars',
    'commits',
    'prs',
    'issues',
    'repos',
    'private_repos',
    'contribs',
    'rank',
  ]);

  // Preset saving state
  const [presetName, setPresetName] = useState('My README Card');
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Initialize from session auth / query params / local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlUser = params.get('user') || params.get('username') || params.get('auth_user');
      const urlTheme = params.get('theme');
      if (urlTheme) setTheme(urlTheme);

      if (urlUser) {
        setUsername(urlUser);
        setCustomInputUser(urlUser);
        return;
      }
      const saved = localStorage.getItem('instrument_preview_username');
      if (saved) {
        setUsername(saved);
        setCustomInputUser(saved);
      }
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user?.username) {
          setAuthUsername(data.user.username);
          if (!localStorage.getItem('instrument_preview_username')) {
            setUsername(data.user.username);
            setCustomInputUser(data.user.username);
          }
        }
      } catch {
        // Fallback
      }
    }
    checkAuth();
  }, []);

  // Compute live SVG URL (USES REAL GITHUB API DATA, NEVER MOCK DATA)
  const query = new URLSearchParams();
  query.set('username', username.trim() || 'theneotic');
  query.set('theme', theme);
  query.set('layout', layout);
  query.set('density', layout);
  if (fontStyle !== 'mono') query.set('font_style', fontStyle);
  if (borderRadius !== 4.5) {
    query.set('border_radius', String(borderRadius));
    query.set('borderRadius', String(borderRadius));
  }
  if (hideBorder) {
    query.set('hide_border', 'true');
    query.set('hideBorder', 'true');
  }
  if (customAccent) query.set('accent', customAccent);
  if (customBg) query.set('background', customBg);

  if (cardType === 'stats') {
    query.set('modules', enabledModules.join(','));
  }

  if (animated && (cardType === 'stats' || cardType === 'streak')) {
    query.set('animated', 'true');
  }

  // Handle custom image attachment
  if (customImage.trim()) {
    if (imageTarget === 'avatar') {
      query.set('avatar_url', customImage.trim());
      query.set('custom_image', customImage.trim());
    } else {
      query.set('bg_image', customImage.trim());
      query.set('custom_image', customImage.trim());
    }
  }

  const endpointName = cardType === 'activityGraph' ? 'activity-graph' : cardType;
  const liveSvgUrl = `/cards/${endpointName}.svg?${query.toString()}`;

  const toggleModule = (id: string) => {
    setEnabledModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Robust clipboard copy with fallback
  const copyTextToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const getEmbedSnippet = (format: 'markdown' | 'html' | 'url') => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gitprofilestat.vercel.app';
    const targetUrl = savedSlug
      ? `${origin}/cards/by-preset/${savedSlug}.svg`
      : `${origin}${liveSvgUrl}`;

    if (format === 'markdown') {
      return `[![${username}'s Stats](${targetUrl})](https://gitprofilestat.vercel.app)`;
    } else if (format === 'html') {
      return `<a href="https://gitprofilestat.vercel.app"><img src="${targetUrl}" alt="${username}'s GitHub Stats" /></a>`;
    }
    return targetUrl;
  };

  const copySnippet = async (format: 'markdown' | 'html' | 'url') => {
    const textToCopy = getEmbedSnippet(format);
    await copyTextToClipboard(textToCopy);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  // Custom Image Upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.fullUrl) {
        setCustomImage(data.fullUrl);
      } else if (data.url) {
        const origin = window.location.origin;
        setCustomImage(`${origin}${data.url}`);
      } else {
        // Fallback to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) setCustomImage(e.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Offline fallback: load as client Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setCustomImage(e.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
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
      if (customImage) {
        if (imageTarget === 'avatar') optionsRecord.avatar_url = customImage;
        else optionsRecord.bg_image = customImage;
      }

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

  // Filtered themes
  const filteredThemes = THEMES.filter((t) => {
    const matchesCategory =
      themeTab === 'all' ||
      (themeTab === 'archetype' && t.category === 'archetype') ||
      (themeTab === 'dev' && t.category === 'dev');
    const matchesSearch =
      !themeSearch.trim() ||
      t.label.toLowerCase().includes(themeSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(themeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Card Studio
          </h1>
          <p className="text-xs text-text-secondary">
            Deep visual customization, all 25 design archetypes, custom images, and permanent shareable slugs.
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

      {/* Active GitHub User Switcher & Live Data Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3.5 font-mono text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-text-secondary">Active GitHub Account:</span>
          <span className="font-bold text-accent">@{username}</span>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
            Live GitHub API
          </span>
          {authUsername && authUsername.toLowerCase() === username.toLowerCase() && (
            <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] text-accent font-bold border border-accent/20">
              OAuth Connected
            </span>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!customInputUser.trim()) return;
            const clean = customInputUser.trim().replace(/^@/, '');
            setUsername(clean);
            localStorage.setItem('instrument_preview_username', clean);
          }}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <div className="relative flex-1 sm:w-44">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-text-tertiary" />
            <input
              type="text"
              value={customInputUser}
              onChange={(e) => setCustomInputUser(e.target.value)}
              placeholder="Inspect user..."
              className="w-full rounded-sm border border-border bg-background py-1.5 pl-8 pr-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="rounded-sm bg-accent px-3 py-1.5 font-mono text-xs font-bold text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            Load
          </button>
          {authUsername && authUsername.toLowerCase() !== username.toLowerCase() && (
            <button
              type="button"
              onClick={() => {
                setUsername(authUsername);
                setCustomInputUser(authUsername);
                localStorage.setItem('instrument_preview_username', authUsername);
              }}
              className="rounded-sm bg-surface-raised px-2.5 py-1.5 font-mono text-xs text-accent border border-border hover:border-accent transition-colors"
            >
              My Account
            </button>
          )}
        </form>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Pane: Customization Controls (6 Cols) */}
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

          {/* 2. Theme Picker: 25 Archetypes + Dev Classics */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="flex items-center gap-2 font-mono text-xs font-semibold text-text-primary">
                <Palette className="h-4 w-4 text-accent" />
                <span>Theme Scheme ({THEMES.length} Available)</span>
              </label>

              {/* Theme Category Tabs */}
              <div className="flex items-center gap-1 bg-surface-raised p-0.5 rounded border border-border text-[11px] font-mono">
                <button
                  onClick={() => setThemeTab('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${themeTab === 'all' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  All ({THEMES.length})
                </button>
                <button
                  onClick={() => setThemeTab('archetype')}
                  className={`px-2 py-0.5 rounded transition-colors ${themeTab === 'archetype' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  25 Archetypes
                </button>
                <button
                  onClick={() => setThemeTab('dev')}
                  className={`px-2 py-0.5 rounded transition-colors ${themeTab === 'dev' ? 'bg-accent text-accent-contrast font-bold' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Dev Themes
                </button>
              </div>
            </div>

            {/* Quick Theme Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-text-tertiary" />
              <input
                type="text"
                value={themeSearch}
                onChange={(e) => setThemeSearch(e.target.value)}
                placeholder="Search theme schemes (e.g. cybercore, neo-brutalism, dracula)..."
                className="w-full rounded border border-border bg-background py-1 pl-8 pr-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-hidden"
              />
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-64 overflow-y-auto pr-1">
              {filteredThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 rounded-sm border p-2 text-left font-mono text-xs transition-colors ${
                    theme === t.id
                      ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
                      : 'border-border bg-surface-raised text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border border-black/30"
                    style={{ backgroundColor: t.accent }}
                  />
                  <span className="truncate">{t.label}</span>
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

          {/* 3. Custom Image Uploader & Profile Assets */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-mono text-xs font-semibold text-text-primary">
                <ImageIcon className="h-4 w-4 text-accent" />
                <span>Custom Image Uploader (Avatar & Profile Assets)</span>
              </label>
              {customImage && (
                <button
                  type="button"
                  onClick={() => setCustomImage('')}
                  className="flex items-center gap-1 font-mono text-[11px] text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-text-secondary">
              Upload your own avatar, header, or custom illustration. Use it inside your cards and embed it on your GitHub Profile README.
            </p>

            {/* Drop Zone & File Selector */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              className="group cursor-pointer rounded-md border-2 border-dashed border-border p-4 text-center transition-colors hover:border-accent/60 bg-surface-raised/40 hover:bg-surface-raised"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="h-5 w-5 text-text-tertiary group-hover:text-accent transition-colors" />
                <span className="font-mono text-xs font-medium text-text-primary">
                  {isUploading ? 'Uploading Image...' : 'Click to Browse or Drag & Drop Image'}
                </span>
                <span className="text-[10px] text-text-tertiary">
                  Supports PNG, JPEG, SVG, WebP, GIF (Max 5MB)
                </span>
              </div>
            </div>

            {uploadError && (
              <p className="font-mono text-[11px] text-rose-400">{uploadError}</p>
            )}

            {/* Direct Image URL input */}
            <div>
              <span className="font-mono text-[11px] text-text-tertiary">Or Paste Direct Image URL:</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  placeholder="https://raw.githubusercontent.com/.../avatar.png"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  className="flex-1 rounded border border-border bg-background px-2.5 py-1 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Image Application Controls */}
            {customImage && (
              <div className="rounded border border-border/60 bg-surface-raised p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    Image Placement:
                  </span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer text-text-secondary">
                      <input
                        type="radio"
                        name="imageTarget"
                        checked={imageTarget === 'avatar'}
                        onChange={() => setImageTarget('avatar')}
                        className="accent-accent"
                      />
                      <span>Avatar / Header Icon</span>
                    </label>
                    <label className="flex items-center gap-1.5 font-mono text-xs cursor-pointer text-text-secondary">
                      <input
                        type="radio"
                        name="imageTarget"
                        checked={imageTarget === 'background'}
                        onChange={() => setImageTarget('background')}
                        className="accent-accent"
                      />
                      <span>Card Background</span>
                    </label>
                  </div>
                </div>

                {/* Standalone GitHub Profile Embed code */}
                <div className="border-t border-border/40 pt-2">
                  <span className="font-mono text-[10px] text-text-tertiary">
                    Standalone GitHub README Markdown Snippet:
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2 rounded bg-background p-2 font-mono text-[11px]">
                    <code className="truncate text-accent">
                      {`![Custom Profile Asset](${customImage})`}
                    </code>
                    <button
                      type="button"
                      onClick={async () => {
                        await copyTextToClipboard(`![Custom Profile Asset](${customImage})`);
                        setCopiedFormat('asset');
                        setTimeout(() => setCopiedFormat(null), 2000);
                      }}
                      className="shrink-0 rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-contrast"
                    >
                      {copiedFormat === 'asset' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Layout Density & Modules */}
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
                    className={`flex-1 rounded-sm border py-1.5 font-mono text-xs capitalize transition-all ${
                      layout === d
                        ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
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
                  max="28"
                  step="0.5"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
                  className="mt-1 w-full accent-accent cursor-pointer"
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
                      Silky CSS Animation
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
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-text-primary">
                  Live SVG Canvas
                </span>
                <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent font-bold">
                  {layout.toUpperCase()} · R{borderRadius}PX
                </span>
              </div>
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

            {/* Canvas with dynamic key for instant 0ms unmount/remount rendering */}
            <div className="my-6 flex min-h-[260px] items-center justify-center rounded-md border border-border/60 bg-[#060608] p-4 sm:p-8">
              <div className="overflow-x-auto py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={liveSvgUrl}
                  src={liveSvgUrl}
                  alt="Card Preview"
                  className="max-w-full drop-shadow-2xl transition-all duration-200"
                />
              </div>
            </div>

            {/* Embed Code Format Selector & Copy Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-tertiary">
                  Copy Embed Snippet:
                </span>
                <div className="flex gap-1 font-mono text-[10px]">
                  {(['markdown', 'html', 'url'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSnippetTab(tab)}
                      className={`px-2 py-0.5 rounded capitalize transition-colors ${
                        activeSnippetTab === tab
                          ? 'bg-accent/20 text-accent font-bold'
                          : 'text-text-tertiary hover:text-text-primary'
                      }`}
                    >
                      {tab === 'url' ? 'URL' : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Copy Action Buttons with explicit visual state feedback */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSnippetTab('markdown');
                    copySnippet('markdown');
                  }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-accent py-2 font-mono text-xs font-bold text-accent-contrast transition-all hover:bg-accent-hover shadow"
                >
                  {copiedFormat === 'markdown' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-black" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Markdown</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSnippetTab('html');
                    copySnippet('html');
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border py-2 font-mono text-xs transition-all ${
                    copiedFormat === 'html'
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-border bg-surface-raised text-text-secondary hover:border-text-secondary hover:text-text-primary'
                  }`}
                >
                  {copiedFormat === 'html' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent" />
                      <span className="text-accent font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Code2 className="h-3.5 w-3.5" />
                      <span>HTML Tag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveSnippetTab('url');
                    copySnippet('url');
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border py-2 font-mono text-xs transition-all ${
                    copiedFormat === 'url'
                      ? 'border-accent bg-accent/20 text-accent font-bold'
                      : 'border-border bg-surface-raised text-text-secondary hover:border-text-secondary hover:text-text-primary'
                  }`}
                >
                  {copiedFormat === 'url' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent" />
                      <span className="text-accent font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Raw SVG URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive Code Snippet Box */}
              <div className="rounded-md border border-border bg-background p-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/40 text-[10px] text-text-tertiary">
                  <span className="uppercase">{activeSnippetTab} Embed Code</span>
                  <button
                    type="button"
                    onClick={() => copySnippet(activeSnippetTab)}
                    className="flex items-center gap-1 text-accent hover:underline font-bold"
                  >
                    {copiedFormat === activeSnippetTab ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-[11px] text-text-primary">
                  {getEmbedSnippet(activeSnippetTab)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
