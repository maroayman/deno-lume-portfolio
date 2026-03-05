---
description: Stage all changes, commit with a message, and push to origin main
---

Run the following git commands in sequence. Stop and report if any step fails.

Commit message to use: $ARGUMENTS

Steps:
1. `git add -A`
2. `git commit -m "$ARGUMENTS"`
3. `git push origin main`

Important:
- Never stage or commit `resume.json`, `main.typ`, or anything in `_cache/` — they are gitignored and will not be included by `git add -A`, but verify with `git status` first
- If the working tree is clean (nothing to commit), report that and stop
- Report the commit hash and push result when done
