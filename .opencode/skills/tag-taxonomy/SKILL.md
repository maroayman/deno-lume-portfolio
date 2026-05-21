---
name: tag-taxonomy
description: Maintain approved tags, normalization, and consistency across posts
---

## What I cover

Rules for managing tags and tag usage across the project.

## Allowed files

- `_config.ts`
- `src/blog/*.md`
- `src/blog/_data.yml`

## Never touch

- `src/styles/main.css` unless explicitly asked

## Tag rules

- Tags are normalized to lowercase at build time, but write them in Title Case in frontmatter.
- Only use tags present in the approved list in `_config.ts`.
- Keep tag names short and consistent (1–2 words).
- Avoid near-duplicates (e.g., "cloud" vs "cloud-native").

## When adding a new tag

- Add it to the approved list in `_config.ts`.
- Use it in at least one post to avoid dead tags.
