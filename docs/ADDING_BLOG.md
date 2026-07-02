# Blog setup (current state)

The blog is already integrated in this repository and runs on the same pinned
runtime/tooling as the rest of the site:

- Deno: `2.9.1` (see `.deno-version`)
- Lume: `3.2.6` (see `deno.json` imports)

## Key files

- `src/blog/*.md` — blog posts (Markdown)
- `src/_includes/layouts/blog.vto` — blog post layout
- `src/blog.vto` — blog index page
- `_config.ts` — blog plugins, reading-time preprocessing, RSS setup
- `src/styles/blog.css` — blog content/code/lightbox styling

## Add a new post

Create a file under `src/blog/`:

```markdown
---
title: My New Post
description: A brief description
date: 2026-07-02
tags:
  - linux
  - docker
cover: /assets/images/cover.jpg
---

Your content here...
```

## Validate locally

```bash
deno task check
deno task build
deno task serve
```
