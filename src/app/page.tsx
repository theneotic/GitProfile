'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Sliders, Shield, Zap } from 'lucide-react';
import { CYBER_THEMES } from '@/lib/types';

export default function StudioPage() {
  const [username, setUsername] = useState('theneotic');
  const [theme, setTheme] = useState('cybercore');
  const [customAccent, setCustomAccent] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const cardQuery = new URLSearchParams();
  cardQuery.set('username', username);
  cardQuery.set('theme', theme);
  if (customAccent) {
    cardQuery.set('accent', customAccent.replace('#', ''));
  }

  const cardEndpoint = `/api/card?${cardQuery.toString()}`;
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${cardEndpoint}` : cardEndpoint;

  const markdownSnippet = `[![${username}'s Cybercore HUD](${fullUrl})](https://github.com/${username})`;
  const htmlSnippet = `<a href="https://github.com/${username}"><img src="${fullUrl}" alt="${username}'s Cybercore HUD" /></a>`;

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
              PEAKER <span className="text-[#00f0ff]">// CYBERCORE</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              NEXT-GEN HUD TELEMETRY & VECTOR RECON CARD ENGINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            SYS_ONLINE
          </span>
        </div>
      </header>

      {/* Main Grid: Card Live Preview & Control Deck */}
      <main className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* CARD VIEWPORT CONTAINER */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#00f0ff]" />
              LIVE VECTOR APERTURE // REAL-TIME RENDER
            </span>
            <span className="text-zinc-600">850 × 310 SVG</span>
          </div>

          <div className="relative w-full overflow-x-auto rounded-lg border border-[#1f293d] bg-[#030508]/80 p-4 sm:p-8 flex items-center justify-center shadow-2xl shadow-cyan-950/20">
            {/* Real SVG Rendered from Edge Route */}
            <img
              src={cardEndpoint}
              alt="Cybercore HUD Preview"
              className="max-w-full h-auto drop-shadow-[0_0_25px_rgba(0,240,255,0.15)]"
            />
          </div>
        </section>

        {/* TELEMETRY CONTROLS & CODE EXPORT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CONTROL DECK (1 Column) */}
          <div className="md:col-span-1 bg-[#0d111a]/90 border border-[#1f293d] p-5 rounded-md flex flex-col gap-5">
            <h2 className="text-xs font-bold text-zinc-300 font-mono tracking-widest uppercase flex items-center gap-2 border-b border-[#1f293d] pb-2">
              <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" />
              CONTROL TELEMETRY
            </h2>

            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Operator Username
              </label>
              <div className="flex items-center gap-2 bg-[#07090e] border border-[#1f293d] px-3 py-2 rounded-sm focus-within:border-[#00f0ff]">
                <span className="text-zinc-500 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  placeholder="theneotic"
                  className="bg-transparent text-sm text-white focus:outline-none w-full font-mono"
                />
              </div>
            </div>

            {/* Theme Selectors */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Colorway Archetype
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
                Custom Accent Hex
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
              EMBED INTEGRATION
            </h2>

            {/* Markdown Snippet */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  GitHub Profile README (Markdown)
                </span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, 'md')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] hover:text-white transition-colors cursor-pointer"
                >
                  {copied === 'md' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'md' ? 'COPIED' : 'COPY'}
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
                  Raw Vector URL (SVG Stream)
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={cardEndpoint}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-[#00f0ff]"
                  >
                    <ExternalLink className="w-3 h-3" /> OPEN
                  </a>
                  <button
                    onClick={() => copyToClipboard(fullUrl, 'url')}
                    className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] hover:text-white transition-colors cursor-pointer"
                  >
                    {copied === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'url' ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
              <pre className="bg-[#07090e] border border-[#1f293d] p-3 rounded-sm text-xs text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap break-all">
                {fullUrl}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
