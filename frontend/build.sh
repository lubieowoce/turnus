#!/usr/bin/env bash
set -eu -o pipefail
set -x
export DOCKER_BUILDKIT=1

function make-context-tarball() {
  tar -c \
    './Dockerfile' \
    './app/build' \
    './server/build'
}

npx turbo run build

make-context-tarball | docker build \
  "$@" \
  -f ./Dockerfile \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -