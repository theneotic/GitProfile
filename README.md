# Instrument Stats

<div align="center">

```
  ___ _   _ ____ _____ ____  _   _ __  __ _____ _   _ _____   ____ _____  _  _____ ____  
 |_ _| \ | / ___|_   _|  _ \| | | |  \/  | ____| \ | |_   _| / ___|_   _|/ \|_   _/ ___| 
  | ||  \| \___ \ | | | |_) | | | | |\/| |  _| |  \| | | |   \___ \ | | / _ \ | | \___ \ 
  | || |\  |___) || | |  _ <| |_| | |  | | |___| |\  | | |    ___) || |/ ___ \| |  ___) |
 |___|_| \_|____/ |_| |_| \_\\___/|_|  |_|_____|_| \_| |_|   |____/ |_/_/   \_\_| |____/ 
```

**High-precision, embeddable developer telemetry & real-time GitHub profile SVG cards.**  
Built under the **Direct Instruments** brand by Aurelius Valecrest ([@theneotic](https://github.com/theneotic)).

[![License: MIT](https://img.shields.io/badge/License-MIT-3ddc84.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444.svg?style=flat-square)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014+-000000.svg?style=flat-square)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express%204-gray.svg?style=flat-square)](https://expressjs.com/)
[![Vitest](https://img.shields.io/badge/Tests-47%20Passed-brightgreen.svg?style=flat-square)](https://vitest.dev/)

[Explore Documentation](apps/web/src/app/docs/page.tsx) · [Card Studio](https://instrumentstats.dev/dashboard/cards) · [Report Bug](https://github.com/theneotic/instrument-stats/issues)

</div>

---

## ⚡ What is Instrument Stats?

**Instrument Stats** is a next-generation developer telemetry suite that transforms raw GitHub GraphQL & REST metrics into pixel-perfect, accessible, and deeply customizable SVG cards ready to drop directly into your GitHub README or personal portfolio.

Unlike legacy generators with fixed layouts, superficial re-theming, and brittle rate-limiting, Instrument Stats is engineered from the ground up for high reliability and deep control:
- **10 Core Card Types**: Profile, Stats, Languages, Streak, Repository, Rankings, Trophies, Top Contributed, Wrapped, and Activity Graph.
- **Deep Customization**: 3 density variants (`compact`, `cozy`, `detailed`), modular stat toggling & reordering, and custom CSS-in-SVG keyframe animations.
- **14 Canonical Palettes + Auto Mode**: Verified community color schemes (Terminal, Tokyo Night, Catppuccin, Rosé Pine, Dracula, Nord, etc.) plus real `@media (prefers-color-scheme: dark/light)` detection that matches your visitor's GitHub client theme seamlessly.
- **Saved Presets with Persistent Slugs**: Customize your cards once in the visual Card Studio, lock in your configuration, and embed a stable `/cards/by-preset/<slug>.svg` link that never breaks when you adjust your theme later.
- **Pre-emptive Rate-Limit Smoothing**: Reads upstream GitHub rate limit telemetry on every GraphQL call to smooth bursts and prevent secondary 403 quota lockouts.
- **Developer Portfolio Showcase**: Built-in public profile pages (`/u/<username>`) with verified achievement badges and dynamic card stacks.

---

## 🏛 Architecture

The monorepo is organized using **pnpm workspaces** and **Turborepo** into a clean, decoupled architecture:

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        GH["GitHub Profile README\n(/cards/<type>.svg)"]
        Browser["Developer Web Browser\n(Card Studio & Portfolio)"]
    end

    subgraph WebApp ["apps/web (Next.js 14 App Router)"]
        Landing["Marketing Homepage"]
        Studio["Card Studio (Split-Pane Builder)"]
        Themes["14-Palette Showcase"]
        Portfolio["Public Portfolio (/u/:username)"]
        Docs["Interactive Documentation"]
    end

    subgraph API ["apps/api (Express + TypeScript)"]
        Router["HTTP Router & RateLimiter"]
        AuthService["OAuth & Session Service (JWT)"]
        PresetService["Preset CRUD (Keyset Pagination)"]
        
        subgraph Engine ["Card Engine (Zero External Graphic Libs)"]
            ThemeEngine["Theme & ColorScheme Engine"]
            LayoutEngine["Layout & Frame System"]
            Renderers["10 SVG Card Renderers"]
        end

        subgraph GitHubLayer ["GitHub Telemetry Layer"]
            GQLClient["GraphQL Consolidated Client"]
            RateBucket["Upstream Rate Bucket & Backoff"]
        end
    end

    subgraph Storage ["Infrastructure & Persistence"]
        Postgres[("Supabase PostgreSQL\n(Row Level Security)")]
        Redis[("Upstash Redis\n(5-Min Response Cache)")]
        GitHubAPI[("GitHub GraphQL / REST API")]
    end

    GH -->|GET /cards/*.svg| Router
    Browser --> WebApp
    WebApp -->|REST API /api/v1| Router
    Router --> AuthService
    Router --> PresetService
    Router --> Renderers
    Renderers --> ThemeEngine
    Renderers --> LayoutEngine
    Router --> GQLClient
    GQLClient --> RateBucket
    RateBucket --> GitHubAPI
    PresetService --> Postgres
    AuthService --> Postgres
    Router --> Redis
```

---

## 📦 Monorepo Structure

```
instrument-stats/
├── apps/
│   ├── api/                     # Express 4 + TypeScript API service
│   │   ├── src/
│   │   │   ├── cards/           # Zero-dependency hand-rolled SVG Card Engine
│   │   │   │   ├── engine/      # Theme, Layout, Typography, Animate, ColorScheme
│   │   │   │   └── renderers/   # 10 production SVG card renderers
│   │   │   ├── github/          # Rate-limited GraphQL client & statistics aggregation
│   │   │   ├── domain/          # Entities & repository interfaces
│   │   │   ├── application/     # Use cases & session management
│   │   │   └── infrastructure/  # Supabase Postgres, Upstash Redis, HTTP controllers
│   │   └── test/                # Vitest integration & SVG rendering test suites
│   └── web/                     # Next.js 14+ App Router frontend
│       ├── src/
│       │   ├── app/             # Marketing, Card Studio, Themes, Docs, Portfolio
│       │   ├── components/      # UI components (Terminal aesthetic, Grain, Bento grid)
│       │   └── lib/             # API client & session storage
├── supabase/
│   └── migrations/              # SQL schemas, card presets, and RLS policies
├── package.json                 # Monorepo root scripts & dev dependencies
├── turbo.json                   # Turborepo task pipeline configuration
├── pnpm-workspace.yaml          # pnpm workspace definition
├── render.yaml                  # Render API service blueprint
├── railway.json                 # Railway deployment configuration
└── DEPLOYMENT.md                # End-to-end production setup walkthrough
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Git

### 1. Clone & Install
```bash
git clone https://github.com/theneotic/instrument-stats.git
cd instrument-stats
pnpm install
```

### 2. Configure Environment
Copy the example environment files in both applications:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Key environment variables in `apps/api/.env`:
```env
PORT=4000
NODE_ENV=development
GITHUB_TOKEN=ghp_yourPersonalAccessTokenForLocalDevelopment
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=super_secret_jwt_signing_key_at_least_32_characters
CORS_ORIGIN=http://localhost:3000
```

### 3. Run Dev Server
```bash
pnpm dev
```
- API will start on `http://localhost:4000`
- Web app will start on `http://localhost:3000`

### 4. Run Test Suite
```bash
pnpm test
```
Executes all 47 automated tests covering card rendering, density layouts, prefers-color-scheme media query generation, and preset CRUD isolation.

---

## 🎨 10 Card Types & Endpoints

All cards are served with `Content-Type: image/svg+xml; charset=utf-8` and default 5-minute HTTP cache headers.

| Endpoint | Description | Primary Query Knobs |
| :--- | :--- | :--- |
| `/cards/profile.svg` | Identity banner with bio, social counters, and top languages | `density`, `theme`, `show_bio`, `show_languages` |
| `/cards/stats.svg` | Core telemetry: stars, commits, PRs, issues, and grade | `density`, `modules`, `theme`, `show_icons`, `animated` |
| `/cards/languages.svg` | Top languages breakdown with GitHub Linguist color swatches | `density`, `layout` (bar/list), `langs_count`, `hide` |
| `/cards/streak.svg` | 3-column contribution streak triptych with flame indicator | `density`, `theme`, `animated`, `hide_dates` |
| `/cards/repository.svg` | Individual repository pin card with stars, forks, and language | `repo`, `density`, `theme`, `show_owner` |
| `/cards/rankings.svg` | Developer rank index (S to C) with weighted driver breakdown | `density`, `theme`, `show_breakdown` |
| `/cards/trophies.svg` | Tiered achievement badges (Legendary, Gold, Silver, Bronze) | `density`, `theme`, `show_locked`, `filter` |
| `/cards/top-contributed.svg`| Top 5 external repositories contributed to with commit counts | `density`, `theme`, `limit`, `hide_forks` |
| `/cards/wrapped.svg` | 2x3 grid annual GitHub activity recap | `year`, `density`, `theme` |
| `/cards/activity-graph.svg` | 53x7 contribution heatmap with accent opacities | `theme`, `weeks`, `hide_legend` |
| `/cards/by-preset/:slug.svg`| **Saved Preset Endpoint**: Opaque 8-character persistent URL | None required (uses preset config) |

### Sample README Usage

```markdown
<!-- Default Dark Theme -->
![My GitHub Stats](https://api.instrumentstats.dev/cards/stats.svg?username=theneotic&theme=dark)

<!-- Auto Mode: Switches between Light and Dark based on visitor's GitHub appearance -->
![Contribution Streak](https://api.instrumentstats.dev/cards/streak.svg?username=theneotic&theme=auto)

<!-- Compact Density with Tokyo Night Palette -->
![Languages](https://api.instrumentstats.dev/cards/languages.svg?username=theneotic&theme=tokyo-night&density=compact)

<!-- Persistent Saved Preset URL from Card Studio -->
![Custom Card](https://api.instrumentstats.dev/cards/by-preset/k9x2m4p8.svg)
```

---

## 🌈 The 14 Hand-Crafted Palettes

Instrument Stats uses exact, verified hex values from canonical open-source design systems:

1. **terminal** (House signature: `#0a0a0c` dark, `#3ddc84` phosphor green)
2. **dark** (GitHub Dark standard)
3. **light** (GitHub Light clean)
4. **github** (GitHub Green)
5. **dracula** (Dracula Theme specification)
6. **nord** (Arctic Nord palette)
7. **tokyo-night** (Tokyo Night standard)
8. **catppuccin-mocha** (Catppuccin dark mocha)
9. **catppuccin-latte** (Catppuccin soft light)
10. **solarized-dark** (Ethan Schoonover's Solarized Dark)
11. **solarized-light** (Solarized Light)
12. **monokai** (Monokai Pro standard)
13. **rose-pine** (Rosé Pine)
14. **gruvbox** (Gruvbox retro groove)
15. **auto** (Dynamic `@media (prefers-color-scheme)` responsive switcher)

---

## 🛡 Security & Privacy

- **Minimal OAuth Permissions**: Default OAuth requests only `read:user` and public profile data. Private repository statistics are only accessed if explicitly granted.
- **Strict Row-Level Security (RLS)**: User presets and profile configurations are protected at the database engine level via PostgreSQL RLS policies.
- **Zero Raw Secret Exposure**: Upstream tokens and JWT signing keys are strictly isolated in server environments.
- **Safe SVG Generation**: All external labels, repository titles, and commit messages are strictly XML-sanitized before outputting to prevent SVG XSS injection.

---

## 📜 Credits & Acknowledgments

- **github-readme-stats** ([@anuraghazra](https://github.com/anuraghazra/github-readme-stats)): The pioneer that inspired the GitHub stats ecosystem.
- **GitProfileStats** ([@ram-singhh](https://github.com/ram-singhh/GitProfileStats)): The foundational reference project whose concepts, service decomposition, and clean architecture were studied and extended in this from-scratch rebuild.
- **GitHub Linguist**: For maintaining the canonical language color palette dataset.

---

## 📄 License

Instrument Stats is released under the [MIT License](LICENSE).  
Copyright © 2026 Direct Instruments · Aurelius Valecrest.
