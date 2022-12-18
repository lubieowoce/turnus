#!/usr/bin/env bash
set -eu -o pipefail;

BACKEND_PORT=8000
DEV_VOLUME_NAME='skadinad-dev-local-volume'

export DOCKER_BUILDKIT=1

# ensure the volume exists
docker volume inspect "$DEV_VOLUME_NAME" || docker volume create "$DEV_VOLUME_NAME"

function realpath() {
  # sigh, OSX... and we can't assume python either
  node -p 'require("fs").realpathSync(process.argv[1] ?? ".")' "$1"
}

RUNNING=$(docker ps --filter ancestor='skadinad/backend-server' --format '{{.ID}}' | wc -l)
if [ $RUNNING = 0 ]; then
  echo 'No backend server running, initializing'
  docker build 'backend-server/' --tag 'skadinad/backend-server'
  docker run -d \
    -v "$PLACES_DIR:/var/www/grav/user/pages/places" \
    -v "$(realpath ./dev-pages/events):/var/www/grav/user/pages/events" \
    -v "$DEV_VOLUME_NAME:/var/www/grav/user/accounts" \
    -p "$BACKEND_PORT:80" \
    'skadinad/backend-server'
else
  echo 'Backend server already running'
  docker ps --filter ancestor='skadinad/backend-server'
fi

cd frontend/app
BACKEND_HOST="localhost:$BACKEND_PORT" yarn run start