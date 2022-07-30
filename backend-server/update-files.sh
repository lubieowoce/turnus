#!/bin/bash
set -eu -o pipefail;

TEMPLATE_DIR="$1"
TARGET_DIR="$2"

# copy over our site template

cd $TEMPLATE_DIR
for FILE in $(find -type f \! -name .gitignore -printf '%P\n'); do
  DEST="$TARGET_DIR/$FILE"
  mkdir -p $(dirname "$DEST")
  echo "copying $FILE --> $DEST"
  cp "$FILE" "$DEST"
done

chown -R xyz "$TARGET_DIR"
chgrp -R xyz "$TARGET_DIR"

# we just copied our stuff to the user/ dir.
# unfortunately, having stuff in user/ will make the docker-grav init-admin script
# skip copying the user/ dir from the base grav install.
# which means we won't get any plugins, so no admin interface!
# (it'd be cleaner to just change init-admin altogether, because we're unzipping twice,
#  but this easier for now)

# this is adapted from the main docker-grav init-admin script,
# but changed to only extract & copy plugins)

mkdir -p $TARGET_DIR
if [[ -f '/grav/grav.zip' ]]; then
  WORKING_DIR=$(mktemp -d);
  echo "copying plugins from /grav/grav.zip... (working directory: $WORKING_DIR)";
  unzip -q '/grav/grav.zip' 'grav-admin/user/plugins/*' -d "$WORKING_DIR"
  cp -r "$WORKING_DIR"/grav-admin/user/plugins/* "$TARGET_DIR/plugins/"
  echo "copied plugins:"
  ls "$TARGET_DIR/plugins/"
  rm -rf "$WORKING_DIR"
fi
