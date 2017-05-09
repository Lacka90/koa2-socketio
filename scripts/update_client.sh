#!/bin/bash

cd webapp
npm run ionic:build

cd ..
cp -R ./webapp/www ./

