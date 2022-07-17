#!/usr/bin/env bash
set -eu -o pipefail;

REMOTE_CONTEXT='skadinad-vps'
export LC_ALL=C

echo 'deploying...' \
  && DOCKER_CONTEXT="$REMOTE_CONTEXT" ./build.sh \
  `# && docker-compose --context "$REMOTE_CONTEXT" down` \
  && docker-compose --context "$REMOTE_CONTEXT" up --detach \
  && docker --context "$REMOTE_CONTEXT" image prune --force
