---
name: resume
description: Workflow for updating resume data and recompiling the PDF via Typst — never commits source files
---

## What I cover

Step-by-step workflow for updating the resume in the deno-lume-portfolio project.

## Workflow — always in this exact order

1. **Edit `resume.json`** with the requested changes
2. **Run `deno task resume`** — compiles `main.typ` → `src/resume.pdf` using Typst
3. **Verify compilation** — check the command exited cleanly (no errors)
4. **Stage only the PDF**: `git add src/resume.pdf`
5. **Report** what changed and that `src/resume.pdf` is staged, ready to commit

## Hard rules

- **Never commit or stage `resume.json`** — it is gitignored and local-only
- **Never commit or stage `main.typ`** — it is gitignored and local-only
- Only `src/resume.pdf` should ever be staged from this work
- If `deno task resume` fails, report the error and stop — do not stage anything

## File locations

- Resume data: `resume.json` (project root, gitignored)
- Typst template: `main.typ` (project root, gitignored)
- Compiled output: `src/resume.pdf` (tracked in git, served at `/resume.pdf`)
- Typst binary: `$HOME/.local/bin/typst` (v0.14.2)

## resume.json structure

The file follows the `kiresume:0.1.17` Typst package schema. Key sections:

- `basics` — name, label, summary, contact info
- `skills` — array of `{ name, keywords[] }`
- `work` — array of `{ name, position, startDate, endDate, highlights[] }`
- `education` — array of `{ institution, area, studyType, startDate, endDate }`
- `projects` — array of `{ name, description, highlights[], keywords[] }`

Dates in `work`/`education` use `"YYYY-MM-DD"` or `"YYYY-MM"` format.
