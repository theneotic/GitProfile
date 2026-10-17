'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Star,
  GitCommit,
  GitPullRequest,
  Trophy,
  ArrowRight,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { API_BASE_URL, apiClient } from '../../lib/api';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [presets, setPresets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsRes = await fetch(`${API_BASE_URL}/api/statistics?username=theneotic&mock=true`);
        const statsJson = await statsRes.json();
        setStats(statsJson.data);

        // Fetch presets if logged in
        const presetsRes = await apiClient<{ success: boolean; data: { items: any[] } }>(
          '/api/v1/presets'
        ).catch(() => ({ success: true, data: { items: [] } }));

        setPresets(presetsRes.data?.items || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Console Overview
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Manage your saved card presets, monitor stats velocity, and generate SVG badges.
          </p>
        </div>

        <Link
          href="/dashboard/cards"
          className="flex items-center gap-2 rounded-sm bg-accent px-4 py-2 font-mono text-xs font-bold text-accent-contrast transition-colors hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          <span>New Card Preset</span>
        </Link>
      </div>

      {/* KPI Stat Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs">Calculated Grade</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-accent">
            {stats?.stats?.rank?.grade || 'S'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            Score: {stats?.stats?.rank?.score || 94}/100
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-mono text-xs">Total Stars</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.totalStars?.toLocaleString() || '486'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Across owned repos</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <GitCommit className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs">Total Commits</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.totalCommits?.toLocaleString() || '1,842'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Past 12 months</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <GitPullRequest className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-xs">Pull Requests</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.pullRequests || '88'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Merged & reviewed</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="font-mono text-xs">Active Presets</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {presets.length || '3'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Saved permanent slugs</span>
        </div>
      </div>

      {/* Featured Cards Showcase Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Your Primary Stats Badges
          </h2>
          <Link
            href="/dashboard/cards"
            className="flex items-center gap-1 font-mono text-xs text-accent hover:underline"
          >
            <span>Open in Card Studio</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card Preview 1: Stats */}
          <div className="rounded-lg border border-border bg-[#060608] p-6 flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE_URL}/cards/stats.svg?username=theneotic&mock=true&theme=terminal`}
              alt="Stats card preview"
              className="max-w-full drop-shadow-md"
            />
          </div>

          {/* Card Preview 2: Streak */}
          <div className="rounded-lg border border-border bg-[#060608] p-6 flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE_URL}/cards/streak.svg?username=theneotic&mock=true&theme=terminal`}
              alt="Streak card preview"
              className="max-w-full drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Saved Presets Section */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-base font-semibold text-text-primary">
              Saved Presets
            </h3>
            <p className="text-xs text-text-secondary">
              Permanent slugs linked to your account. Edit options without changing embed URLs.
            </p>
          </div>
          <Link
            href="/dashboard/cards"
            className="rounded-sm border border-border px-3 py-1 font-mono text-xs text-text-secondary hover:text-text-primary"
          >
            Manage All
          </Link>
        </div>

        {presets.length > 0 ? (
          <div className="divide-y divide-border/60">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between py-3 font-mono text-xs"
              >
                <div>
                  <span className="font-bold text-text-primary">{preset.name}</span>
                  <span className="ml-2 text-text-tertiary">({preset.cardType})</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-accent">/cards/by-preset/{preset.slug}.svg</code>
                  <a
                    href={`${API_BASE_URL}/cards/by-preset/${preset.slug}.svg`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded border border-dashed border-border/80 p-8 text-center">
            <p className="text-xs text-text-tertiary">
              No saved presets yet. Customize and save your first permanent card in the Card Studio.
            </p>
            <Link
              href="/dashboard/cards"
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
            >
              <span>Go to Card Studio</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
