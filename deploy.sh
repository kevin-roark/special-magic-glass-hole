#!/bin/bash

export SPGH_IO_URL=http://107.170.86.121:3001

git pull

cd spgh-web; make; cd ..;

forever spgh-presence/index.js &

forever spgh-picspitter/index.js &

forever spgh-io/index.js &

forever spgh-web/index.js &
