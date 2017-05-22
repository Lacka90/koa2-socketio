#!/bin/bash

cd webapp
if [ "$1" == "prod" ]
then
  echo "Production build"
  npm run ionic:build --prod
else
  echo "Development build"
  npm run ionic:build
fi

cd ..
cp -R ./webapp/www ./

