#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

if [ -f "${root_dir}/dist/build-complete.txt" ]; then
    echo "yes"
fi
