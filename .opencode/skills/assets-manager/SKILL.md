---
name: assets-manager
description: Rules for adding and maintaining assets (images, fonts, JS) in src/assets
---

## What I cover

Conventions for adding and referencing assets in the deno-lume-portfolio project.

## Allowed files

- `src/assets/**`
- `src/public/**`
- `src/styles/main.css` (only when linking assets)
- `src/_includes/layouts/*.vto` (only when linking assets)

## Never touch

- `src/blog/` content unless explicitly asked

## Asset rules

- Prefer `webp` for photos, `svg` for icons/logos, `png` for UI screenshots.
- Keep filenames lowercase, kebab-case.
- Place images under `src/assets/images/`.
- Place JS utilities under `src/assets/`.
- Avoid duplicating the same asset in `public/` and `assets/`.

## Linking rules

- Use root-relative paths in templates (e.g., `/assets/images/foo.webp`).
- If an asset is replaced, keep the filename stable to preserve caching.
