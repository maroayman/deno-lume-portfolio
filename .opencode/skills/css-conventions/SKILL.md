---
name: css-conventions
description: CSS architecture for main.css — design tokens, naming conventions, dark mode, JS-toggled classes, and special patterns
---

## What I cover

Conventions for the single-file CSS architecture in `src/styles/main.css` (LightningCSS, ~2200 lines).

## Ground rules

- There is **one CSS file** — `src/styles/main.css`. No imports, no splits, no preprocessor.
- LightningCSS handles transforms and autoprefixing. Nesting is supported.
- Always reuse existing tokens and classes. Do not introduce new variables unless truly new.
- Add new sections at the logical position in the file, following the existing comment header pattern.

## Design tokens — always use these, never hardcode values

### Colors
```css
--color-bg               /* page background */
--color-bg-elevated      /* cards, nav, elevated surfaces */
--color-bg-code          /* code block background */
--color-text             /* primary text */
--color-text-secondary   /* meta, captions */
--color-text-faint       /* placeholder, disabled */
--color-border           /* default border */
--color-border-subtle    /* lighter border */
--color-link             /* link color */
--color-link-hover       /* link hover */
--color-accent           /* primary accent (blue) */
--color-accent-light     /* accent background tint */
--color-accent-light-hover
--color-accent-border
--color-accent-underline
```

### Typography
```css
--font-sans   /* Inter + system stack */
--font-mono   /* SF Mono / Fira Code / Cascadia Code */
--font-size-base: 16px
--line-height: 1.7
```

### Layout & spacing
```css
--max-width: 680px   /* content column width */
--spacing: 2rem
--radius: 4px
--radius-sm: 2px
--radius-full: 9999px
--t-fast: 0.1s ease
--t-base: 0.15s ease
```

## Dark mode

Dark mode overrides all color tokens on `body.dark-mode, html.dark-mode`. It is toggled by JS adding the `dark-mode` class to `<body>` and `<html>`.

- **Never** use `@media (prefers-color-scheme: dark)` — the site uses a JS class toggle, not the media query.
- `dark-mode` is in the PurgeCSS safelist — do not remove it.
- When adding a new color, always add a dark mode override alongside it.

## Naming conventions

- Component blocks: hyphenated BEM-style — `.blog-card`, `.blog-card-title`, `.project-card`, `.blog-header`
- Modifier/state classes: single lowercase word — `.active`, `.open`, `.copied`, `.read`, `.visible`
- The only utility class is `.sr-only` (screen reader only)
- Tag frequency variants: `.filter-tag.weight-1` through `.weight-5` (opacity-based)

## JS-toggled classes — must stay in PurgeCSS safelist

These classes are added/removed by JavaScript at runtime. PurgeCSS cannot detect them statically.

| Class | Where added | Purpose |
|---|---|---|
| `dark-mode` | `<body>`, `<html>` | Dark theme |
| `visible` | `.back-to-top`, others | Show/hide on scroll |
| `read` | `.blog-card` | Post visited (from localStorage) |
| `active` | `.code-tab-btn`, `.code-tab-pane`, `.toc-active` | Active state |
| `open` | `.toc` | ToC expanded state |
| `copied` | `.copy-code-btn` | Copy button feedback |

**Any new JS-toggled class must be added to the PurgeCSS safelist in `_config.ts`.**

## Special CSS patterns — do not break these

### Language badge on code blocks
```css
pre::before {
  content: attr(data-lang);   /* shows language name e.g. "BASH" */
}
/* fallback when data-lang is absent */
pre:not([data-lang])::before,
pre[data-lang=""]::before {
  content: '· · ·';
}
```
The `data-lang` attribute is injected at build time by the markdown-it fence hook in `_config.ts`. Do not remove or rename this attribute.

### GitHub link auto-styling
```css
.blog-content a[href*="github.com/"]::before {
  mask-image: var(--icon-github);
}
```
Any GitHub link inside `.blog-content` automatically gets a GitHub icon badge — no extra markup needed. The icon is an inline SVG data URI stored in `--icon-github` on `:root`.

### Search highlight
```css
mark { background: var(--color-accent-light); }
```
The `<mark>` element is used by client-side search JS to highlight matching text.

## File section order

When adding new CSS, place it in the correct section (follow the comment headers):

1. Design System / Reset & Base / Layout
2. Skip Link / Theme Toggle / Back to Top
3. Page Title & Back Link
4. Index page components
5. Tech Tags / Show More Button
6. Projects / Experience / Certifications
7. Blog List Page
8. Blog Post article
9. 404 Terminal
10. Utility
11. Responsive (`@media max-width: 600px`, `400px`)
12. Uses Page
13. Table of Contents
14. Print styles
