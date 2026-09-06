---
name: docs-sync
description: Keep README and docs aligned with actual config and workflows
---

## What I cover

Rules for keeping documentation accurate and aligned with the codebase.

## Allowed files

- `README.md`

## Never touch

- Source code unless explicitly asked

## Sync rules

- If build output dir changes, update all docs referencing it.
- If tasks change in `deno.json`, update docs/examples that mention them.
- If deployment settings change in `vercel.json`, reflect them in `README.md`.

## Quality checks

- Ensure command snippets match actual `deno task` names.
- Avoid contradictory statements within `README.md`.
