---
name: project-hygiene
description: Keep build outputs, gitignore, and artifacts tidy and consistent
---

## What I cover

Rules for keeping build artifacts, outputs, and repo hygiene consistent in the deno-lume-portfolio project.

## Allowed files

- `.gitignore`
- `README.md`
- `spec-kit.md`
- `vercel.json`
- `_config.ts`

## Never touch

- `src/blog/` content unless explicitly asked
- `src/styles/main.css` unless explicitly asked

## Output directories

- Lume output is `_site/` (configured in `_config.ts`).
- `dist/` is legacy and should stay empty or be removed if explicitly requested.
- Never commit `_site/`, `dist/`, or `_cache/`.

## Hygiene rules

- Keep docs aligned with config: if output dir is `_site`, docs must say `_site`.
- If a folder is gitignored but present, it is considered a build artifact.
- Never delete tracked files without explicit request.
- If asked to clean artifacts, remove only build outputs and caches.

## When asked to standardize output

- Choose one output directory (`_site` is authoritative).
- Update `README.md` + `vercel.json` + `_config.ts` for consistency.
- Ensure `.gitignore` still lists `_site/` and `dist/`.
