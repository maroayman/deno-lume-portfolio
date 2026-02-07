---
description: How to update content and deploy the Lume portfolio
---

// turbo-all

## Update Content Workflow

### 1. Make your content changes

Edit files in `src/`:

- `src/_data/*.json` - Data files (experiences, projects, certifications)
- `src/*.vto` - Page templates
- `src/styles/main.css` - Styles

### 2. Build locally (optional, to preview)

```bash
cd ~/portfolio/deno-lume-portfolio
deno task serve
```

### 3. Build for production

```bash
cd ~/portfolio/deno-lume-portfolio
deno task build:all
```

This runs:

- Lume build → generates HTML/CSS to `dist/`
- Workbox → generates `sw.js` with precache manifest

### 4. Deploy to Vercel

```bash
cd ~/portfolio/deno-lume-portfolio
git add -A
git commit -m "Update content"
git push
```

Vercel automatically builds and deploys on push.

### Notes

- The service worker precache manifest updates automatically during build
- Returning visitors will see a "New version available" prompt
- No manual cache busting needed - Workbox handles versioning via file hashes
