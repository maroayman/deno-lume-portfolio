---
name: data-curation
description: Maintain site data files with schema, ordering, and consistency checks
---

## What I cover

Rules for editing `src/_data` files with structure, ordering, and consistency guarantees.

## Allowed files

- `src/_data/experience.json`
- `src/_data/projects.json`
- `src/_data/skills.json`
- `src/_data/certifications.json`
- `src/_data/certifications.yml`

## Never touch

- `src/blog/` content unless explicitly asked
- `src/styles/main.css` unless explicitly asked

## Data rules

- Keep field order consistent with existing entries.
- Avoid nulls unless the file already uses them.
- Keep lists sorted by most recent end date first (matching `src/_data.ts`).
- Use ISO-ish date strings where possible (`YYYY-MM` or `YYYY-MM-DD`).
- Preserve exact capitalization for display names; normalize tags to lowercase.

## Consistency checks

- If the same item exists in JSON and YAML, keep content aligned.
- If a new item is added to data, ensure any referenced page exists or is updated.
- Keep abbreviations consistent (e.g., AWS, CI/CD, DevOps).
