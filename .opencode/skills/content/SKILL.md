---
name: content
description: Rules for updating site content files — allowed files, forbidden files, and data model schemas
---

## What I cover

Rules for editing site data and page templates in the deno-lume-portfolio project.

## Files you are allowed to edit

- `src/_data/experience.json`
- `src/_data/projects.json`
- `src/_data/certifications.json`
- `src/_data/certifications.yml`
- `src/uses.vto`
- `src/index.vto`

## Files you must never touch

- Anything in `src/blog/`
- `src/styles/main.css`
- `_config.ts`
- `deno.json`

## Data model schemas

### `experience.json`

```jsonc
{
  "title": "string",
  "company": "string",
  "period": "string",       // e.g. "Jan 2024 – Present" or "2024"
  "description": "string",
  "responsibilities": ["string"],
  "tags": ["string"]
}
```

### `projects.json`

```jsonc
{
  "title": "string",
  "slug": "string",
  "summary": "string",
  "tech": ["string"],
  "role": "string",
  "period": "string",       // e.g. "2025" or "Jan 2025 – Mar 2025"
  "highlights": ["string"],
  "link": "https://…"       // optional
}
```

### `certifications.json`

```jsonc
{
  "title": "string",
  "issuer": "string",
  "date": "string",         // MUST be parseable by Date() — use "YYYY-MM" format
  "credential": "https://…", // optional
  "badge": "https://…"
}
```

### `certifications.yml`

```yaml
- title: string
  issuer: string
  date: YYYY-MM   # keep parseable (e.g., 2026-05) or Month YYYY if already used
  expiryDate: YYYY-MM # optional
  credentialId: string | null
```

## Sorting rules

All collections are sorted descending by end date via `toTime()` in `src/_data.ts`.

- `period` is parsed by reading the last year/month token in the string
- Malformed dates return `0` and float to the bottom — always use valid date strings

## Source of truth

- If both `certifications.json` and `certifications.yml` exist, prefer the format already used by the page consuming it.
- Keep entries aligned when both files are present to avoid mismatched content.

## Tag format

Tags in `experience.json` and `projects.json` are rendered as pill elements. Keep them short (1–3 words).
