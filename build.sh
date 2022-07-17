#!/usr/bin/env bash
set -eu -o pipefail

DIR="$PWD"

# pushd frontend
# yarn run build
# popd

export DOCKER_BUILDKIT=1

pushd frontend-server
./build.sh --tag 'skadinad/frontend-server'
# # old version without tar magic:
# [ -d frontend-server/assets ] && rm -rf frontend-server/assets
# cp -R frontend/build frontend-server/assets/
# docker build . -t skadinad/frontend-server --build-arg ASSETS_SOURCE_DIR="./assets"
popd

pushd backend-server
docker build . --tag skadinad/backend-server
popd