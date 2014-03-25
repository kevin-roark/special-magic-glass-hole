#!/bin/bash

git clone https://github.com/LearnBoost/socket.io.git ~/socket.io

git clone https://github.com/Automattic/socket.io-redis.git ~/socket.io-redis

git clone https://github.com/LearnBoost/socket.io-client.git ~/socket.io-client

git clone https://github.com/Automattic/socket.io-emitter.git ~/socket.io-emitter

git clone https://github.com/LearnBoost/socket.io-adapter.git ~/socket.io-adapter

echo "doing presence"
cd spgh-presence; mkdir node_modules;
ln -s ~/socket.io-emitter node_modules/socket.io-emitter
npm install; cd ..

echo "doing spitter"
cd spgh-picspitter; mkdir node_modules;
ln -s ~/socket.io-emitter node_modules/socket.io-emitter
npm install; cd ..

echo "doing io"
cd spgh-io; mkdir node_modules;
ln -s ~/socket.io node_modules/socket.io
ln -s ~/socket.io-redis node_modules/socket.io-redis
npm install; cd ..

echo "doing web"
cd spgh-web; mkdir node_modules;
ln -s ~/socket.io-client node_modules/socket.io-client
npm install; cd ..
