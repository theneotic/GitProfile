'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Sliders, Shield, Zap, Layers, Flame, Code2 } from 'lucide-react';
import { CYBER_THEMES } from '@/lib/types';

type CardViewType = 'hud' | 'languages' | 'streak';

export default function StudioPage() {
  const [username, setUsername] = useState('');
  const [cardType, setCardType] = useState<CardViewType>('hud');
  const [theme, setTheme] = useState('cybercore');
  const [customAccent, setCustomAccent] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const displayUser = username.trim() || 'your-github-username';
  const previewUser = username.trim() || 'theneotic';

  const cardQuery = new URLSearchParams();
  cardQuery.set('username', previewUser);
  if (cardType !== 'hud') {
    cardQuery.set('type', cardType);
  }
  cardQuery.set('theme', theme);
  if (customAccent) {
    cardQuery.set('accent', customAccent.replace('#', ''));
  }

  // Markdown target query using the user's actual entered username or placeholder
  const embedQuery = new URLSearchParams();
  embedQuery.set('username', displayUser);
  if (cardType !== 'hud') {
    embedQuery.set('type', cardType);
  }
  embedQuery.set('theme', theme);
  if (customAccent) {
    embedQuery.set('accent', customAccent.replace('#', ''));
  }

  const cardEndpoint = `/api/card?${cardQuery.toString()}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://peaker-git-card.vercel.app';
  const fullEmbedUrl = `${origin}/api/card?${embedQuery.toString()}`;

  const markdownSnippet = `[![${displayUser}'s GitHub Stats](${fullEmbedUrl})](https://github.com/${displayUser})`;
  const htmlSnippet = `<a href="https://github.com/${displayUser}"><img src="${fullEmbedUrl}" alt="${displayUser}'s GitHub Stats" /></a>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] p-4 sm:p-8 flex flex-col items-center justify-start gap-8 cyber-scanlines">
      {/* HUD Header Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 border-b border-[#1f293d] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-white tracking-widest uppercase">
              PEAKER <span className="text-[#00f0ff]">// CYBERCORE STUDIO</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              NEXT-GEN CYBERNETIC GITHUB STAT CARDS FOR ANY DEVELOPER
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            SYS_ONLINE // ANY USER ENABLED
          </span>
        </div>
      </header>

      {/* Main Grid: Card Live Preview & Control Deck */}
      <main className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* CARD TYPE TAB BAR */}
        <div className="flex items-center gap-2 border-b border-[#1f293d] pb-3">
          <button
            onClick={() => setCardType('hud')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono font-bold transition-all ${
              cardType === 'hud'
                ? 'bg-[#00f0ff]/15 border border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border border-transparent text-zinc-400 hover:text-white bg-[#0d111a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            1. CYBERCORE HUD CARD (FLAGSHIP)
          </button>

          <button
            onClick={() => setCardType('languages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono font-bold transition-all ${
              cardType === 'languages'
                ? 'bg-[#00f0ff]/15 border border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border border-transparent text-zinc-400 hover:text-white bg-[#0d111a]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
            2. TOP LANGUAGES CARD
          </button>

          <button
            onClick={() => setCardType('streak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono font-bold transition-all ${
              cardType === 'streak'
                ? 'bg-[#00f0ff]/15 border border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border border-transparent text-zinc-400 hover:text-white bg-[#0d111a]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#ffaa00]" />
            3. ACTIVITY STREAK CARD
          </button>
        </div>

        {/* CARD VIEWPORT CONTAINER */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
              LIVE VECTOR APERTURE // PREVIEW FOR: <span className="text-[#00f0ff]">@{previewUser}</span>
            </span>
            <span className="text-zinc-600">STANDALONE VECTOR SVG</span>
          </div>

          <div className="relative w-full overflow-x-auto rounded-lg border border-[#1f293d] bg-[#030508]/90 p-4 sm:p-8 flex items-center justify-center shadow-2xl shadow-cyan-950/20 min-h-[260px]">
            {/* Real SVG Rendered from Edge Route */}
            <img
              key={cardEndpoint}
              src={cardEndpoint}
              alt="Cybercore Preview"
              className="max-w-full h-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.18)]"
            />
          </div>
        </section>

        {/* TELEMETRY CONTROLS & CODE EXPORT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CONTROL DECK (1 Column) */}
          <div className="md:col-span-1 bg-[#0d111a]/90 border border-[#1f293d] p-5 rounded-md flex flex-col gap-5">
            <h2 className="text-xs font-bold text-zinc-300 font-mono tracking-widest uppercase flex items-center gap-2 border-b border-[#1f293d] pb-2">
              <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" />
              OPERATOR CONFIGURATION
            </h2>

            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-bold">
                Enter Any GitHub Username:
              </label>
              <div className="flex items-center gap-2 bg-[#07090e] border border-[#1f293d] px-3 py-2.5 rounded-sm focus-within:border-[#00f0ff]">
                <span className="text-zinc-500 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  placeholder="e.g. ram-singhh, torvalds, theneotic"
                  className="bg-transparent text-sm text-white focus:outline-none w-full font-mono placeholder:text-zinc-600"
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono leading-tight">
                Type any valid public GitHub handle to fetch stats in real time.
              </span>
            </div>

            {/* Theme Selectors */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Cybercore Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CYBER_THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-sm border text-xs font-mono transition-all ${
                      theme === t.id
                        ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'border-[#1f293d] text-zinc-400 hover:border-zinc-600 bg-[#07090e]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.accentPrimary }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Accent */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Custom Accent Color
              </label>
              <input
                type="text"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                placeholder="e.g. 00f0ff or ff0055"
                className="bg-[#07090e] border border-[#1f293d] px-3 py-2 rounded-sm text-sm text-white focus:outline-none focus:border-[#00f0ff] font-mono"
              />
            </div>
          </div>

          {/* CODE EXPORT DECK (2 Columns) */}
          <div className="md:col-span-2 bg-[#0d111a]/90 border border-[#1f293d] p-5 rounded-md flex flex-col gap-5">
            <h2 className="text-xs font-bold text-zinc-300 font-mono tracking-widest uppercase flex items-center gap-2 border-b border-[#1f293d] pb-2">
              <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
              EMBED INTO YOUR GITHUB PROFILE README
            </h2>

            {/* Markdown Snippet */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Copy & Paste to your README.md
                </span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, 'md')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-sm text-xs text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all cursor-pointer font-mono font-bold"
                >
                  {copied === 'md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'md' ? 'COPIED TO CLIPBOARD' : 'COPY MARKDOWN'}
                </button>
              </div>
              <pre className="bg-[#07090e] border border-[#1f293d] p-3 rounded-sm text-xs text-[#00f0ff] font-mono overflow-x-auto whitespace-pre-wrap break-all">
                {markdownSnippet}
              </pre>
            </div>

            {/* Raw Vector URL */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Raw Dynamic Image URL
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={fullEmbedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#00f0ff]"
                  >
                    <ExternalLink className="w-3 h-3" /> TEST URL
                  </a>
                  <button
                    onClick={() => copyToClipboard(fullEmbedUrl, 'url')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] hover:text-white transition-colors cursor-pointer"
                  >
                    {copied === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'url' ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
              <pre className="bg-[#07090e] border border-[#1f293d] p-3 rounded-sm text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                {fullEmbedUrl}
              </pre>
            </div>

            {/* Instruction Callout */}
            <div className="border border-[#1f293d] bg-[#07090e]/60 p-4 rounded-sm flex flex-col gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold">
                ⚡ HOW EVERYONE CAN USE THIS SERVICE:
              </span>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                1. Enter your GitHub username in the box on the left.<br />
                2. Choose between HUD, Top Languages, or Streak.<br />
                3. Click &quot;Copy Markdown&quot; and paste it into your profile repository&apos;s <code className="text-zinc-200">README.md</code>.<br />
                4. Your stats will automatically update every 30-60 minutes on GitHub.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
