#!/usr/bin/env bash
set -eu -o pipefail

# pushd frontend
# yarn run build
# popd

export DOCKER_BUILDKIT=1

pushd frontend-server
./build.sh --tag 'skadinad/frontend-server'
popd

pushd backend-server
docker build . --tag skadinad/backend-server
popd