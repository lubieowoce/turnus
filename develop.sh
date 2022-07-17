#!/usr/bin/env bash
set -eu -o pipefail;

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
    -p '8000:80' \
    'skadinad/backend-server'
else
  echo 'Backend server already running'
  docker ps --filter ancestor='skadinad/backend-server'
fi

cd frontend/
yarn run start