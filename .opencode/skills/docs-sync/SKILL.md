---
name: docs-sync
description: Keep README/spec-kit/docs aligned with actual config and workflows
---

## What I cover

Rules for keeping documentation accurate and aligned with the codebase.

## Allowed files

- `README.md`
- `spec-kit.md`
- `DEPLOY.md`

## Never touch

- Source code unless explicitly asked

## Sync rules

- If build output dir changes, update all docs referencing it.
- If tasks change in `deno.json`, update docs/examples that mention them.
- If deployment settings change in `vercel.json`, reflect them in `DEPLOY.md`.

## Quality checks

- Ensure command snippets match actual `deno task` names.
- Avoid contradictory statements between `README.md` and `DEPLOY.md`.
