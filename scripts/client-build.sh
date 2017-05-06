#!/bin/bash

cd webapp

npm run ionic:build --prod

cd ..
cp -R webapp/www src/
