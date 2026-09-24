#!/bin/sh
# Fail unless the GHCR images digest pin is identical in CI, the local
# pull task, and the Vercel build script. Run via `deno task check:pins`;
# `scripts/push-images.sh -- --pin` rewrites all three atomically.
set -eu
cd "$(dirname "$0")/.."

pins=$(grep -rho "ghcr.io/maroayman/images@sha256:[0-9a-f][0-9a-f]*" \
  .github/workflows/ci.yml deno.json scripts/vercel-build.sh 2>/dev/null || true)
if [ -z "$pins" ]; then
  echo "error: no images digest pin found in ci.yml, deno.json, vercel-build.sh" >&2
  exit 1
fi
pins=$(printf "%s\n" "$pins" | sort -u)
count=$(printf "%s\n" "$pins" | wc -l)

echo "$pins"
if [ "$count" -ne 1 ]; then
  echo "error: images digest pin differs across files (see above)" >&2
  exit 1
fi
echo "pins consistent across ci.yml, deno.json, vercel-build.sh"

# Lume must resolve to the same version in imports and lint plugins —
# bumping one `lume@x.y.z` in deno.json without the other skews lint vs build.
lume_pins=$(grep -o "lumeland/lume@[0-9][0-9.]*" deno.json | sort -u)
if [ "$(printf "%s\n" "$lume_pins" | wc -l)" -ne 1 ]; then
  echo "error: lume version differs across deno.json entries (see above)" >&2
  printf "%s\n" "$lume_pins" >&2
  exit 1
fi
echo "lume consistent across deno.json ($lume_pins)"
