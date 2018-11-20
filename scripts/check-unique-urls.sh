#!/bin/bash

# Check that all URL entries in the list are unique. Emit an error if not.

duplicates=$(\grep -oE 'https?://.*$' README.md | sort | uniq -c | grep '^\s*[2-9]')

if [ -n "$duplicates" ]; then
  echo -e "\033[0;31mDuplicates identified: \033[0m"
  echo $duplicates
  exit 1
fi

exit 0
