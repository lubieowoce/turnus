#!/usr/bin/env bash
set -eu -o pipefail
set -x
export DOCKER_BUILDKIT=1

function make-context-tarball() {
  tar -c \
    './Dockerfile' \
    './yarn.lock' './package.json' \
    './app/build' `#'./app/package.json'` \
    './server/build' './server/package.json'
}

npx turbo run build

make-context-tarball | docker build \
  "$@" \
  -f ./Dockerfile \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -