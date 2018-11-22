#!/bin/bash -e

rm -rf lib build
node_modules/.bin/tsc --project tsconfig.build.json
/usr/bin/env node lib
