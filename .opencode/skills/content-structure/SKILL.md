---
name: content-structure
description: Enforce page layout conventions for Vento templates and content pages
---

## What I cover

Rules for organizing page templates and content structure in `src/` Vento files.

## Allowed files

- `src/index.vto`
- `src/blog.vto`
- `src/experience.vto`
- `src/projects.vto`
- `src/certifications.vto`
- `src/uses.vto`
- `src/_includes/layouts/*.vto`

## Never touch

- `src/blog/` content unless explicitly asked
- `src/styles/main.css` unless explicitly asked

## Layout rules

- Keep page sections ordered: hero/title, intro, primary content, secondary content, footer.
- Use existing class names and patterns; avoid new wrappers unless necessary.
- Preserve aria attributes and keyboard navigation patterns.
- Keep metadata blocks (SEO, JSON-LD) in shared layout partials.

## Vento conventions

- Use `{{ }}` for output, `{% %}` for control flow.
- Keep includes at the top of files.
- Do not inline large scripts; prefer `src/assets/*.js`.
