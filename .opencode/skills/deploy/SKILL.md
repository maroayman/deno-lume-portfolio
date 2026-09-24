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
bash scripts/vercel-build.sh
```

The script installs pinned Deno (version from `.deno-version`) and ORAS,
pulls digest-pinned images from GHCR, then runs `deno task build:all`.
Kept as a script because `vercel.json` `buildCommand` must stay <= 256 chars.

Output directory: `_site/`

## Secondary deploy — Deno Deploy (manual)

Run locally when you want to deploy to Deno Deploy instead:

```bash
deno task deploy
```

This runs: `deno task lint && deno task check && deno task build && deno deploy --prod --org maroayman --app deno-lume-portfolio`

Config in `deno.json`:
```json
"deploy": { "org": "maroayman", "app": "deno-lume-portfolio" }
```

## Service worker — single build path

| Environment | SW generator | Command |
|---|---|---|
| Local dev / local build / Vercel | `scripts/build-sw.js` (hand-rolled, uses git SHA for cache version) | `deno task build:sw` |

`deno task build:all` runs `build` + `build:sw`. There is no Workbox
config in this repo — do not run `workbox-cli generateSW`, it would
overwrite the hand-rolled `_site/sw.js` and lose its eviction guards.

**Local SW build is required before serving:**
```bash
deno task serve   # runs build:sw automatically, then starts dev server
deno task dev     # alias for serve
```

## Local task reference

```bash
deno task dev        # build:sw + lume dev server with live reload
deno task build      # DENO_ENV=production lume build (site only, no SW)
deno task build:sw   # regenerate _site/sw.js using git SHA cache version
deno task build:all  # build + build:sw (what Vercel ships; CI runs this too)
deno task lint       # deno lint src/ _config.ts scripts/
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
- HTML (including extensionless `cleanUrls` routes): `max-age=0, stale-while-revalidate=86400`
- CSS/JS: `max-age=3600, stale-while-revalidate=86400` (filenames aren't content-hashed, so no `immutable`)
- Images/icons/fonts/manifest/PDF: images + PDF + manifest use SWR; fonts stay `immutable` (filenames encode weight/subset)
- Feed/sitemap/robots (`rss/xml/json/txt`): `max-age=3600, stale-while-revalidate=86400`
- `sw.js`: `no-cache, no-store, must-revalidate`
- No enforcing CSP yet (inline scripts throughout): catch-all sends
  `Content-Security-Policy-Report-Only` as a baseline — violations log to
  console without breaking pages. Enforcing needs hashes for the inline
  scripts in `blog.vto` / `tag.vto` / `scripts-common.vto` first.
