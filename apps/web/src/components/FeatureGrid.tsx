import React from 'react';
import {
  SunMoon,
  Bookmark,
  Layers,
  Award,
  BarChart3,
  Gauge,
  Sparkles,
  Share2,
} from 'lucide-react';

const FEATURES = [
  {
    icon: SunMoon,
    title: 'True Embedded Auto Dark/Light',
    description:
      'Unlike competitor cards requiring duplicate URLs or markdown picture tricks, Instrument Stats embeds native CSS prefers-color-scheme media queries directly into the SVG file.',
    tag: 'Industry First',
  },
  {
    icon: Bookmark,
    title: 'Saved Presets & Permanent Slugs',
    description:
      'Configure once in the dashboard, save as a persistent preset, and embed a short 8-character URL (/cards/by-preset/abc12345.svg). Tweak styles anytime without touching your README.',
    tag: 'Core Feature',
  },
  {
    icon: Layers,
    title: '3 Layout Densities + Module Toggling',
    description:
      'Choose between Compact (badge/table friendly), Cozy (standard README layout), and Detailed (expanded context lines). Turn off individual metrics you don’t want to display.',
    tag: 'Deep Customization',
  },
  {
    icon: Award,
    title: 'Transparent Documented Rank Score',
    description:
      'No secret algorithms or black-box letter grades. Our rank score (S to C) is mathematically calculated from 6 weighted signals and reports the primary driver behind your score.',
    tag: '100% Transparent',
  },
  {
    icon: BarChart3,
    title: '10 Shipped Card Engines',
    description:
      'Full implementations for Profile, Stats, Languages, Streak, Repository, Rankings, Trophies, Top Contributed, Annual Wrapped, and 53×7 Contribution Heatmaps.',
    tag: 'Zero Unfinished Stubs',
  },
  {
    icon: Gauge,
    title: 'Adaptive Rate-Limit Protection',
    description:
      'The API inspects upstream GitHub GraphQL rateLimit telemetry on every call, pre-emptively smoothing requests when quota is low to avoid unexpected 403 outages.',
    tag: 'High Reliability',
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border bg-surface/50 py-20" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">
            Architectural Differentiation
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Not just reskinned. Honestly engineered.
          </h2>
          <p className="mt-4 text-sm text-text-secondary sm:text-base">
            Every technical gap in legacy GitHub profile cards has been solved with clean,
            maintainable TypeScript, deterministic SVGs, and user-centric persistence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent/50 hover:bg-surface-raised"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-background text-accent group-hover:border-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] text-text-tertiary">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 font-mono text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Learn more</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
