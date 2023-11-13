#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")

node_version="20.9.0"
node_dir="/tmp/node"

curl --fail \
    "https://nodejs.org/dist/v${node_version}/node-v${node_version}-linux-x64.tar.gz" \
    -o "/tmp/node-v${node_version}-linux-x64.tar.gz"
tar -xzvf "/tmp/node-v${node_version}-linux-x64.tar.gz" -C "/tmp" "node-v${node_version}-linux-x64"
mv "/tmp/node-v${node_version}-linux-x64" "${node_dir}"

for x in "node" "npm" "npx"; do
    ln -s "${node_dir}/bin/${x}" "/usr/local/bin/${x}"
done

(
    cd "${root_dir}"
    npm install
)
