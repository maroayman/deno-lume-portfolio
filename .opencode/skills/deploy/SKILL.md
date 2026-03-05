---
name: deploy
description: Deploy pipeline for the portfolio — Vercel auto-deploy, Deno Deploy manual deploy, service worker build paths, and task order
---

## What I cover

The two deploy paths, two service worker build paths, correct task order, and what never to commit.

## Primary deploy — Vercel (automatic)

Vercel deploys automatically on every push to `main`. No manual step needed.

```bash
git add -A
git commit -m "feat: describe your change"
git push
```

Or use the `/deploy` command:
```
/deploy feat: describe your change
```

**Vercel build command (runs on Vercel's infrastructure):**
```sh
curl -fsSL https://deno.land/install.sh | sh
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
deno task build
npx -y workbox-cli generateSW scripts/workbox-config.js
```

Output directory: `_site/`

## Secondary deploy — Deno Deploy (manual)

Run locally when you want to deploy to Deno Deploy instead:

```bash
deno task deploy
```

This runs: `deno task lint && deno task check && deno task build && deno deploy deploy --prod --app portfolio`

Config in `deno.json`:
```json
"deploy": { "org": "maroayman", "app": "deno-lume-portfolio" }
```

## Service worker — two separate build paths

| Environment | SW generator | Command |
|---|---|---|
| Local dev / local build | `scripts/build-sw.js` (hand-rolled, uses git SHA for cache version) | `deno task build:sw` |
| Vercel | `scripts/workbox-config.js` (Workbox CLI) | `npx workbox-cli generateSW` |

Both produce `_site/sw.js` with the same caching strategies. Do not confuse or merge them.

**Local SW build is required before serving:**
```bash
deno task serve   # runs build:sw automatically, then starts dev server
deno task dev     # alias for serve
```

## Local task reference

```bash
deno task dev        # build:sw + lume dev server with live reload
deno task build      # deno audit + DENO_ENV=production lume build
deno task build:sw   # regenerate _site/sw.js using git SHA cache version
deno task build:all  # build + build:sw
deno task lint       # deno lint src/ _config.ts
deno task check      # deno check _config.ts (type check)
deno task resume     # compile main.typ → src/resume.pdf via Typst
deno task deploy     # lint + check + build + deno deploy --prod
```

## Never commit these files

- `resume.json` — gitignored, local only
- `main.typ` — gitignored, local only
- `_site/` — gitignored, build output
- `_cache/` — gitignored, Lume cache

## Vercel routing rules (defined in vercel.json)

Short-link redirects (301):
- `/github` → `https://github.com/maroayman`
- `/linkedin` → `https://linkedin.com/in/maroayman`
- `/twitter` → `https://twitter.com/maroayman`

Temporary redirects (302):
- `/resume` → `/resume.pdf`
- `/cv` → `/resume.pdf`

Cache headers:
- HTML: `max-age=0, stale-while-revalidate=86400`
- CSS/JS/fonts/images: `max-age=31536000, immutable` (1 year)
- PDF: `max-age=86400, stale-while-revalidate=604800`
- `sw.js`: `no-cache, no-store, must-revalidate`
