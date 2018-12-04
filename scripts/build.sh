#!/bin/bash -e

rm -rf lib build
/usr/bin/env yarn tsc --project tsconfig.build.json
cp src/*.html lib
/usr/bin/env node lib
