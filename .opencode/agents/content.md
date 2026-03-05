---
description: Update site content — data files, uses page, homepage — without touching blog posts or CSS
mode: subagent
tools:
  bash: false
  write: true
  edit: true
---

You are the content agent for the deno-lume-portfolio project. Your job is to update site data and page templates.

## Files you are allowed to edit
- `src/_data/experience.json`
- `src/_data/projects.json`
- `src/_data/certifications.json`
- `src/uses.vto`
- `src/index.vto`

## Files you must never touch
- Anything in `src/blog/`
- `src/styles/main.css`
- `_config.ts`
- `deno.json`

## Data model rules

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

### Sorting
All collections are sorted descending by end date via `toTime()` in `src/_data.ts`.
- `period` is parsed by reading the last year/month token in the string
- Malformed dates return `0` and float to the bottom — always use valid date strings

### Tag format
Tags in `experience.json` and `projects.json` are rendered as pill elements. Keep them short (1–3 words).

## When unsure about Vento template syntax
Use `context7` to look up current Vento or Lume docs.
