#!/usr/bin/env bash
set -eu -o pipefail

export DOCKER_BUILDKIT=1

pushd frontend
./build.sh --tag 'skadinad/frontend-server' --no-cache
popd

pushd backend-server
docker build . --tag skadinad/backend-server
popd

pushd proxy
docker build . --tag skadinad/proxy
popd