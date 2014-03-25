
var redis = require('./redis')();
var io = require('socket.io-emitter')(redis);
var interval = process.env.SPGH_CONN_INTERVAL || 5000;

process.title = 'spgh-presence';

console.log('tracking connections');
console.log('update interval: ' + interval);

setInterval(function(){
  redis.hgetall('spgh:connections', function(err, counts){
    if (!counts) return;
    var count = 0;
    for (var i in counts) count += Number(counts[i]);
    redis.set('spgh:connections-total', count);
    io.emit('connections', count);
  });
}, interval);
