import React from 'react';
import { SunMoon, Bookmark, Layers, Award } from 'lucide-react';

const NOVEL_FEATURES = [
  {
    icon: SunMoon,
    tag: '01 // Duality',
    title: 'Auto Dark & Light Mode',
    description:
      'Embedded media queries automatically harmonize between sumi dark and washi light to match each reader’s GitHub preferences.',
  },
  {
    icon: Bookmark,
    tag: '02 // Presets',
    title: 'Stable Preset Slugs',
    description:
      'Sculpt and retheme your cards anytime in the dashboard studio without touching your README markdown once.',
  },
  {
    icon: Layers,
    tag: '03 // Modules',
    title: 'Precision Module Toggling',
    description:
      'Display only the metrics and languages you care about. Hide the noise. Celebrate deliberate visual restraint.',
  },
  {
    icon: Award,
    tag: '04 // Formulas',
    title: 'Transparent Rank Formulas',
    description:
      'Every grade from S+ to C is mathematically derived from open, published formulas with zero opaque ranking tricks.',
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t-2 border-border bg-surface/40 py-24 bg-wabi-grid" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 border-2 border-border bg-surface px-3.5 py-1 shadow-[2px_2px_0px_#0c0b0a] mb-4">
            <span className="h-2 w-2 bg-accent" />
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
              [ 四柱 // Four Pillars ]
            </span>
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Honestly Engineered in Stone.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-text-secondary font-sans leading-relaxed">
            Every technical flaw in legacy README cards resolved with deliberate architecture and permanent persistence.
          </p>
        </div>

        {/* 4-Card Bento Grid with Stepped Pixel Corners & Hard Shadows */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
          {NOVEL_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex flex-col justify-between border-2 border-border bg-surface p-7 sm:p-8 shadow-[5px_5px_0px_#0c0b0a] transition-all hover:border-accent hover:shadow-[6px_6px_0px_#ca8a04] pixel-corners"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-border bg-surface-raised text-accent shadow-[2px_2px_0px_#0c0b0a]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-accent tracking-wider">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-text-primary">
                    {feat.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-secondary font-sans">
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
