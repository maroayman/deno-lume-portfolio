---
name: lume-config
description: Non-obvious rules in _config.ts — PurgeCSS safelist, markdown hooks, preprocessors, plugin order, and build flags
---

## What I cover

Everything non-obvious in `_config.ts` that is easy to break or forget when making changes.

## Plugin registration order

Plugins must remain in this order — some depend on earlier ones:

1. `vento` — templating
2. `markdown` + `markdownTabs` hook — rendering
3. `date` — date filter
4. `slugifyUrls` — URL normalization
5. `googleFonts` — self-hosts Inter, injects into `main.css` at `/* google-fonts */` placeholder
6. `inline` — inlines `<link rel="stylesheet" ... inline>` assets
7. `lightningcss` — CSS transforms (must run after `inline`)
8. `purgecss` — removes unused CSS (must run after `lightningcss`)
9. `sitemap`, `feed` — generated files
10. `minifyHTML` — **production only**, gated by `DENO_ENV=production`

## PurgeCSS safelist — always maintain this

```ts
safelist: [/^dark-mode$/, /^visible$/, /^read$/, /^code-tab/]
```

These are JS-injected classes that PurgeCSS cannot detect at build time:
- `dark-mode` — toggled on `<body>` / `<html>` by the theme toggle
- `visible` — toggled by scroll/intersection observers (back-to-top, etc.)
- `read` — added to blog cards when a post is in `localStorage` reading history
- `code-tab*` — all classes on the `:::tabs` component (`code-tab-btn`, `code-tab-pane`, `active`)

**If you add a new JS-toggled class, add its pattern to this safelist or PurgeCSS will strip it.**

## Markdown hooks

### 1. markdownTabs plugin
```ts
site.hooks.addMarkdownItPlugin(markdownTabs);
```
Adds `:::tabs` / `:::` block syntax. See `plugins/markdown-tabs.ts`.

### 2. data-lang fence hook
```ts
site.hooks.addMarkdownItPlugin((md) => {
  md.renderer.rules.fence = function(...) { ... };
});
```
Wraps the default fence renderer to inject `data-lang="bash"` (etc.) on every `<pre>` tag. CSS uses `content: attr(data-lang)` in `pre::before` to display the language name. Falls back to `· · ·` when no language is specified.

**Do not override `md.renderer.rules.fence` anywhere else — it will clobber this hook.**

## Preprocessors (run on every `.md` file before build)

### Tag lowercasing
```ts
page.data.tags = page.data.tags.map(t => t.toLowerCase())
```
All tags are forced to lowercase at build time. Write tags in Title Case in frontmatter for readability — they will be lowercased automatically.

### Reading time
Strips Markdown syntax, counts words at 200 wpm, sets `page.data.readingTime` (integer, minimum 1).
The `blog.vto` layout displays this via `{{ readingTime ?? 1 }} min read`.

## Scoped data defaults

```ts
site.data("layout", "layouts/blog.vto", "/blog")
site.data("type", "post", "/blog")
```

All pages under `/blog` automatically get `layout` and `type=post` — no need to specify these in individual post frontmatter.

## Static file copies

```ts
site.add("styles")     // src/styles/ → _site/styles/
site.add("assets")     // src/assets/ → _site/assets/
site.add("public", ".") // public/ → _site/ (root)
site.add([".pdf"])     // all .pdf files
```

Files in `public/` are served from the site root — `public/robots.txt` → `/robots.txt`.

## Production flag

```ts
const isProduction = Deno.env.get("DENO_ENV") === "production"
```

`minifyHTML` is only activated when `DENO_ENV=production`. The `deno task build` task sets this automatically. Local `deno task dev` / `deno task serve` do not.

## Custom slug filter

```ts
site.filter("slug", (s) => s.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''))
```

Available in Vento templates as `|> slug`. Independent of `slugifyUrls`.
