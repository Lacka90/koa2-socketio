#!/bin/bash

cd webapp
npm install
npm run ionic:build --prod

cd ..
cp -R webapp/www src/
