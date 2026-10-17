# Contributing to Instrument Stats

Thank you for your interest in contributing to **Instrument Stats**! This project is an open-source developer telemetry and SVG card rendering platform built with TypeScript, Express, and Next.js.

---

## 🛠 Development Workflow

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Git

### Getting Started
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/instrument-stats.git
   cd instrument-stats
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy environment configuration:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
4. Start development mode:
   ```bash
   pnpm dev
   ```

---

## 🧪 Testing & Quality Standards

Before submitting a pull request, ensure all tests, lint checks, and type checks pass:

```bash
# Run unit and integration tests
pnpm test

# Typecheck all packages
pnpm typecheck

# Code formatting check
pnpm format:check
```

---

## 📋 Git Commit Guidelines

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(<scope>): ...` — A new card type, theme, or feature
- `fix(<scope>): ...` — A bug fix or SVG rendering adjustment
- `refactor(<scope>): ...` — Code improvement without feature changes
- `docs(<scope>): ...` — Documentation updates
- `test(<scope>): ...` — Adding or updating test cases
- `chore(<scope>): ...` — Tooling, dependency, or config updates

---

## 📜 Code of Conduct & Integrity

- **Preserve Color & Design Standards**: When contributing themes or language colors, use canonical hex codes from authoritative sources (such as GitHub Linguist or official palette maintainers).
- **Zero Heavy Graphic Dependencies**: The SVG card engine in `apps/api/src/cards/` must remain pure TypeScript string generation. Do not introduce canvas, headless browsers, or binary image rendering libraries.
- **Sanitize User Content**: Any user-supplied data rendered into SVG cards must be strictly XML-escaped via `xmlEscape()` in `helpers.ts`.

---

## 📄 License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
