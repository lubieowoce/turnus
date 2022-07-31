#!/usr/bin/env bash
set -eu -o pipefail;
CONTAINER_NAME='skadinad_backend_1'
REMOTE_PAGES_DIR='/var/www/grav/user/pages'
LOCAL_PAGES_DIR='./dev-pages'
SERVER_USER='xyz'
SERVER_GROUP='xyz'

export DOCKER_CONTEXT='skadinad-vps'

docker cp "$LOCAL_PAGES_DIR/places" "$CONTAINER_NAME:$REMOTE_PAGES_DIR"
docker cp "$LOCAL_PAGES_DIR/events" "$CONTAINER_NAME:$REMOTE_PAGES_DIR"
docker exec "$CONTAINER_NAME" /bin/sh -c "
chown -R $SERVER_USER $REMOTE_PAGES_DIR
chgrp -R $SERVER_GROUP $REMOTE_PAGES_DIR
"