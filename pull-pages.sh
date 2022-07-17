#!/usr/bin/env bash
set -eu -o pipefail;
CONTAINER_NAME='skadinad_backend_1'
REMOTE_PAGES_DIR='/var/www/grav/user/pages'
LOCAL_PAGES_DIR='./dev-pages'
SERVER_USER='xyz'
SERVER_GROUP='xyz'

export DOCKER_CONTEXT='skadinad-vps'

docker cp -a "$CONTAINER_NAME:$REMOTE_PAGES_DIR/places" "$LOCAL_PAGES_DIR"