#!/bin/bash

set -eu

if [ -f ./dist/build-complete.txt ]; then
    echo "yes"
fi
