#!/bin/bash

gulp
echo $PWD
cd webapp
echo $PWD
npm install
npm run ionic:build --prod

cd ..
echo $PWD
cp -R webapp/www build/

node dist/index.js
