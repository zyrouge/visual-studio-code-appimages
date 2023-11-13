#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

export BUN_INSTALL=/tmp/bun
export PATH="$PATH:$BUN_INSTALL/bin"

mkdir -p "$BUN_INSTALL"
curl -fsSL https://bun.sh/install | bash

(
    cd "${root_dir}"
    bun install --frozen-lockfile
)
