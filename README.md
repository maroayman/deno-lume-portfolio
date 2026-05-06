# Deno Lume Portfolio

A modern, minimal portfolio website built with Deno and Lume static site
generator.

## Features

### Core

- 🎨 Clean, minimal design with light/dark mode
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

### Tag Validation

Tags are validated at build time against an approved list in `_config.ts`.
Unknown tags trigger a warning to maintain consistency.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system

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
- `pre-commit`: blocks `resume.json`, `main.typ`, `_cache/` and runs `deno fmt` + `deno lint` on staged files
- `commit-msg`: enforces conventional commit prefixes (feat, fix, docs, style, refactor, perf, test, chore)
- `pre-push`: confirms push and runs `deno task check` + `deno task build`
- `post-merge`: regenerates the service worker with `deno task build:sw`

### Build

Build the site for production:

```bash
deno task build
```

The built site will be in the `dist` directory.

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

Add new tags to the `APPROVED_TAGS` array in `_config.ts`:

```typescript
const APPROVED_TAGS = [
  "linux",
  "docker",
  "aws",
  "automation",
  // Add your new tags here
];
```

### Styling

All styles are in `src/styles/main.css`. The design system uses CSS custom
properties (variables) for easy customization:

- Colors: Update the `:root` variables for your color scheme
- Typography: Change font families and sizes
- Spacing: Adjust spacing variables

## Project Structure

```
deno-lume-portfolio/
├── _config.ts              # Lume configuration + tag validation
├── deno.json               # Deno configuration and tasks
├── src/
│   ├── _data.ts            # Global site data
│   ├── _includes/
│   │   └── layouts/
│   │       ├── base.vto    # Base layout template
│   │       └── blog.vto    # Blog post layout
│   ├── _data/
│   │   ├── experience.json
│   │   ├── projects.json
│   │   ├── certifications.json
│   │   └── skills.json
│   ├── blog/
│   │   ├── _data.yml       # Blog post defaults
│   │   └── *.md            # Blog posts (Markdown)
│   ├── styles/
│   │   └── main.css        # Main stylesheet
│   ├── index.vto           # Homepage
│   ├── blog.vto            # Blog listing page
│   ├── experience.vto      # Experience page
│   ├── projects.vto        # Projects page
│   └── certifications.vto  # Certifications page
└── dist/                   # Built site (generated)
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
