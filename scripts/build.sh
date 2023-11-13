#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

app_release=$1

(
    cd "${root_dir}"
    npm run "build-${app_release}"
)
