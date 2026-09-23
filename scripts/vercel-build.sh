#!/bin/sh
# Vercel build: pull digest-pinned images from GHCR, then build with Deno.
# Kept as a script because vercel.json `buildCommand` must stay <= 256 chars.
# Every install step is idempotent (skipped when already present) so nothing
# downloads twice and retried builds resume cleanly. installCommand in
# vercel.json is a no-op; everything resolves here.
set -eu

ORAS_VERSION=1.2.0
if ! "$HOME/.oras/oras" version >/dev/null 2>&1; then
  curl -fsSL "https://github.com/oras-project/oras/releases/download/v${ORAS_VERSION}/oras_${ORAS_VERSION}_linux_amd64.tar.gz" -o /tmp/oras.tar.gz
  mkdir -p "$HOME/.oras"
  tar -zxf /tmp/oras.tar.gz -C "$HOME/.oras"
fi
export PATH="$HOME/.oras:$PATH"
echo "oras: $(oras version 2>/dev/null | head -n 1)"
oras pull ghcr.io/maroayman/images@sha256:0f1ce542ac77052d3fbd4115661b762b654d5d296520fa1f13451d38be3dc4e1 -o .
echo "images: $(find src/public/images -type f | wc -l) files restored from GHCR"

DENO_VERSION=2.9.1
if [ ! -x "$HOME/.deno/bin/deno" ]; then
  curl -fsSL https://deno.land/install.sh | sh -s "v${DENO_VERSION}"
fi
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
echo "deno: $(deno --version | head -n 1)"
deno task build:all
