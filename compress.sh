#!/bin/sh
rm assets.json

cd ./public/javascripts/
rm *.min.*.js

cd ../stylesheets/
rm *.min.*.css

cd ~/duapp/
./node_modules/.bin/loader views .