#!/usr/bin/env bash
#
# test.sh
#

# run tests with node
node test

# browserify
node_modules/.bin/browserify test/browser > test/browser/bundle.js

# run tests in browser
if [ $? = 0 ]; then
  if [ -x "$(which xdg-open)" ]; then
    xdg-open test/browser/index.html
  elif [ -x "$(which open)" ]; then
    open test/browser/index.html
  else
    echo "test in your browser too: test/browser/index.html";
  fi
fi