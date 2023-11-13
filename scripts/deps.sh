#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

(
    cd "${root_dir}"
    bun install --frozen-lockfile
)
