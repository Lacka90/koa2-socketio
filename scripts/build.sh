#!/bin/bash

gulp

cd webapp
yarn install
yarn ionic:build --prod

cd ..
cp -R webapp/www dist/

node dist/index.js&
