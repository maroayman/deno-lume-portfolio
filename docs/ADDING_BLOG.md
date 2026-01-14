# Adding a Blog to Your Lume Portfolio

This guide documents how to add a blog section to your Lume v3 portfolio.

## Prerequisites

Your site is already on **Lume v3.1.4** which supports all required features.

---

## Step 1: Update deno.json

Add the markdown plugins for TOC support:

```json
{
    "imports": {
        "lume/": "https://deno.land/x/lume@v3.1.4/",
        "lume_markdown_plugins/": "https://deno.land/x/lume_markdown_plugins@v0.10.0/"
    }
}
```

---

## Step 2: Update _config.ts

Add these plugins:

```typescript
import lume from "lume/mod.ts";
import vento from "lume/plugins/vento.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import date from "lume/plugins/date.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import toc from "lume_markdown_plugins/toc.ts";

const site = lume({
    src: "./src",
    dest: "./dist",
    location: new URL("https://yourportfolio.com"),
});

site.use(vento());
site.use(date());
site.use(readingInfo());    // Auto reading time
site.use(codeHighlight());   // Syntax highlighting
site.use(toc());             // Table of contents

site.add("styles");
site.add("assets");
site.add("public", ".");
site.add([".pdf"]);

site.use(postcss());
site.use(terser());
site.use(sitemap());
site.use(minifyHTML());

export default site;
```

---

## Step 3: Create Blog Structure

### 3.1 Create `src/blog/_data.yml`

```yaml
layout: layouts/post.vto
type: post
```

### 3.2 Create `src/blog.vto` (Blog listing page)

```html
---
layout: layouts/base.vto
title: Blog
---

<h2>Blog</h2>
<p>Articles on DevOps, Cloud, and Infrastructure.</p>

<div class="blog-list">
  {{ for post of search.pages("type=post", "date=desc") }}
  <a href="{{ post.url }}" class="blog-card">
    <h3>{{ post.title }}</h3>
    <p>{{ post.description }}</p>
    <div class="blog-card-meta">
      <time>{{ post.date |> date('HUMAN_DATE') }}</time>
      <span>{{ post.readingInfo?.minutes || "5" }} min read</span>
    </div>
  </a>
  {{ /for }}
</div>
```

### 3.3 Create `src/_includes/layouts/post.vto`

```html
---
layout: layouts/base.vto
---

<article class="blog-post">
  <a href="/blog/" class="back-link">← Back to Blog</a>
  
  <h1 class="post-title">{{ title }}</h1>
  
  <p class="post-meta">
    {{ date |> date('HUMAN_DATE') }} · {{ readingInfo?.minutes || "5" }} min read
  </p>
  
  {{ if tags }}
  <div class="post-tags">
    {{ for tag of tags }}
    <span class="tag">{{ tag }}</span>
    {{ /for }}
  </div>
  {{ /if }}
  
  {{ if toc && toc.length > 1 }}
  <nav class="toc">
    <p class="toc-title">Contents</p>
    <ul>
      {{ for item of toc }}
      <li><a href="#{{ item.slug }}">{{ item.text }}</a></li>
      {{ /for }}
    </ul>
  </nav>
  {{ /if }}
  
  <div class="post-content">
    {{ content }}
  </div>
  
  <div class="post-footer">
    <a href="/blog/">← Back to Blog</a>
  </div>
</article>
```

---

## Step 4: Create Blog Posts

Create markdown files in `src/blog/`:

```markdown
---
title: My First Post
description: A brief description of the post
date: 2026-01-14
tags:
  - DevOps
  - Kubernetes
---

## Introduction

Your content here...

## Getting Started

More content...
```

---

## Step 5: Add Blog Styles

Add to `src/styles/main.css`:

```css
/* Blog Listing */
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.blog-card {
  display: block;
  padding: 1.5rem 0;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
}

.blog-card:hover {
  color: var(--color-link);
}

.blog-card h3 {
  margin-bottom: 0.5rem;
}

.blog-card-meta {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* Post Layout */
.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.post-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  color: var(--color-link);
  background: rgba(0, 102, 204, 0.08);
  border-radius: 3px;
}

/* TOC */
.toc {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1.25rem;
  margin: 2rem 0;
}

.toc-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem !important;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc li {
  margin-bottom: 0.4rem;
}

.toc a {
  font-size: 0.9rem;
  color: var(--color-text);
}

/* Post Content */
.post-content {
  line-height: 1.75;
}

.post-content h2 {
  font-size: 1.25rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--color-link);
}

.post-content pre {
  background: #1c1c1c;
  color: #d4d4d4;
  padding: 1.25rem;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-content code {
  font-family: 'SF Mono', monospace;
  font-size: 0.85em;
  background: var(--color-border);
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

.post-content pre code {
  background: none;
  padding: 0;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}
```

---

## Step 6: Add Blog Link to Homepage

In `src/index.vto`, add to the section-links:

```html
<a href="/blog" class="section-link">
  <strong>Blog</strong><br>
  Articles and guides on DevOps, Cloud, and Infrastructure.
</a>
```

---

## Features Included

- ✅ Syntax highlighting (code blocks)
- ✅ Auto reading time calculation
- ✅ Table of contents (auto-generated from headings)
- ✅ Tags support
- ✅ Date formatting
- ✅ Dark mode support

---

## Optional Enhancements

### Reading Progress Bar

Add to post template:
```html
<div class="reading-progress" id="readingProgress"></div>
```

Add CSS:
```css
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--color-link);
  width: 0%;
  z-index: 1000;
}
```

Add JS:
```javascript
const progressBar = document.getElementById('readingProgress');
window.addEventListener('scroll', () => {
  const article = document.querySelector('.post-content');
  const progress = Math.min(Math.max((window.scrollY - article.offsetTop) / article.offsetHeight, 0), 1);
  progressBar.style.width = (progress * 100) + '%';
});
```

### Copy Code Button

Add JS:
```javascript
document.querySelectorAll('pre').forEach(pre => {
  const button = document.createElement('button');
  button.className = 'copy-btn';
  button.textContent = 'Copy';
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.textContent || pre.textContent);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
  });
  pre.style.position = 'relative';
  pre.appendChild(button);
});
```

---

## Commands

```bash
# Development
deno task serve

# Build
deno task build
```
