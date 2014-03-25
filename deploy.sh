#!/bin/bash

export SPGH_IO_URL=http://specialmagicglasshouse.com:3001

cd spgh-web; make; cd ..;

forever spgh-presence/index.js &

forever spgh-picspitter/index.js &

forever spgh-io/index.js &

forever spgh-web/index.js &
