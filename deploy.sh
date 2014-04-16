#!/bin/bash

export SPGH_IO_URL=http://107.170.86.121:3001

git pull

cd spgh-web; make; cd ..;

forever start spgh-presence/index.js

forever start spgh-picspitter/index.js

forever start spgh-io/index.js

forever start spgh-web/index.js

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

