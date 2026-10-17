# Production Deployment Guide — Instrument Stats

This guide provides a complete, step-by-step walkthrough for deploying **Instrument Stats** to production using free-tier friendly infrastructure:
- **API (`apps/api`)**: [Render](https://render.com) (or [Railway](https://railway.app))
- **Web App (`apps/web`)**: [Vercel](https://vercel.com)
- **Database**: [Supabase](https://supabase.com) (Managed PostgreSQL + Row Level Security)
- **Cache**: [Upstash](https://upstash.com) (Serverless Redis REST API)
- **Identity Provider**: [GitHub Developer Settings](https://github.com/settings/developers) (OAuth Application)

---

## 📋 Table of Contents
1. [GitHub OAuth Application Setup](#1-github-oauth-application-setup)
2. [Supabase Database Setup](#2-supabase-database-setup)
3. [Upstash Redis Cache Setup](#3-upstash-redis-cache-setup)
4. [Deploying the API to Render](#4-deploying-the-api-to-render)
5. [Deploying the Web App to Vercel](#5-deploying-the-web-app-to-vercel)
6. [Post-Deployment Verification](#6-post-deployment-verification)
7. [Alternative: Railway Deployment](#7-alternative-railway-deployment)

---

## 1. GitHub OAuth Application Setup

Your users log in to the dashboard via GitHub OAuth. You must register an OAuth application on GitHub.

1. Navigate to **GitHub Settings** > **Developer Settings** > **OAuth Apps** (`https://github.com/settings/developers`).
2. Click **New OAuth App**.
3. Fill in the application details:
   - **Application name**: `Instrument Stats`
   - **Homepage URL**: `https://instrumentstats.dev` (or your Vercel deployment URL, e.g. `https://instrument-stats-web.vercel.app`)
   - **Application description**: `High-precision developer telemetry and embeddable SVG stats cards.`
   - **Authorization callback URL**:
     ```
     https://api.instrumentstats.dev/auth/github/callback
     ```
     *(Or your Render service URL: `https://instrument-stats-api.onrender.com/auth/github/callback`)*
4. Click **Register application**.
5. Save the **Client ID**.
6. Under **Client secrets**, click **Generate a new client secret** and copy the secret immediately. Keep this secure!

> [!IMPORTANT]
> The Callback URL on GitHub must match the actual domain where your API is hosted, followed by `/auth/github/callback`. A mismatch here is the single most common OAuth setup error.

---

## 2. Supabase Database Setup

Supabase provides the managed PostgreSQL database that stores user profile records, card presets, and portfolio preferences with native Row Level Security (RLS).

1. Log in to [Supabase](https://supabase.com) and click **New project**.
2. Select your organization, choose a project name (e.g. `instrument-stats`), set a secure database password, and pick a region close to your API host.
3. Once the database is provisioned, go to **Project Settings** > **Database** and copy the **Connection string (URI)** (starts with `postgresql://postgres:...`).
4. Go to **Project Settings** > **API** and copy:
   - **Project URL**
   - **`anon` public key**
   - **`service_role` secret key**

### Apply Database Migrations
You can apply the migrations using either the Supabase CLI or directly in the Supabase SQL Editor:

#### Option A: Supabase CLI (Recommended)
```bash
# Log in to Supabase CLI
npx supabase login

# Link your local project
npx supabase link --project-ref <your-supabase-project-id>

# Push all migrations
npx supabase db push
```

#### Option B: SQL Editor in Browser
Open the Supabase Dashboard, go to **SQL Editor**, and execute the migration files in order:
1. `supabase/migrations/0001_init.sql` (Creates users table and indexes)
2. `supabase/migrations/0002_card_presets.sql` (Creates card presets table and unique slug constraints)
3. `supabase/migrations/0003_profile_pages.sql` (Creates profile pages configuration table)
4. `supabase/migrations/0004_rls_policies.sql` (Applies PostgreSQL Row-Level Security rules)

---

## 3. Upstash Redis Cache Setup

Upstash provides a zero-maintenance, serverless Redis instance with an HTTP REST API. This caches generated SVG card responses for 5 minutes, ensuring instant load times and protecting your GitHub rate limit.

1. Sign up or log in to [Upstash](https://upstash.com).
2. Click **Create Database**.
3. Name: `instrument-stats-cache`, choose your preferred cloud and region.
4. Once created, scroll down to the **REST API** section.
5. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## 4. Deploying the API to Render

The API is an Express application located in `apps/api`. We use the included blueprint `render.yaml`.

1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your GitHub repository (`theneotic/instrument-stats`).
5. Render will detect `render.yaml`.
6. Configure the required environment variables under the service settings:

| Environment Variable | Description / Value |
| :--- | :--- |
| `PORT` | `4000` (Render will override or set internally) |
| `NODE_ENV` | `production` |
| `GITHUB_CLIENT_ID` | From step 1 |
| `GITHUB_CLIENT_SECRET` | From step 1 |
| `GITHUB_TOKEN` | Personal Access Token (for anonymous public queries) |
| `JWT_SECRET` | 32+ random characters (e.g. `openssl rand -hex 32`) |
| `CORS_ORIGIN` | `https://your-web-app.vercel.app` |
| `FRONTEND_URL` | `https://your-web-app.vercel.app` |
| `DATABASE_URL` | Supabase Postgres URI from step 2 |
| `SUPABASE_URL` | Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` secret |
| `UPSTASH_REDIS_REST_URL` | Upstash URL from step 3 |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Token from step 3 |

7. Click **Apply**. Render will run:
   - Build: `pnpm --filter api build`
   - Start: `pnpm --filter api start`
   - Health check: `/health`

---

## 5. Deploying the Web App to Vercel

The web application is a Next.js 14+ App Router project located in `apps/web`.

1. Go to [Vercel Dashboard](https://vercel.com) and click **Add New...** > **Project**.
2. Import your GitHub repository (`theneotic/instrument-stats`).
3. In the project configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm turbo build --filter=@instrument-stats/web`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
4. Add the Environment Variables:

| Variable | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your live Render API URL (e.g. `https://instrument-stats-api.onrender.com`) |
| `NEXT_PUBLIC_APP_URL` | Your live Vercel URL (e.g. `https://instrument-stats-web.vercel.app`) |

5. Click **Deploy**. Vercel will build and deploy the application.

---

## 6. Post-Deployment Verification

Once both services are deployed, perform the following verification steps:

1. **Health Check**:
   Visit `https://<your-api-url>/health`. You should receive:
   ```json
   { "status": "ok", "timestamp": "...", "service": "@instrument-stats/api" }
   ```

2. **SVG Card Generation**:
   Visit `https://<your-api-url>/cards/stats.svg?username=theneotic&theme=terminal`.
   Verify that a crisp, high-precision SVG card renders directly in your browser.

3. **Auto Theme Detection**:
   Visit `https://<your-api-url>/cards/streak.svg?username=theneotic&theme=auto`.
   Inspect the SVG source and verify that `@media (prefers-color-scheme: light)` is present in the embedded `<style>` block.

4. **OAuth Login Flow**:
   - Open your Vercel web app.
   - Click **Connect with GitHub**.
   - Authorize the OAuth application.
   - Verify you are redirected back to `/dashboard` with your GitHub avatar and stats loaded.

5. **Create and Test a Saved Preset**:
   - Go to **Card Studio** (`/dashboard/cards`).
   - Select a card type, density, and theme.
   - Click **Save as Preset**.
   - Copy the generated Markdown embed (`/cards/by-preset/<slug>.svg`).
   - Open an incognito browser window and navigate directly to that SVG URL. Verify the card renders without authentication!

---

## 7. Alternative: Railway Deployment

If you prefer deploying the API on Railway instead of Render:

1. Connect your repo in Railway.
2. Railway uses the bundled `railway.json`:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "pnpm install && pnpm --filter api build"
     },
     "deploy": {
       "startCommand": "pnpm --filter api start",
       "healthcheckPath": "/health"
     }
   }
   ```
3. Set the environment variables identically to Step 4.
