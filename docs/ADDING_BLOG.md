# Blog setup (current state)

The blog is already integrated in this repository and runs on the same pinned
runtime/tooling as the rest of the site:

- Deno: `2.9.7` (see `.deno-version`)
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
cover: /images/covers/my-post.jpg
---

Your content here...
```

## Images (GHCR-backed, gitignored)

Article assets live in `src/public/images/` and are **not committed** —
they're pulled digest-pinned from `ghcr.io/maroayman/images` at build time:

- Covers: `src/public/images/covers/<slug>.jpg` → `/images/covers/<slug>.jpg`
- Inline: `src/public/images/<slug>/image01.png` → `/images/<slug>/image01.png`

Add files, reference the `/images/...` URL, test with `deno task serve`,
then publish and pin in one step:

```bash
deno task images:push -- --dry-run   # preview
deno task images:push -- --pin       # push full set, rewrite digest pins
```

Fresh clones need `deno task images:pull` once before serving.

## Fast local loop (large image sets)

`deno task dev:fast` skips the bulk image copy (`SKIP_IMAGES=1`) and
delta-syncs only new/changed files (`images:sync`, instant no-op when
clean). Watch rebuilds under `deno task serve` are incremental and leave
`_site/images/` untouched. CI/prod never set `SKIP_IMAGES`, so deploys
always ship images.

## Validate locally

```bash
deno task check
deno task build
deno task serve
```
