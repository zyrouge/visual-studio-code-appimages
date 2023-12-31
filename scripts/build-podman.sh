#!/bin/bash

set -eu

self=$(readlink -f "$0")
here=${self%/*}
root_dir=$(dirname "${here}")
dist_dir="${root_dir}/dist"

app_release=$1
container_name="visual-studio-code-appimages"
work_dir="/visual-studio-code-appimages"

echo "Starting container..."
podman run --rm -dti --network host --name "${container_name}" docker.io/library/ubuntu:20.04
podman wait --condition=running "${container_name}"

echo "Installing dependencies..."
podman exec "${container_name}" apt update
podman exec "${container_name}" apt-get install -y curl desktop-file-utils imagemagick file unzip

echo "Copying necessities..."
podman exec "${container_name}" mkdir "${work_dir}"
for x in "package.json" "package-lock.json" "tsconfig.json" "cli" "scripts" "templates"; do
    podman cp "./${x}" "${container_name}:${work_dir}/${x}"
done
podman exec "${container_name}" find "${work_dir}/scripts" -type f -name "*.sh" -exec chmod +x {} \;

echo "Starting build..."
podman exec "${container_name}" "${work_dir}/scripts/deps.sh"
podman exec "${container_name}" "${work_dir}/scripts/build.sh" "${app_release}"

echo "Copying build artifacts..."
podman cp "${container_name}:${work_dir}/dist" "${dist_dir}"

echo "Stopping container..."
podman stop "${container_name}"

echo "Done!"
