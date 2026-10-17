'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Terminal,
  LayoutDashboard,
  Layers,
  Palette,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { setAccessToken } from '../../lib/api';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/cards', label: 'Card Studio', icon: Layers },
  { href: '/dashboard/themes', label: 'Theme Gallery', icon: Palette },
  { href: '/dashboard/profile', label: 'Portfolio Page', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string>('octocat');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    // 1. Direct URL query param pickup from OAuth redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authUser = params.get('auth_user');
      const authAvatar = params.get('auth_avatar');
      if (authUser) {
        setUsername(authUser);
        if (authAvatar) setUserAvatar(authAvatar);
        setIsAuthenticated(true);
        localStorage.setItem('instrument_preview_username', authUser);
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }
    }

    // 2. Cookie / API session check
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUsername(data.user.username);
          setUserAvatar(data.user.avatar || null);
          setIsAuthenticated(true);
        } else {
          const savedUser = localStorage.getItem('instrument_preview_username');
          if (savedUser) {
            setUsername(savedUser);
          }
        }
      } catch {
        // Fallback
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors
    }
    setAccessToken(null);
    localStorage.removeItem('instrument_preview_username');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r border-border bg-surface md:flex">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface-raised text-accent">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-text-primary">
            Instrument<span className="text-accent">Stats</span>
          </span>
        </div>

        {/* User Card Chip */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3 rounded-md bg-surface-raised p-2.5">
            {userAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={userAvatar}
                alt={username}
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent border border-accent/30">
                {username.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-semibold text-text-primary">
                @{username}
              </span>
              <span className="font-mono text-[10px] text-accent">
                {isAuthenticated ? 'Connected via GitHub' : 'Preview Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 font-mono text-xs transition-colors ${
                  isActive
                    ? 'border border-accent/40 bg-accent-subtle font-semibold text-accent'
                    : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility Actions */}
        <div className="border-t border-border p-4 space-y-2">
          <Link
            href={`/u/${username}`}
            target="_blank"
            className="flex items-center justify-between rounded-sm px-3 py-2 font-mono text-xs text-text-tertiary hover:bg-surface-raised hover:text-text-secondary"
          >
            <span>Public Profile</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 font-mono text-xs text-danger/80 hover:bg-danger/10 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Mobile Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" />
            <span className="font-display font-bold">InstrumentStats</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">@{username}</span>
          </div>
        </header>

        {/* Page Children */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
