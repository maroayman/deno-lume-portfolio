#!/bin/sh
# Vercel build: pull digest-pinned cover images from GHCR, then build with Deno.
# Kept as a script because vercel.json `buildCommand` must stay <= 256 chars.
set -eu

ORAS_VERSION=1.2.0
curl -fsSL "https://github.com/oras-project/oras/releases/download/v${ORAS_VERSION}/oras_${ORAS_VERSION}_linux_amd64.tar.gz" -o /tmp/oras.tar.gz
mkdir -p "$HOME/.oras"
tar -zxf /tmp/oras.tar.gz -C "$HOME/.oras"
export PATH="$HOME/.oras:$PATH"
oras pull ghcr.io/maroayman/images@sha256:0f1ce542ac77052d3fbd4115661b762b654d5d296520fa1f13451d38be3dc4e1 -o .

DENO_VERSION=2.9.1
curl -fsSL https://deno.land/install.sh | sh -s "v${DENO_VERSION}"
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
deno task build:all
