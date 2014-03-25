
/* dependencies */
var camera = require('./camera');
var kutility = require('kutility');
var io = require('socket.io-client');

/* view stuff */
function resize() {

}
$(window).resize(resize);
resize();

/* get that socket chillin */
/*var socket = io(config.io);
socket.on('connect', function() {
  $('.snap-button').fadeIn();
});

socket.on('disconnect', function() {
  $('.snap-button').fadeOut();
});

socket.on('takepic', function(pic) {
  showPic(pic);
});

socket.on('connections', function(total) {
  $('.bystander-count').html(total);
});*/

/* UI events, etc */

$('.snap-button').click(function() {
  var imageBlob = camera.takePicture();
  console.log(imageBlob);
});
