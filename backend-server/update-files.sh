#!/bin/bash
set -eu -o pipefail;

TEMPLATE_DIR="$1"
TARGET_DIR="$2"

cd $TEMPLATE_DIR
for FILE in $(find -type f \! -name .gitkeep \! -name .gitignore -printf '%P\n'); do
  DEST="$TARGET_DIR/$FILE"
  mkdir -p $(dirname "$DEST")
  echo "copying $FILE --> $DEST"
  cp "$FILE" "$DEST"
done

chown -R xyz "$TARGET_DIR"
chgrp -R xyz "$TARGET_DIR"
