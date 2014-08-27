#!/bin/sh
cd ..
webroot=$(pwd)
echo "$webroot"

if [ -f "./assets.json" ]; then
	rm ./assets.json
fi

cd /public/javascripts/
if [ -f "*.min.*.js" ]; then
	rm *.min.*.js
fi

cd ../stylesheets/
if [ -f "*.min.*.css" ]; then
	rm *.min.*.css
fi

cd $webroot
./node_modules/.bin/loader views .