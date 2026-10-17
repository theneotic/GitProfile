import React from 'react';
import { SunMoon, Bookmark, Layers, Award } from 'lucide-react';

const NOVEL_FEATURES = [
  {
    icon: SunMoon,
    title: 'Auto Dark & Light Mode',
    description:
      "Embedded media queries switch between dark and light to match each reader's GitHub appearance.",
  },
  {
    icon: Bookmark,
    title: 'Stable Preset Slugs',
    description:
      'Tweak your theme anytime in the studio without editing your README.',
  },
  {
    icon: Layers,
    title: 'Module Toggling',
    description:
      'Show only the numbers you care about. Hide the rest.',
  },
  {
    icon: Award,
    title: 'Transparent Rank Formula',
    description:
      'Every grade is calculated from published formulas with zero secret algorithms.',
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border bg-surface/30 py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Direct headline without marketing eyebrows */}
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Honestly engineered.
          </h2>
          <p className="mt-3 text-sm text-text-secondary sm:text-base">
            Every technical gap in legacy cards solved with clean code and real persistence.
          </p>
        </div>

        {/* 4-Card Bento Grid with 32px padding and relaxed whitespace */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
          {NOVEL_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex flex-col justify-between rounded-lg border border-border bg-surface p-8 transition-colors hover:border-accent/40"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-background border border-border text-accent">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 font-display text-lg font-semibold text-text-primary">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
