#!/bin/bash

gulp

cd webapp
yarn install
npm run ionic:build --prod

cd ..
cp -R webapp/www build/

node dist/index.js
