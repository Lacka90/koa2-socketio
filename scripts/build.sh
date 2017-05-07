#!/bin/bash

gulp

cd webapp
yarn install
yarn ionic:build --prod

cd ..
cp -R webapp/www build/

node dist/index.js
