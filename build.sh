#!/usr/bin/env bash
set -eu -o pipefail

BUILD_JS="${BUILD_JS:-0}"
if [ $BUILD_JS = 1 ]; then
  pushd frontend/app
  yarn run build
  popd
  pushd frontend/server
  yarn run build
  popd
else
  echo 'skipping JS build (enable with BUILD_JS=1)'
fi

export DOCKER_BUILDKIT=1

pushd frontend
./build.sh --tag 'skadinad/frontend-server' --no-cache
popd

pushd backend-server
docker build . --tag skadinad/backend-server
popd