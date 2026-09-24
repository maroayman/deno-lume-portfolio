#!/bin/sh
# Push src/public/images to GHCR as an OCI artifact (full set, :latest),
# then optionally pin the new digest in CI / local task / Vercel build script.
#
# Usage:
#   bash scripts/push-images.sh [--dry-run] [--pin] [tag]
#
#   --dry-run   list files that would be pushed, push nothing
#   --pin       after pushing, rewrite the sha256 pin in
#               .github/workflows/ci.yml, deno.json, scripts/vercel-build.sh
#   tag         registry tag to push (default: latest)
#
# Requires: oras login beforehand (never paste tokens into chat):
#   echo "$CR_PAT" | oras login ghcr.io -u maroayman --password-stdin
set -eu

DRY_RUN=0
PIN=0
TAG="latest"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --pin) PIN=1 ;;
    --) ;; # bare separator forwarded by `deno task x -- ...`
    -h|--help)
      sed -n '2,/^set /p' "$0"
      exit 0
      ;;
    *) TAG="$arg" ;;
  esac
done

cd "$(dirname "$0")/.."
REGISTRY="ghcr.io/maroayman/images"

# mktemp avoids collisions between parallel runs and guarantees cleanup.
LIST_FILE=$(mktemp /tmp/opencode-images-list.XXXXXX)
PUSH_LOG=$(mktemp /tmp/opencode-oras-push.XXXXXX)
trap 'rm -f "$LIST_FILE" "$PUSH_LOG"' EXIT INT TERM

command -v oras >/dev/null 2>&1 || {
  echo "error: oras not found (local: /usr/local/bin/oras, CI: oras-project/setup-oras)" >&2
  exit 1
}

if [ ! -d src/public/images ]; then
  echo "error: src/public/images missing — nothing to push" >&2
  exit 1
fi

# Collect files as <path>:<media-type>, preserving repo-relative titles so
# `oras pull ... -o .` restores src/public/images/... exactly.
find src/public/images -type f | sort | while IFS= read -r f; do
  case "$f" in
    *.jpg|*.jpeg) printf '%s:%s\n' "$f" "image/jpeg" ;;
    *.png) printf '%s:%s\n' "$f" "image/png" ;;
    *.webp) printf '%s:%s\n' "$f" "image/webp" ;;
    *.svg) printf '%s:%s\n' "$f" "image/svg+xml" ;;
    *.avif) printf '%s:%s\n' "$f" "image/avif" ;;
    *.gif) printf '%s:%s\n' "$f" "image/gif" ;;
    *) printf '%s:%s\n' "$f" "application/octet-stream" ;;
  esac
done >"$LIST_FILE"

if [ ! -s "$LIST_FILE" ]; then
  echo "error: no files under src/public/images" >&2
  exit 1
fi

if [ "$DRY_RUN" = "1" ]; then
  echo "Would push $REGISTRY:$TAG with $(wc -l < "$LIST_FILE") file(s):"
  cat "$LIST_FILE"
  exit 0
fi

# shellcheck disable=SC2046
oras push "$REGISTRY:$TAG" $(cat "$LIST_FILE") 2>&1 | tee "$PUSH_LOG"
DIGEST=$(grep -o 'sha256:[0-9a-f]\{64\}' "$PUSH_LOG" | tail -n 1)

if [ -z "${DIGEST:-}" ]; then
  echo "error: could not parse digest from oras output" >&2
  exit 1
fi

echo "Pushed $REGISTRY:$TAG"
echo "Pinned: $REGISTRY@$DIGEST"

if [ "$PIN" = "1" ]; then
  # NOTE: `sed -i` without suffix is GNU sed (Linux). On macOS/BSD use
  # `sed -i ''` or run the --pin step on Linux/CI.
  for f in .github/workflows/ci.yml deno.json scripts/vercel-build.sh; do
    sed -i "s|ghcr.io/maroayman/images@sha256:[0-9a-f]\\{64\\}|ghcr.io/maroayman/images@$DIGEST|" "$f"
  done
  echo "Updated pin in .github/workflows/ci.yml, deno.json, scripts/vercel-build.sh"
  grep -rho "ghcr.io/maroayman/images@sha256:[0-9a-f]\\{64\\}" .github/workflows/ci.yml deno.json scripts/vercel-build.sh | sort -u
fi
