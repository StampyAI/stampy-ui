# AGENTS.md - AI Assistant Guide for stampy-ui

This document helps AI assistants (Claude, Gemini, GPT, etc.) quickly understand the stampy-ui codebase.

## Project Overview

**stampy-ui** is the frontend for [aisafety.info](https://aisafety.info) — a Q&A site about AI safety. It's built with **Remix** and deployed on **Cloudflare Workers**.

- **GitHub**: https://github.com/StampyAI/stampy-ui
- **Discord**: https://discord.com/invite/7wjJbFJnSN (dev channel: #stampy-dev)
- **License**: MIT

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Remix](https://remix.run/) v2.17 |
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com/) |
| Language | TypeScript |
| Styling | Vanilla CSS (no Tailwind) |
| Data Source | [Coda.io](https://coda.io/) API |
| Caching | Cloudflare KV |
| Error Tracking | Sentry |
| Analytics | Matomo |
| UI Dev | Storybook |
| Testing | Jest with miniflare |

## Project Structure

```
stampy-ui/
├── app/                      # Main application code
│   ├── components/           # React components
│   │   └── icons-generated/  # Auto-generated from SVGs (don't edit manually)
│   ├── routes/               # Remix file-based routing
│   ├── hooks/                # Custom React hooks
│   ├── server-utils/         # Server-side utilities
│   │   ├── stampy.ts         # Main Coda API interface
│   │   ├── kv-cache.ts       # Cloudflare KV caching
│   │   └── parsing-utils.ts  # Markdown/HTML processing
│   ├── root.tsx              # App shell, meta tags, analytics
│   └── root.css              # Global styles
├── public/                   # Static assets served directly
├── stories/                  # Storybook stories
├── .github/workflows/        # CI/CD pipelines
├── wrangler.toml.template    # Cloudflare config template (copy to wrangler.toml)
└── package.json
```

## Code Style

### Prettier (enforced in CI)
```json
{
  "semi": false,
  "singleQuote": true,
  "bracketSpacing": false,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

**Key rules:**
- No semicolons
- Single quotes for strings
- No spaces inside braces: `{foo}` not `{ foo }`
- Max line width: 100 characters

**Always run before committing:**
```bash
npx prettier --write <file>
# or fix all:
npm run prettier:fix
```

### ESLint
- React hooks rules enforced
- Unused imports auto-removed
- `@typescript-eslint/no-explicit-any` is OFF (any is allowed)
- Unused function args can be prefixed with `_` to ignore

### TypeScript
- Strict mode enabled
- Path alias: `~/` maps to `./app/`
- Example: `import {foo} from '~/components/Foo'`

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/root.tsx` | App shell, HTML head, meta tags, analytics, theme |
| `app/routes/_index.tsx` | Homepage |
| `app/routes/questions.$questionId.$.tsx` | Question detail page |
| `app/server-utils/stampy.ts` | All Coda API calls, data types |
| `app/server-utils/kv-cache.ts` | Cloudflare KV caching wrapper |
| `wrangler.toml` | Local config with secrets (gitignored) |
| `remix.config.js` | Remix + Cloudflare Workers config |

## Data Flow

```
Coda.io (source of truth)
    ↓
app/server-utils/stampy.ts (fetch, parse, transform)
    ↓
Cloudflare KV (cached)
    ↓
Remix loader functions (in routes/*.tsx)
    ↓
React components (render)
```

**Content comes from Coda**, not a traditional database. Questions, tags, glossary entries, and banners are all stored in Coda tables. The Coda data originates from Google Docs via a parser in a separate repo.

## Common Commands

```bash
# Development
npm run dev              # Start local dev server (http://localhost:8787)
npm run storybook        # Component development UI

# Code Quality
npm run lint             # Check TypeScript, Prettier, ESLint
npm run lint:fix         # Auto-fix all lint issues
npm run prettier:fix     # Fix formatting only

# Testing
npm run test             # Run Jest tests (requires build)
npm run refresh-test-data # Update cached Coda data for tests

# Build & Deploy
npm run build            # Production build (has Windows issues, see Gotchas)
npm run deploy           # Build + deploy to Cloudflare

# Utilities
npm run generate-icons   # Regenerate icon components from SVGs
npm run clean-cache      # Clear all local caches
```

## Environment Variables

Set in `wrangler.toml` (copy from `wrangler.toml.template`):

| Variable | Purpose |
|----------|---------|
| `CLOUDFLARE_ACCT_ID` | Your Cloudflare account ID |
| `STAMPY_KV_ID` | KV namespace ID for caching |
| `CODA_TOKEN` | Read-only Coda API token |
| `CODA_WRITES_TOKEN` | Write access for counters |
| `CODA_INCOMING_TOKEN` | Write access for new questions |
| `MATOMO_DOMAIN` | Analytics domain (use `"mock"` for local dev) |
| `SENTRY_DSN` | Sentry error tracking |

## Local Development Setup

1. Copy `wrangler.toml.template` → `wrangler.toml`
2. Fill in your Cloudflare and Coda credentials
3. `npm install`
4. `npm run dev`
5. Open http://localhost:8787

## Git Workflow

This project uses a standard PR-based workflow:

1. Create a branch: `git checkout -b username-feature-description`
2. Make changes
3. Run `npm run lint:fix` before committing
4. Push: `git push -u origin branch-name`
5. Create PR on GitHub
6. Wait for CI checks (lint, tests)
7. Get review and merge

**Branch naming**: `username-description-issueNumber` (e.g., `algon-fix-twitter-card-1026`)

## Testing Social Media Previews

Meta tags for social sharing are in `app/root.tsx` in the `meta` function:
- Open Graph (`og:*`) for Facebook, LinkedIn, Discord, Slack
- Twitter Cards (`twitter:*`) for Twitter/X

**To test locally:**
1. Run `npm run dev`
2. Run `ngrok http 8787` (install globally or use `npx ngrok`)
3. Use the ngrok URL with:
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)
   - Post on Twitter to see preview

**Note:** Twitter caches aggressively. Add `?v=2` to URL to bypass cache.

## Analytics (Matomo)

Analytics is configured in `app/root.tsx` via the `AnaliticsTag` component.

**For local testing:**
1. Set `MATOMO_DOMAIN = "mock"` in `wrangler.toml`
2. Check browser console for mock tracking events
3. The mock is in `public/mock-matomo.js`

## Common Gotchas

### 1. Windows Build Script Fails
The `npm run build` script uses bash syntax that doesn't work on Windows PowerShell:
```
-n was unexpected at this time
```
**Workaround:** Use `npm run dev` locally. CI builds on Linux.

### 2. Prettier Formatting in PRs
CI enforces Prettier. If your PR fails with formatting errors:
```bash
npx prettier --write app/root.tsx
git add . && git commit -m "Fix formatting" && git push
```

### 3. Icons are Auto-Generated
Don't manually edit files in `app/components/icons-generated/`. Instead:
1. Add/modify SVGs in `app/assets/icons/`
2. Run `npm run generate-icons`

### 4. wrangler.toml is Gitignored
Your local `wrangler.toml` contains secrets and won't be committed. That's intentional.

### 5. Twitter Meta Tags Use `name`, Open Graph Uses `property`
```tsx
// Correct:
{property: 'og:title', content: title}     // Open Graph
{name: 'twitter:title', content: title}    // Twitter
```

### 6. Content Comes from Coda, Not Local
If you're debugging content issues, the data is in Coda, not this repo. The cached test data can be refreshed with `npm run refresh-test-data`.

## Architecture Notes

### Remix + Cloudflare Workers
- Server code runs on Cloudflare's edge network
- No Node.js filesystem APIs (use Cloudflare KV for storage)
- Serverless execution model

### Routing
Remix uses file-based routing in `app/routes/`:
- `_index.tsx` → `/`
- `questions.$questionId.$.tsx` → `/questions/:questionId/*`
- `categories.$.tsx` → `/categories/*`

### Styling
- No CSS-in-JS or Tailwind
- Global styles in `app/root.css`
- Component styles in adjacent `.css` files
- CSS variables for theming (dark/light mode)

### Caching
The `withCache` wrapper in `server-utils/kv-cache.ts` caches Coda responses in Cloudflare KV with configurable TTL.

## Useful Links

- [Remix Docs](https://remix.run/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Coda API Docs](https://coda.io/developers/apis/v1)
- [Project Discord](https://discord.com/invite/7wjJbFJnSN)

---

*Last updated: January 2026*
