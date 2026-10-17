import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Terminal, BookOpen, Layers, Award, ShieldCheck, Palette, Code2 } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1 font-mono text-xs text-accent">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Developer Reference Manual</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            Instrument Stats Documentation
          </h1>
          <p className="mt-4 text-base text-text-secondary max-w-3xl">
            Complete API reference, card endpoints, exact mathematical scoring formulas,
            theme catalogs, and embedding guides for high-precision SVG cards.
          </p>
        </div>

        {/* Section 1: Quickstart Embedding */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <Code2 className="h-6 w-6 text-accent" />
            <span>1. Quickstart: Adding to your GitHub README</span>
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Every card is served at a stable, permanent public URL. You can drop it directly into
            any Markdown document, GitHub Profile README, or personal website.
          </p>

          <div className="rounded-lg border border-border bg-surface p-4 font-mono text-xs">
            <div className="text-text-tertiary mb-2"># Standard Markdown Embed</div>
            <code className="text-accent block overflow-x-auto p-3 bg-background rounded">
              [![Aurelius&apos;s GitHub Stats](https://instrumentstats.dev/cards/stats.svg?username=theneotic&amp;theme=terminal)](https://instrumentstats.dev)
            </code>
          </div>
        </section>

        {/* Section 2: Transparent Rank Scoring Formula */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <Award className="h-6 w-6 text-accent" />
            <span>2. Transparent Rank Scoring Formula (Section 6.5)</span>
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            Legacy card generators compute letter grades using arbitrary, undocumented black boxes.
            Instrument Stats scores your activity transparently on a standardized 0–100 scale
            composed of 6 weighted signals:
          </p>

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-border bg-surface-raised text-text-secondary">
                <tr>
                  <th className="p-3">Signal</th>
                  <th className="p-3">Scaling Mode</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">100% Saturation Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-primary">
                <tr>
                  <td className="p-3 font-semibold">Commits (Past Year)</td>
                  <td className="p-3 text-text-tertiary">Natural Log Scale</td>
                  <td className="p-3 text-accent font-bold">30% (0.30)</td>
                  <td className="p-3">2,500 commits</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Stars Earned (Owned Repos)</td>
                  <td className="p-3 text-text-tertiary">Natural Log Scale</td>
                  <td className="p-3 text-accent font-bold">25% (0.25)</td>
                  <td className="p-3">1,000 stargazers</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Pull Requests Opened</td>
                  <td className="p-3 text-text-tertiary">Linear Scale</td>
                  <td className="p-3 text-accent font-bold">15% (0.15)</td>
                  <td className="p-3">100 PRs</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Issues Contributed</td>
                  <td className="p-3 text-text-tertiary">Linear Scale</td>
                  <td className="p-3 text-accent font-bold">10% (0.10)</td>
                  <td className="p-3">80 issues</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Community Followers</td>
                  <td className="p-3 text-text-tertiary">Natural Log Scale</td>
                  <td className="p-3 text-accent font-bold">10% (0.10)</td>
                  <td className="p-3">500 followers</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Contributed-to Repos</td>
                  <td className="p-3 text-text-tertiary">Linear Scale</td>
                  <td className="p-3 text-accent font-bold">10% (0.10)</td>
                  <td className="p-3">25 repositories</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-md border border-border bg-surface-raised p-4 font-mono text-xs text-text-secondary">
            <span className="text-text-primary font-bold">Grade Boundaries: </span>
            <span className="text-accent">S (≥ 90)</span> ·{' '}
            <span className="text-text-primary">A+ (≥ 80)</span> · A (≥ 65) · A- (≥ 50) · B+ (≥ 35) · B (≥ 20) · C (&lt; 20)
          </div>
        </section>

        {/* Section 3: Trophy Medals Thresholds */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <Layers className="h-6 w-6 text-accent" />
            <span>3. Trophies & Achievement Tiers (Section 6.1)</span>
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            The <code className="text-accent">/cards/trophies.svg</code> card displays fixed, verifiable badge tiers:
          </p>

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-border bg-surface-raised text-text-secondary">
                <tr>
                  <th className="p-3">Achievement</th>
                  <th className="p-3 text-yellow-400 font-bold">Gold Tier</th>
                  <th className="p-3 text-slate-300 font-bold">Silver Tier</th>
                  <th className="p-3 text-amber-600 font-bold">Bronze Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-primary">
                <tr>
                  <td className="p-3 font-semibold">Commits</td>
                  <td className="p-3">≥ 1,000</td>
                  <td className="p-3">≥ 500</td>
                  <td className="p-3">≥ 100</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Stars Earned</td>
                  <td className="p-3">≥ 300</td>
                  <td className="p-3">≥ 100</td>
                  <td className="p-3">≥ 25</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Pull Requests</td>
                  <td className="p-3">≥ 50</td>
                  <td className="p-3">≥ 20</td>
                  <td className="p-3">≥ 5</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Issues Closed</td>
                  <td className="p-3">≥ 40</td>
                  <td className="p-3">≥ 15</td>
                  <td className="p-3">≥ 5</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Followers</td>
                  <td className="p-3">≥ 200</td>
                  <td className="p-3">≥ 50</td>
                  <td className="p-3">≥ 10</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Public Repos</td>
                  <td className="p-3">≥ 25</td>
                  <td className="p-3">≥ 10</td>
                  <td className="p-3">≥ 3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Query Parameters Quick Reference */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-text-primary">
            <Palette className="h-6 w-6 text-accent" />
            <span>4. Per-Card Query Parameter Reference (Section 27)</span>
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-border bg-surface-raised text-text-secondary">
                <tr>
                  <th className="p-3">Card Type</th>
                  <th className="p-3">Endpoint</th>
                  <th className="p-3">Specific Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-primary">
                <tr>
                  <td className="p-3 font-semibold">profile</td>
                  <td className="p-3 text-accent">/cards/profile.svg</td>
                  <td className="p-3">username (required)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">stats</td>
                  <td className="p-3 text-accent">/cards/stats.svg</td>
                  <td className="p-3">username, modules (comma-list), animated=true</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">languages</td>
                  <td className="p-3 text-accent">/cards/languages.svg</td>
                  <td className="p-3">username, layout=compact|cozy, limit (default 6)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">streak</td>
                  <td className="p-3 text-accent">/cards/streak.svg</td>
                  <td className="p-3">username, animated=true</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">repository</td>
                  <td className="p-3 text-accent">/cards/repository.svg</td>
                  <td className="p-3">owner, repo</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">rankings</td>
                  <td className="p-3 text-accent">/cards/rankings.svg</td>
                  <td className="p-3">username</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">trophies</td>
                  <td className="p-3 text-accent">/cards/trophies.svg</td>
                  <td className="p-3">username</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">topContributed</td>
                  <td className="p-3 text-accent">/cards/top-contributed.svg</td>
                  <td className="p-3">username, limit (max 10)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">wrapped</td>
                  <td className="p-3 text-accent">/cards/wrapped.svg</td>
                  <td className="p-3">username, year (default current)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">activityGraph</td>
                  <td className="p-3 text-accent">/cards/activity-graph.svg</td>
                  <td className="p-3">username, year</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Saved Preset</td>
                  <td className="p-3 text-accent">/cards/by-preset/:slug.svg</td>
                  <td className="p-3">No params required (resolved server-side)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
