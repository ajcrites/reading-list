#!/bin/bash -e

rm -rf lib build
/usr/bin/env yarn tsc --project tsconfig.build.json
/usr/bin/env node lib
