
var debug = require('debug');
var msgpack = require('msgpack-js');

process.title = 'spgh-picspitter';

// redis
var redis = require('./redis')();
var sub = require('./redis')();
var io = require('socket.io-emitter')(redis);

console.log('starting pic-spitter.');

sub.subscribe('spgh:madepic');
sub.on('message', function(channel, picBuf){
  if ('spgh:madepic' != channel) return;

  io.emit('takepic', msgpack.decode(picBuf));
  //redis.set('spgh-takepic', msgpack.encode(picBuf))
});
