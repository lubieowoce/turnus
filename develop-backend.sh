#!/usr/bin/env bash
set -eu -o pipefail;

BACKEND_PORT=8000
DEV_VOLUME_NAME='skadinad-dev-local-volume'
TAG='skadinad/backend-server:dev'

export DOCKER_BUILDKIT=1

function realpath() {
  # sigh, OSX... and we can't assume python either
  node -p 'require("fs").realpathSync(process.argv[1] ?? ".")' "$1"
}

# stop last container if any
RUNNING=$(docker ps --filter ancestor="$TAG" --format '{{.ID}}')
if [ $(echo $RUNNING | wc -l) != 0 ]; then
  echo "stopping existing containers for '$TAG'"
  for CONTAINER in $RUNNING; do
    docker stop $CONTAINER
  done
fi

# ensure the volume exists
docker volume inspect "$DEV_VOLUME_NAME" || docker volume create "$DEV_VOLUME_NAME"

docker build 'backend-server/' --tag "$TAG"
docker run --rm -d \
  -v "$(realpath ./dev-pages/places):/var/www/grav/user/pages/places" \
  -v "$(realpath ./dev-pages/events):/var/www/grav/user/pages/events" \
  -v "$DEV_VOLUME_NAME:/var/www/grav/user/accounts" \
  -p "$BACKEND_PORT:80" \
  "$TAG"
docker ps --filter ancestor="$TAG" --format '{{.Names}}'