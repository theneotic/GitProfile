import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Terminal, ExternalLink, ArrowLeft } from 'lucide-react';
import { GitHubIcon } from '../../../components/icons/GitHubIcon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const username = params.username;

  if (!username) {
    notFound();
  }

  // Fetch user stats & optional profile page settings
  let profileData: any = null;
  let statsData: any = null;

  try {
    const statsRes = await fetch(
      `${API_BASE_URL}/api/statistics?username=${encodeURIComponent(username)}&mock=true`,
      { next: { revalidate: 300 } }
    );
    if (statsRes.ok) {
      const json = await statsRes.json();
      statsData = json.data;
      profileData = json.data?.profile;
    }
  } catch {
    // Fallback
  }

  const displayName = profileData?.name || username;
  const bio =
    profileData?.bio || 'Building direct instruments, autonomous systems & high-precision tools.';
  const avatarUrl =
    profileData?.avatarUrl || `https://avatars.githubusercontent.com/${username}`;

  return (
    <div className="min-h-screen bg-background text-text-primary px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs text-text-tertiary hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Instrument Stats</span>
          </Link>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-accent"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            <span>github.com/{username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Profile Header Header Box */}
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-20 w-20 rounded-full border-2 border-border object-cover shadow-md"
            />

            {/* Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  {displayName}
                </h1>
                <span className="rounded bg-accent-subtle px-2 py-0.5 font-mono text-xs font-semibold text-accent border border-accent/30">
                  Engineer
                </span>
              </div>
              <div className="font-mono text-xs text-text-tertiary">@{username}</div>
              <p className="text-sm leading-relaxed text-text-secondary max-w-2xl">{bio}</p>
            </div>
          </div>

          {/* Pinned Links */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border/40 pt-4">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-xs text-text-secondary hover:border-accent hover:text-text-primary"
            >
              <GitHubIcon className="h-3 w-3" />
              <span>GitHub</span>
            </a>
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-xs text-text-secondary hover:border-accent hover:text-text-primary"
            >
              <Terminal className="h-3 w-3" />
              <span>Repositories</span>
            </a>
          </div>
        </div>

        {/* Live SVG Cards Showcase Stack */}
        <div className="space-y-6">
          <div className="border-b border-border pb-2">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              Activity & Metrics Portfolio
            </h2>
          </div>

          {/* 1. Stats Overview */}
          <div className="flex items-center justify-center rounded-lg border border-border bg-[#060608] p-6 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE_URL}/cards/stats.svg?username=${username}&mock=true&theme=terminal&layout=detailed`}
              alt="Stats Card"
              className="max-w-full drop-shadow-xl"
            />
          </div>

          {/* 2. Streak & Languages Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg border border-border bg-[#060608] p-6 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${API_BASE_URL}/cards/streak.svg?username=${username}&mock=true&theme=terminal`}
                alt="Streak Card"
                className="max-w-full drop-shadow-xl"
              />
            </div>
            <div className="flex items-center justify-center rounded-lg border border-border bg-[#060608] p-6 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${API_BASE_URL}/cards/languages.svg?username=${username}&mock=true&theme=terminal&layout=cozy`}
                alt="Languages Card"
                className="max-w-full drop-shadow-xl"
              />
            </div>
          </div>

          {/* 3. 53x7 Activity Heatmap */}
          <div className="flex items-center justify-center rounded-lg border border-border bg-[#060608] p-6 shadow-xl overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE_URL}/cards/activity-graph.svg?username=${username}&mock=true&theme=terminal`}
              alt="Contribution Heatmap"
              className="max-w-full drop-shadow-xl"
            />
          </div>

          {/* 4. Wrapped Annual Summary */}
          <div className="flex items-center justify-center rounded-lg border border-border bg-[#060608] p-6 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${API_BASE_URL}/cards/wrapped.svg?username=${username}&mock=true&theme=terminal`}
              alt="Wrapped Card"
              className="max-w-full drop-shadow-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center font-mono text-xs text-text-tertiary pt-8 border-t border-border">
          Powered by{' '}
          <Link href="/" className="text-accent hover:underline">
            Instrument Stats
          </Link>{' '}
          · High-Precision Developer Tools
        </div>
      </div>
    </div>
  );
}
