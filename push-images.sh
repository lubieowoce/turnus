#!/usr/bin/env bash
set -eu -o pipefail;

IMAGE_NAMES='skadinad/frontend-server skadinad/backend-server'
printf $'%s\n' $IMAGE_NAMES | xargs -n1 -P4 ./sync-image.sh
