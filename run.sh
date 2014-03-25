#!/bin/bash

export NODE_ENV=development

node spgh-presence/index.js &

node spgh-picspitter/index.js &

node spgh-io/index.js &

node spgh-web/index.js &

wait
