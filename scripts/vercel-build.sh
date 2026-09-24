#!/bin/sh
# Vercel build: pull digest-pinned images from GHCR, then build with Deno.
# Kept as a script because vercel.json `buildCommand` must stay <= 256 chars.
# Every install step is idempotent (skipped when already present) so nothing
# downloads twice and retried builds resume cleanly. installCommand in
# vercel.json is a no-op; everything resolves here.
set -eu

ORAS_VERSION=1.3.4
INSTALLED_ORAS_VERSION=$("$HOME/.oras/oras" version 2>/dev/null | grep -o '[0-9][0-9.]*' | head -n 1 || true)
if [ "$INSTALLED_ORAS_VERSION" != "$ORAS_VERSION" ]; then
  curl -fsSL --retry 3 "https://github.com/oras-project/oras/releases/download/v${ORAS_VERSION}/oras_${ORAS_VERSION}_linux_amd64.tar.gz" -o /tmp/oras.tar.gz
  mkdir -p "$HOME/.oras"
  tar -zxf /tmp/oras.tar.gz -C "$HOME/.oras"
  rm -f /tmp/oras.tar.gz
fi
export PATH="$HOME/.oras:$PATH"
echo "oras: $(oras version 2>/dev/null | head -n 1)"
# Extract into a temp dir first: a hostile or corrupt artifact must never be
# able to write outside src/public/images via crafted member paths.
rm -rf ./_images-tmp
oras pull ghcr.io/maroayman/images@sha256:940ce46ff896b1cd76bfdeed1c950b8d91b7a545c7b53c3a8bb6573b188be256 -o ./_images-tmp
mkdir -p src/public/images
cp -r ./_images-tmp/src/public/images/. src/public/images/
rm -rf ./_images-tmp
IMAGE_COUNT=$(find src/public/images -type f | wc -l)
if [ "$IMAGE_COUNT" -eq 0 ]; then
  echo "error: oras pull restored 0 files from GHCR" >&2
  exit 1
fi
echo "images: $IMAGE_COUNT files restored from GHCR"

DENO_VERSION=$(cat .deno-version)
INSTALLED_DENO_VERSION=$("$HOME/.deno/bin/deno" --version 2>/dev/null | grep -o 'deno [0-9][0-9.]*' | awk '{print $2}' || true)
if [ "$INSTALLED_DENO_VERSION" != "$DENO_VERSION" ]; then
  curl -fsSL --retry 3 https://deno.land/install.sh | sh -s "v${DENO_VERSION}"
fi
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
echo "deno: $(deno --version | head -n 1)"
deno task build:all
