#!/bin/bash

gulp

cd webapp
yarn install
yarn ionic:build --prod

cd ..
node ./dist/index.js
