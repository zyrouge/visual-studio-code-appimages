#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

node_dir="/tmp/node"
node_version="20.9.0"
node_file="node-v${node_version}-linux-x64.tar.gz"

mkdir -p "${node_dir}"
(
    cd "/tmp"
    curl --fail "https://nodejs.org/dist/v${node_version}/${node_file}" -O
    tar -xzf "${node_file}"
    mv "${node_file}" "${node_dir}"
)
for x in "node" "npm" "npx"; do
    ln -s "${node_dir}/bin/${x}" "/usr/local/bin/${x}"
done

(
    cd "${root_dir}"
    npm install
)
