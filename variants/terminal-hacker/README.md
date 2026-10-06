# Variant: terminal-hacker

Saved 2026-10-06. A full restyle of the site in the alialjaffer.com voice —
minimal mono terminal, narrow column — taken one step further into a
dark "hacker" mood (near-black + phosphor green).

The live site was reverted to the original Cairo style. This folder is a
reference snapshot so improvements can be cherry-picked later.

## What's inside (paths mirror the repo root)

- `src/styles/main.css` — the whole variant: neutral→hacker tokens,
  sticky glass masthead, terminal hero card, numbered sections, card rows,
  pill tags, hybrid tag sheet, scroll-spy + hacker accent layers.
- `src/index.vto` — hero terminal card, hero-links, copy-mail button,
  section ids, Index grid.
- `src/_includes/layouts/base.vto` — pill nav with docked theme toggle,
  status-dot mark, pill status footer with foot-links.
- `src/_components/page_header.vto` — `num` prop (`01 / About` headers).
- `src/assets/site-common.js` — scroll-spy (`section-active`) + copy-mail.
- `_config.ts` — PurgeCSS safelist addition (`section-active`).
- `src/blog.vto`, `src/projects.vto`, `src/experience.vto`,
  `src/certifications.vto`, `src/uses.vto` — Arabic props dropped,
  certifications as dotted-leader rows.

## Cherry-pick guide

- Just the bug fix: keep `overflow: visible` on `.blog-search-container`
  (the tag dropdown was clipped by `overflow: hidden`).
- Just the addons: copy the `COPY EMAIL` + `SCROLL-SPY` blocks from
  `site-common.js`, the `.copy-mail` / `section-active` CSS, and add the
  safelist line in `_config.ts`.
- Just the toggle-in-nav: the `base.vto` masthead block + `.masthead-nav`
  pill CSS.

## To preview this variant

```bash
# from repo root — back up live files first, then overlay the variant:
mkdir -p /tmp/live-backup
for f in $(cd variants/terminal-hacker && find . -type f ! -name 'README.md'); do
  mkdir -p "/tmp/live-backup/$(dirname "$f")"
  cp "$f" "/tmp/live-backup/$f"
  cp "variants/terminal-hacker/$f" "$f"
done
deno task build
# ...to go back: copy /tmp/live-backup/* over the repo root.
```

Simpler: `diff -u` any file here against its live twin, e.g.
`diff src/index.vto variants/terminal-hacker/src/index.vto`.
