#!/usr/bin/env bash
set -x
export DOCKER_BUILDKIT=1

function make-context-tarball() {
  tar -c \
    './app/build' \
    './Dockerfile' './server/build' './server/package.json' './server/yarn.lock'
}


make-context-tarball | docker build \
  "$@" \
  -f ./Dockerfile \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -