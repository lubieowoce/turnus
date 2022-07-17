function make-context-tarball() {
  # a little trickery to include frontend assets into the tarball
  # (remapping the path to './assets' using -s, because Docker wants everything in the same directory)
  tar -c \
    --exclude-vcs --exclude-from '.dockerignore' \
    --exclude '../frontend/build/' --exclude '../frontend/node_modules/' \
    -s '|../frontend/|./frontend/|' \
    '../frontend/' '.'
}
export DOCKER_BUILDKIT=1

make-context-tarball | docker build \
  "$@" \
  -f ./Dockerfile --build-arg ASSETS_SOURCE_DIR="./assets" \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -