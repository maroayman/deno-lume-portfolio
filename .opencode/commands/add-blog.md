---
description: Create a new blog post with correct naming, frontmatter, and heading structure
agent: blog-post
subtask: true
---

Create a new blog post titled: $ARGUMENTS

Follow all rules in the blog-post agent exactly:
- Determine the next NNN number by reading existing files in `src/blog/`
- Use the title to generate the kebab-case filename: `NNN-kebab-case-title.md`
- Write proper frontmatter with today's date
- Body should use `##` / `###` headings only — no `#` heading in the body
- Suggest 2–4 relevant tags based on the topic
