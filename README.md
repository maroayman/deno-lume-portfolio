# Deno Lume Portfolio

A portfolio website built with Deno and the Lume static site generator, styled
in a Cairo direction: paper/ink tones with red, brass, and teal accents,
bilingual Latin/Arabic typography, and hairline-ruled sections.

## Features

### Core

- 🎨 Cairo visual direction with light/dark mode
- 📱 Fully responsive design
- ⚡ Fast performance with static site generation
- 🔍 SEO optimized with sitemap
- ♿ Accessible (ARIA attributes, keyboard navigation)

### Blog System

- 📝 Markdown-based blog posts
- 🏷️ **Advanced tag filtering system**
  - Multi-tag filtering with AND logic (Ctrl/Cmd+click)
  - Dropdown with search for 50+ tags
  - URL hash sync for shareable filtered views (`#tags=linux,docker`)
  - Visual hierarchy based on tag popularity
  - Active filters indicator with remove buttons
- 🔖 Bookmark articles (localStorage)
- 📚 Reading history tracking
- ✓ Instant "read" indicator on visited posts
- 🔗 Related posts suggestions
- 📋 Copy code blocks
- 🖼️ Image lightbox
- 📊 Reading progress bar

### Content Validation

Run `deno task check:content` to validate every data collection (`experience`,
`projects`, `certifications`, `stack`) and every post's frontmatter (title,
description, date, tags). Blog tags are lowercased automatically at build time,
and one page per used tag is generated at `/blog/tags/[tag]/` — there is no tag
registry to maintain.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) **2.9.1** (pinned in `.deno-version`)

### Installation

1. Clone this repository:
   ```bash
   git clone git@github.com:maroayman/deno-lume-portfolio.git
   ```

2. Navigate to the project directory

### Development

Run the development server:

```bash
deno task serve
```

The site will be available at `http://localhost:3000`

### Git Hooks

This repo includes shared hooks in `scripts/githooks/`. To enable them:

```bash
git config core.hooksPath scripts/githooks
```

Hooks included:

- `pre-commit`: blocks `resume.json`, `main.typ`, `_cache/` and runs
  `deno fmt` + `deno lint` on staged files
- `commit-msg`: enforces conventional commit prefixes (feat, fix, docs, style,
  refactor, perf, test, chore)
- `pre-push`: confirms push and runs `deno task check` + `deno task build`
- `post-merge`: regenerates the service worker with `deno task build:sw`

### Build

Build the site for production:

```bash
deno task build
```

The built site will be in the `_site` directory.

Run a quick selector audit before larger styling cleanups:

```bash
deno task css:audit
```

## Customization

### Update Your Information

1. Edit `src/index.vto` to update:
   - Your name
   - Your title/role
   - About section
   - Skills
   - Projects
   - Contact information

2. Update social media links in `src/_includes/layouts/base.vto`

### Adding Blog Posts

Create new `.md` files in `src/blog/`:

```markdown
---
title: My New Post
description: A brief description
date: 2026-02-03
tags:
  - linux
  - docker
cover: /assets/images/cover.jpg
---

Your content here...
```

### Managing Tags

Write tags normally in a post's frontmatter — they are lowercased at build time
and tag pages are generated automatically. No registry to update. Validate
everything with:

```bash
deno task check:content
```

### Styling

Styles are split by concern:

- `src/styles/main.css` (tokens, layout, pages, blog list)
- `src/styles/blog.css` (blog article/code/lightbox)
- `src/styles/pages.css` (404/uses/toc/responsive/print)

The design system uses CSS custom properties (variables):

- Colors: paper/ink base with red, brass, and teal accents (`--paper`, `--ink`,
  `--red`, `--brass`, `--teal`), each with a dark-mode override
- Typography: Archivo (display), IBM Plex Sans Arabic (body), Reem Kufi (Arabic
  accents)
- Spacing: sharp corners and hairline rules throughout

## Project Structure

```
deno-lume-portfolio/
├── _config.ts              # Lume config: plugins, filters, preprocessors
├── deno.json               # Deno configuration and tasks
├── plugins/
│   └── markdown-tabs.ts    # :::tabs code-tab block for Markdown
├── scripts/
│   ├── audit-css-selectors.ts  # Unused-CSS audit
│   ├── build-sw.js             # Service worker generator
│   ├── validate-content.ts     # Frontmatter/YAML validation
│   └── githooks/               # Shared pre-commit/commit-msg/pre-push/post-merge
├── docs/
│   └── ADDING_BLOG.md      # How to write a new post
├── src/
│   ├── _data.ts            # Global site data (author, nav, social)
│   ├── _data/
│   │   ├── experience.yml
│   │   ├── projects.yml
│   │   ├── certifications.yml
│   │   ├── stack.yml
│   │   └── uses.json
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.vto    # Masthead, footer, SEO
│   │   │   ├── blog.vto    # Blog post layout
│   │   │   └── tag.vto     # Tag listing layout
│   │   └── partials/       # Cards, theme flash, prefetch, scripts
│   ├── assets/
│   │   ├── blog-list.js    # Blog search/filter/pagination
│   │   └── blog-post.js    # TOC, lightbox, share, reading history
│   ├── blog/
│   │   ├── tags.page.ts    # One page generated per used tag
│   │   └── *.md            # Blog posts (Markdown)
│   ├── styles/
│   │   ├── main.css        # Tokens/layout/pages/blog list
│   │   ├── blog.css        # Blog-specific styles
│   │   └── pages.css       # Page-level and responsive styles
│   ├── index.vto           # Homepage
│   ├── blog.vto            # Blog listing page
│   ├── experience.vto      # Experience page
│   ├── projects.vto        # Projects page
│   ├── certifications.vto  # Certifications page
│   └── uses.vto            # Uses page
├── .deno-version           # Pinned Deno runtime version
├── deno.lock               # Dependency lockfile
└── _site/                  # Built site (generated, git-ignored)
```

## Technologies Used

- [Deno](https://deno.land/) - Modern JavaScript/TypeScript runtime
- [Lume](https://lume.land/) - Static site generator for Deno
- [Vento (.vto)](https://lume.land/plugins/vento/) - Templating engine for Lume
- CSS3 with modern features (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript for interactions

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please
open an issue or submit a pull request.

## Reporting Issues

If you encounter any problems, please
[open an issue](https://github.com/maroayman/deno-lume-portfolio/issues) with
details and steps to reproduce.

## License

MIT License - feel free to use this template for your own portfolio!

## Credits

Built with ❤️ using Lume & Deno
