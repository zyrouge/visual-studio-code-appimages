#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

export BUN_INSTALL=/tmp/bun

mkdir -p "$BUN_INSTALL"
curl -fsSL https://bun.sh/install | bash
ln -s "$BUN_INSTALL/bin/bun" /usr/local/bin/bun

(
    cd "${root_dir}"
    bun install --frozen-lockfile
)
