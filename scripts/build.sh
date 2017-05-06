#!/bin/bash

gulp

cp -R src/www build/

node build/index.js
