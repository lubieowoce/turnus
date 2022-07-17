#!/usr/bin/env bash
set -eu -o pipefail;
IMAGE_NAME=$1
if [ -z "$IMAGE_NAME" ]; then
  echo "argument 1 (image name) required"
  exit 1;
fi;
REMOTE_CONTEXT='skadinad-vps'
echo "maybe pushing $IMAGE_NAME..."
LOCAL_IMAGE_ID=$(docker --context default image inspect --format '{{json .Id}}' $IMAGE_NAME)
REMOTE_IMAGE_ID=$(docker --context $REMOTE_CONTEXT image inspect --format '{{json .Id}}' $IMAGE_NAME || printf '')
echo "$IMAGE_NAME: local image:  '$LOCAL_IMAGE_ID'"
echo "$IMAGE_NAME: remote image: '$REMOTE_IMAGE_ID'"
if [ "$LOCAL_IMAGE_ID" = "$REMOTE_IMAGE_ID" ]; then
  echo "$IMAGE_NAME: remote is already up to date: '$LOCAL_IMAGE_ID'"
  echo "$IMAGE_NAME: skipping push"
  exit 0;
fi
echo "$IMAGE_NAME: ids not equal: '$LOCAL_IMAGE_ID' '$REMOTE_IMAGE_ID'"
echo "$IMAGE_NAME: starting push..."
docker --context default save $IMAGE_NAME | bzip2 | pv | docker --context $REMOTE_CONTEXT load
