#!/usr/bin/env bash
set -eu -o pipefail;

BACKEND_PORT=8000

export DOCKER_BUILDKIT=1

function realpath() {
  # sigh, OSX... and we can't assume python either
  node -p 'require("fs").realpathSync(process.argv[1] ?? ".")' "$1"
}


docker build 'backend-server/' --tag 'skadinad/backend-server:dev'
docker run -d \
  -v "$(realpath ./dev-pages):/var/www/grav/user/pages" \
  -p "$BACKEND_PORT:80" \
  'skadinad/backend-server:dev'
docker ps --filter ancestor='skadinad/backend-server:dev' --format '{{.Names}}'