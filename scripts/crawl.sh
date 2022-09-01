#!/bin/bash
DIR="$(dirname $0)"
exec node --experimental-fetch "$DIR/crawl.js"