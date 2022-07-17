#!/usr/bin/env bash
set -eu -o pipefail;

BACKEND_PORT=8000

export DOCKER_BUILDKIT=1

function realpath() {
  # sigh, OSX... and we can't assume python either
  node -p 'require("fs").realpathSync(process.argv[1] ?? ".")' "$1"
}

RUNNING=$(docker ps --filter ancestor='skadinad/backend-server' --format '{{.ID}}' | wc -l)
if [ $RUNNING = 0 ]; then
  echo 'No backend server running, initializing'
  docker build 'backend-server/' --tag 'skadinad/backend-server'
  docker run -d \
    -v "$(realpath ./dev-pages):/var/www/grav/user/pages" \
    -p "$BACKEND_PORT:80" \
    'skadinad/backend-server'
else
  echo 'Backend server already running'
  docker ps --filter ancestor='skadinad/backend-server'
fi

cd frontend/
BACKEND_HOST="localhost:$BACKEND_PORT" yarn run start