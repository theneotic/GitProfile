import React from 'react';
import { Check, X, Minus } from 'lucide-react';

const COMPARISON_ROWS = [
  {
    feature: 'Embedded Auto Dark/Light (prefers-color-scheme)',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Saved Presets with Permanent Slugs (/cards/by-preset/:slug)',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Layout Densities (compact, cozy, detailed)',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Modular Stat Toggling (?modules=stars,commits)',
    instrument: true,
    reference: false,
    legacy: true,
  },
  {
    feature: 'Published Community Themes',
    instrument: '14 Schemes',
    reference: '5 Themes',
    legacy: 'Community forks',
  },
  {
    feature: 'All 10 Card Engines Shipped (No Unfinished Files)',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Annual Wrapped / Year-in-Review Card',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: '53×7 Contribution Heatmap Matching Theme Accent',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Transparent Weighted Grade Formula (S to C)',
    instrument: true,
    reference: false,
    legacy: false,
  },
  {
    feature: 'Upstream Rate-Limit Telemetry Smoothing',
    instrument: true,
    reference: false,
    legacy: false,
  },
];

export function ComparisonTable() {
  return (
    <section className="border-t border-border bg-surface/30 py-20" id="comparison">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">
            Feature Matrix
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            How Instrument Stats Compares
          </h2>
          <p className="mt-4 text-sm text-text-secondary sm:text-base">
            An honest, direct technical breakdown of capabilities versus the reference project and
            legacy card generators.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised font-mono text-xs text-text-secondary">
                <th className="py-4 px-6 font-semibold">Capability</th>
                <th className="py-4 px-6 font-semibold text-accent">
                  Instrument Stats (Our Build)
                </th>
                <th className="py-4 px-6 font-semibold">GitProfileStats (Reference)</th>
                <th className="py-4 px-6 font-semibold">github-readme-stats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature} className="hover:bg-surface-raised/50">
                  <td className="py-4 px-6 font-medium text-text-primary">{row.feature}</td>

                  {/* Instrument Stats */}
                  <td className="py-4 px-6 bg-accent-subtle/30 font-semibold text-accent">
                    {typeof row.instrument === 'boolean' ? (
                      row.instrument ? (
                        <div className="flex items-center gap-1.5 text-accent">
                          <Check className="h-4 w-4" />
                          <span>Yes</span>
                        </div>
                      ) : (
                        <X className="h-4 w-4 text-text-tertiary" />
                      )
                    ) : (
                      <span>{row.instrument}</span>
                    )}
                  </td>

                  {/* Reference */}
                  <td className="py-4 px-6 text-text-secondary">
                    {typeof row.reference === 'boolean' ? (
                      row.reference ? (
                        <Check className="h-4 w-4 text-text-primary" />
                      ) : (
                        <div className="flex items-center gap-1.5 text-text-tertiary">
                          <X className="h-4 w-4" />
                          <span>No</span>
                        </div>
                      )
                    ) : (
                      <span>{row.reference}</span>
                    )}
                  </td>

                  {/* Legacy */}
                  <td className="py-4 px-6 text-text-secondary">
                    {typeof row.legacy === 'boolean' ? (
                      row.legacy ? (
                        <Check className="h-4 w-4 text-text-primary" />
                      ) : (
                        <div className="flex items-center gap-1.5 text-text-tertiary">
                          <X className="h-4 w-4" />
                          <span>No</span>
                        </div>
                      )
                    ) : (
                      <span>{row.legacy}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
