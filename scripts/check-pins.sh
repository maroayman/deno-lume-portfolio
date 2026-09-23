#!/bin/sh
# Fail unless the GHCR images digest pin is identical in CI, the local
# pull task, and the Vercel build script. Run via `deno task check:pins`;
# `scripts/push-images.sh -- --pin` rewrites all three atomically.
set -eu
cd "$(dirname "$0")/.."

pins=$(grep -rho "ghcr.io/maroayman/images@sha256:[0-9a-f][0-9a-f]*" \
  .github/workflows/ci.yml deno.json scripts/vercel-build.sh | sort -u)
count=$(printf "%s\n" "$pins" | wc -l)

echo "$pins"
if [ "$count" -ne 1 ]; then
  echo "error: images digest pin differs across files (see above)" >&2
  exit 1
fi
echo "pins consistent across ci.yml, deno.json, vercel-build.sh"
