#!/usr/bin/env bash
set -eu -o pipefail;
CONTAINER_NAME='skadinad_backend_1'
PLACES_DIR='./dev-pages/pages/places/'
SERVER_USER='xyz'
SERVER_GROUP='xyz'

export DOCKER_CONTEXT='skadinad-vps'
docker cp "$PLACES_DIR" "$CONTAINER_NAME:/var/www/grav/user/pages/"
docker exec "$CONTAINER_NAME" /bin/sh -c "
chown -R $SERVER_USER /var/www/grav/user/pages/
chgrp -R $SERVER_GROUP /var/www/grav/user/pages/
"