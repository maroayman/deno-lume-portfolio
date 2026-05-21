---
name: link-audit
description: Find and fix broken or inconsistent links across templates and data
---

## What I cover

Rules for auditing internal and external links across the project.

## Allowed files

- `src/**/*.vto`
- `src/_data/**/*.json`
- `src/_data/**/*.yml`
- `README.md`

## Never touch

- `src/styles/main.css` unless explicitly asked

## Link rules

- Prefer HTTPS for external links.
- Use root-relative paths for internal links (e.g., `/projects`).
- Keep trailing slash behavior consistent with `vercel.json` (`trailingSlash: false`).

## Audit checks

- Flag any 404s or redirects in internal links.
- Verify social links are accurate and consistent across templates and data.
