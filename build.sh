#!/usr/bin/env bash
set -eu -o pipefail

BUILD_JS="${BUILD_JS:-0}"
if [ $BUILD_JS = 1 ]; then
  pushd frontend
  yarn run build
  popd
  export PREBUILT_JS=1
else
  echo 'skipping JS build (enable with BUILD_JS=1)'
fi

export DOCKER_BUILDKIT=1

pushd frontend-server
./build.sh --tag 'skadinad/frontend-server'
popd

pushd backend-server
docker build . --tag skadinad/backend-server
popd