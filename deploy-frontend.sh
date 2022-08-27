#!/usr/bin/env bash
set -eu -o pipefail

REMOTE_CONTEXT='skadinad-vps'
export LC_ALL=C

echo 'deploying frontend...'
(
  cd frontend;
  DOCKER_CONTEXT="$REMOTE_CONTEXT" ./build.sh --tag 'skadinad/frontend-server' --no-cache
)
docker-compose --context "$REMOTE_CONTEXT" stop frontend
docker-compose --context "$REMOTE_CONTEXT" up --detach frontend
docker --context "$REMOTE_CONTEXT" image prune --force
