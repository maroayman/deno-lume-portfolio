# Spec-Kit — deno-lume-portfolio

Authoritative context, decisions, and improvement notes for the `deno-lume-portfolio` project.
Update this file whenever a meaningful architectural or workflow decision is made.

---

## 1. Project Overview

A personal portfolio and technical blog for **Marwan Ayman Shawky** (Cloud & DevOps Engineer).

| Property | Value |
|---|---|
| Generator | [Lume v3.1.4](https://lume.land) (Deno-native SSG) |
| Template engine | [Vento (.vto)](https://vento.js.org) |
| Styles | LightningCSS (via Lume plugin) |
| Runtime | Deno |
| Deployment | Vercel (`maroayman.vercel.app`) + Deno Deploy |
| Live URL | <https://maroayman.vercel.app> |

---

## 2. Repository Layout

```
_config.ts            # Lume site configuration, plugins, filters, preprocessors
deno.json             # Deno tasks, import map, compiler options, permissions
package.json          # Node deps: markdown-it 14.1.1, vercel CLI
scripts/
  build-sw.js         # Generates service-worker (sw.js) into _site/ at build time
  workbox-config.js   # Workbox options (referenced by build-sw.js)
src/
  _data.ts            # Aggregates & sorts JSON data (projects, experience, certifications)
  types.ts            # Shared TypeScript interfaces (Experience, Project, Certification, BlogPost…)
  _data/
    projects.json     # Project entries (title, period, highlights, tags, github link)
    experience.json   # Work/training experience entries
    certifications.json # Certification entries (title, issuer, date, badge)
  _includes/
    pagination.vto    # Client-side JS pagination component (4 items/page, ≤10 page buttons)
    layouts/
      base.vto        # Base HTML shell — OG/Twitter meta, JSON-LD WebSite, SW registration
      blog.vto        # Blog post shell — OG article meta, JSON-LD BlogPosting, reading-time
  blog/               # Markdown blog posts (001-…md … 017-…md)
  *.vto               # Page templates: index, blog, projects, experience, certifications, 404
  styles/
    main.css          # Single CSS file; processed by LightningCSS
  assets/images/      # Static images
_site/                # Build output (committed to repo; Vercel reads it directly)
docs/
  ADDING_BLOG.md      # How to add a new blog post
```

---

## 3. Key Deno Tasks

| Task | Command | Notes |
|---|---|---|
| `dev` | `deno task dev` | Builds SW then starts Lume dev server with live reload |
| `serve` | `deno task serve` | Same as dev |
| `build` | `deno task build` | `deno audit` → production Lume build (minifyHTML enabled) |
| `build:sw` | `deno task build:sw` | Generates SW only |
| `build:all` | `deno task build:all` | Full production build + SW |
| `lint` | `deno task lint` | `deno lint src/ _config.ts` |
| `fmt` | `deno task fmt` | `deno fmt src/ _config.ts` |
| `check` | `deno task check` | `deno check _config.ts` |
| `deploy` | `deno task deploy` | Build then push to Deno Deploy (`portfolio` app) |

> **Production flag**: `DENO_ENV=production` enables the `minifyHTML` plugin.

---

## 4. Data Model

All types live in `src/types.ts`. Data is loaded and sorted in `src/_data.ts`.

### Sorting logic (`_data.ts`)
The helper `toTime(s)` parses the **end date** from a `period` string (format `"YYYY"` or `"Month YYYY – Month YYYY"`).
All three collections are sorted **descending** by end date so the most recent entry appears first.

> **Watch out**: if `period` / `date` strings don't match the expected format, `toTime` returns `0` and the entry floats to the bottom. Always use ISO-style date strings.

### JSON field reference

#### `projects.json`
```jsonc
{
  "title": "string",
  "slug": "string",          // used for URL if needed
  "summary": "string",
  "tech": ["string"],        // rendered as tag pills
  "role": "string",
  "period": "string",        // e.g. "2025" or "Jan 2025 – Mar 2025"
  "highlights": ["string"],
  "link": "https://…"        // optional GitHub/live link
}
```

#### `experience.json`
```jsonc
{
  "title": "string",
  "company": "string",
  "period": "string",
  "description": "string",
  "responsibilities": ["string"],
  "tags": ["string"]
}
```

#### `certifications.json`
```jsonc
{
  "title": "string",
  "issuer": "string",
  "date": "string",          // e.g. "2025-04" — must be parseable by Date()
  "credential": "https://…", // optional verify link
  "badge": "https://…"       // badge image URL
}
```

### Blog post frontmatter
```yaml
title: "string"
description: "string"
date: YYYY-MM-DD
cover: "https://…"   # optional OG image
tags:
  - Tag1
  - Tag2
```
Tags are **lowercased** automatically by the `_config.ts` preprocessor.  
Naming convention: `NNN-kebab-case-title.md`.

---

## 5. Lume Configuration Notes (`_config.ts`)

- **Plugins active**: vento, markdown (markdown-it), date, slugifyUrls, inline (inlines CSS at build), lightningcss, sitemap, minifyHTML (prod only).
- **Custom `slug` filter**: strips non-word chars, collapses spaces to hyphens. Used in templates for tag links.
- **`site.data("layout", …, "/blog")`**: all files under `src/blog/` automatically use `layouts/blog.vto`.
- **`site.data("type", "post", "/blog")`**: marks blog pages as `type: post` for sitemap/feed use.
- **`site.add([".pdf"])`**: copies `.pdf` files to `_site/` so `resume.pdf` is served correctly.

---

## 6. Service Worker (`scripts/build-sw.js`)

- Generates a hardcoded `sw.js` string and writes it to `_site/sw.js`.
- Precaches: `/`, `/index.html`, `/styles/main.css`, `/resume.pdf`, `/404.html`.
- Cache strategies: pages (50 entries), static (60, 30 days), images (100, 60 days), fonts (20, 1 year), PDFs.
- ~~**Bug**: the `activate` handler cache-purge filter is logically inverted — it deletes caches that *do* match `CACHE_VERSION` instead of ones that don't.~~ **Fixed**: single negation filter now correctly deletes only old caches.
- ~~**Bug**: no error handling around `fs.writeFileSync` / `fs.mkdirSync`~~ **Already resolved** — `Deno.mkdir` / `Deno.writeTextFile` are wrapped in a `try/catch` with `Deno.exit(1)`.

---

## 7. Pagination Component (`src/_includes/pagination.vto`)

Client-side only. Reads `data-pagination-item` attributes, shows **4 items per page**, renders up to **10 page buttons**.  
State is synced to the URL via `?page=N` and `history.pushState`.

> Logic is now in `src/assets/pagination.js` (documented, readable) and included via the `inline` plugin.

---

## 8. SEO & Structured Data

- `base.vto`: JSON-LD `WebSite` schema + full OG/Twitter card meta on every non-blog page.
- `blog.vto`: JSON-LD `BlogPosting` schema with `datePublished`, `author`, `publisher`, optional `image` and `keywords`.
- Canonical URL pattern: `https://maroayman.vercel.app{{ url }}` — hardcoded; matches `lume({ location })`.
- `sitemap` plugin auto-generates `_site/sitemap.xml`.
- RSS feed available at `/feed.rss` (Lume `feed` plugin); `<link rel="alternate">` present in both layouts.
- Shared head/body partials in `src/_includes/partials/` eliminate duplication between `base.vto` and `blog.vto`.

---

## 9. Known Issues & Technical Debt

| # | Area | Description | Priority |
|---|---|---|---|
| ~~1~~ | ~~`scripts/build-sw.js`~~ | ~~Activate handler cache-purge logic is inverted (§6)~~ **Fixed** | ~~High~~ |
| ~~2~~ | ~~`scripts/build-sw.js`~~ | ~~No try/catch around file-system calls~~ **Was already fixed** | ~~Medium~~ |
| ~~3~~ | ~~`src/_data.ts`~~ | ~~`toTime` silently returns `0` for malformed date strings~~ **Fixed — `console.warn` added** | ~~Medium~~ |
| ~~4~~ | ~~`src/_includes/pagination.vto`~~ | ~~All pagination JS is minified inline~~ **Fixed — extracted to `src/assets/pagination.js`** | ~~Low~~ |
| ~~5~~ | ~~`base.vto` / `blog.vto`~~ | ~~SEO meta/JSON-LD blocks largely duplicated~~ **Fixed — shared via partials** | ~~Low~~ |
| ~~6~~ | ~~`package.json`~~ | ~~`vercel` CLI listed as runtime dependency~~ **Fixed — moved to `devDependencies`** | ~~Low~~ |
| ~~7~~ | ~~Blog~~ | ~~No RSS feed~~ **Fixed — `/feed.rss` via Lume feed plugin** | ~~Low~~ |
| ~~8~~ | ~~`_config.ts`~~ | ~~`slug` filter and tag preprocessor undocumented~~ **Fixed — JSDoc added** | ~~Low~~ |

---

## 10. Improvement Ideas & Roadmap

- ~~**RSS/Atom feed**: add `lume/plugins/feed.ts` to `_config.ts`; expose `/feed.xml`.~~ **Done** (`/feed.rss`).
- **Reading-time estimate**: compute word-count in the `_config.ts` preprocess step, expose a `readingTime` data field, render in `blog.vto` header.
- **Tag index pages**: use Lume's `paginate` helper to generate `/blog/tags/[tag]/` listing pages.
- **OG image generation**: auto-generate per-post OG images (Satori / canvas) instead of relying on cover images.
- **Dark-mode default**: supplement the `localStorage` toggle with `prefers-color-scheme` as the initial default.
- **CI lint gate**: add `deno task lint && deno task check` as a required step in `deploy.yml` before the build.
- **SW cache version**: tie `CACHE_VERSION` in `build-sw.js` to the build timestamp or git SHA for automatic cache-busting on each deploy.

---

## 11. Architectural Decisions

| Decision | Rationale |
|---|---|
| Lume (Deno SSG) over Next.js / Astro | Zero Node.js runtime in production; native Deno toolchain; fast cold-start on Deno Deploy |
| Vento templates | Lume's first-class template engine; lighter than Nunjucks |
| Single `main.css` | Portfolio is small; LightningCSS handles modern CSS nesting/variables; splitting not yet worth the complexity |
| Hardcoded SW via `build-sw.js` | Avoids Workbox CLI dependency; full control over cache strategies |
| JSON data files (no CMS) | Static, version-controlled data; no database or API needed for a portfolio |
| `_site/` committed to repo | Vercel reads build output directly; avoids re-running the build on Vercel's infrastructure |

---

_Last updated: 2026-03-02_
