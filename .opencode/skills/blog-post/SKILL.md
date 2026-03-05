---
name: blog-post
description: Rules for creating and fixing blog posts — file naming, frontmatter schema, heading hierarchy, and content conventions
---

## What I cover

Rules for creating or editing Markdown blog posts in `src/blog/` of the deno-lume-portfolio project.

## File naming

- Always use the pattern `NNN-kebab-case-title.md` where NNN is the next number in sequence
- Check existing files in `src/blog/` to determine the correct NNN
- Kebab-case only — no spaces, no uppercase

## Frontmatter schema

```yaml
---
title: "Human readable title"
description: "One sentence description"
date: YYYY-MM-DD
tags:
  - Tag1
  - Tag2
---
```

- `title` must be a plain string — no emoji, no markdown
- `date` must be `YYYY-MM-DD` format
- Tags are auto-lowercased by `_config.ts` — write them in Title Case for readability

## Heading hierarchy

- The `title` frontmatter field renders as the page `<h1>` — **never add a `# Title` heading in the body**
- Use `##` for major sections, `###` for subsections only
- No emoji in any heading
- No numbered prefixes in headings (e.g. `## 1. Introduction` → `## Introduction`)
- Never nest a heading inside a list item

## Content rules

- No duplicate section headings within the same post
- Code blocks must have a language specifier (e.g. ` ```bash `, ` ```yaml `, ` ```typescript `)

## When creating a new post

1. Read `src/blog/` to find the next NNN number
2. Write the file to `src/blog/NNN-kebab-title.md`
3. Do not touch any file outside `src/blog/`
