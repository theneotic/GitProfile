'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Star,
  GitCommit,
  GitPullRequest,
  Trophy,
  Lock,
  ArrowRight,
  Plus,
  ExternalLink,
  Search,
  RefreshCw,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const [currentUser, setCurrentUser] = useState('octocat');
  const [inputUser, setInputUser] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authUser = params.get('auth_user');
      if (authUser) {
        setCurrentUser(authUser);
        loadUserStats(authUser);
        return;
      }
    }

    async function initUser() {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (authData.authenticated && authData.user?.username) {
          setCurrentUser(authData.user.username);
          loadUserStats(authData.user.username);
          return;
        }
      } catch {
        // Fallback
      }

      const saved = localStorage.getItem('instrument_preview_username') || 'octocat';
      setCurrentUser(saved);
      loadUserStats(saved);
    }

    initUser();
  }, []);

  async function loadUserStats(username: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/statistics?username=${encodeURIComponent(username)}`);
      const json = await res.json();
      if (json.data) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSwitchUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUser.trim()) return;
    const clean = inputUser.trim().replace(/^@/, '');
    setCurrentUser(clean);
    localStorage.setItem('instrument_preview_username', clean);
    loadUserStats(clean);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Real User Switcher */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Console Overview: <span className="text-accent">@{currentUser}</span>
          </h1>
          <p className="mt-1 text-xs text-text-secondary">
            Live metrics from GitHub REST & GraphQL APIs. Real-time embeddable cards.
          </p>
        </div>

        {/* Live GitHub Username Search/Switcher */}
        <form onSubmit={handleSwitchUser} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              placeholder="Inspect any GitHub user..."
              className="pl-8 pr-3 py-1.5 text-xs font-mono bg-surface border border-border rounded-sm text-text-primary focus:outline-hidden focus:border-accent w-48 sm:w-56"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-accent text-accent-contrast text-xs font-mono font-bold rounded-sm hover:bg-accent-hover transition-colors"
          >
            Load
          </button>
        </form>
      </div>

      {/* KPI Stat Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs">Calculated Grade</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-accent">
            {stats?.stats?.rank?.grade || 'A+'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            Score: {stats?.stats?.rank?.score || 92}/100
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-mono text-xs">Total Stars</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.totalStars?.toLocaleString() || '0'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Across owned repos</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <GitCommit className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs">Total Commits</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.totalCommits?.toLocaleString() || '0'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Estimated / tracked</span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <GitPullRequest className="h-4 w-4 text-purple-400" />
            <span className="font-mono text-xs">Total Repos</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.stats?.totalRepositories ?? stats?.profile?.totalRepos ?? stats?.profile?.publicRepos ?? '0'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            {stats?.stats?.publicRepos ?? stats?.profile?.publicRepos ?? 0} Pub · {stats?.stats?.privateRepos ?? stats?.profile?.privateRepos ?? 0} Pvt
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 border-accent/20 bg-accent/[0.02]">
          <div className="flex items-center justify-between text-text-tertiary">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs text-text-primary">Private Repos</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OAuth
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
            {stats?.stats?.privateRepos ?? stats?.profile?.privateRepos ?? 0}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">
            {stats?.stats?.privateRepos !== undefined
              ? 'OAuth sync active'
              : 'Sign in to sync'}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="font-mono text-xs">Followers</span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {stats?.profile?.followers || '0'}
          </div>
          <span className="font-mono text-[10px] text-text-tertiary">Community reach</span>
        </div>
      </div>

      {/* Featured Cards Showcase Grid with LIVE Real SVGs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Live Cards for @{currentUser}
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
          <div className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/cards/stats.svg?username=${encodeURIComponent(currentUser)}&theme=wabi-sabi`}
              alt="Stats card preview"
              className="max-w-full drop-shadow-md"
            />
          </div>

          {/* Card Preview 2: Streak */}
          <div className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/cards/streak.svg?username=${encodeURIComponent(currentUser)}&theme=wabi-sabi`}
              alt="Streak card preview"
              className="max-w-full drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
