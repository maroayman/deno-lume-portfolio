---
description: Update resume data and recompile the PDF
agent: resume
subtask: true
---

The user wants to update the resume. $ARGUMENTS

Follow the resume agent workflow exactly:
1. Ask the user what they want to change if $ARGUMENTS is empty
2. Edit `resume.json` with the requested changes
3. Run `deno task resume` to recompile `src/resume.pdf`
4. Stage `src/resume.pdf` with `git add src/resume.pdf`
5. Report what changed — do not commit, leave that to the user
