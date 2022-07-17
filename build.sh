#!/usr/bin/env bash
set -x
PREBUILT_JS="${PREBUILT_JS:-1}"
export DOCKER_BUILDKIT=1

function make-context-tarball() {
  # a little trickery to include frontend assets into the tarball
  # (remapping the path to './assets' using -s, because Docker wants everything in the same directory)
  FRONTEND_EXCLUDES=$(
    printf -- "--exclude ../frontend/node_modules/" ;
    if [ $PREBUILT_JS = 0 ] ; then
      printf -- "--exclude ../frontend/build/" ;
    fi
  )
  FRONTEND_INCLUDES=$(
    if [ $PREBUILT_JS = 0 ] ; then
      printf "../frontend" ;
    else
      printf "../frontend/build" ;
    fi
  )
  tar -c \
    --exclude-vcs --exclude-from '.dockerignore' \
    $FRONTEND_EXCLUDES \
    -s '|../frontend/|./frontend/|' \
    $FRONTEND_INCLUDES \
    '.'
}

# ctx=$(mktemp) && make-context-tarball > $ctx && tar -t -f $ctx && exit 0;

make-context-tarball | docker build \
  "$@" \
  -f ./Dockerfile --build-arg "PREBUILT_JS=$PREBUILT_JS" \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -