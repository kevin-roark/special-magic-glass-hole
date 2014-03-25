
/* dependencies */
var camera = require('./camera');
var kutility = require('kutility');
var io = require('socket.io-client');

/* constants */
var MAX_PIC_WIDTH = 320;
var MAX_PIC_HEIGHT = MAX_PIC_WIDTH * 0.75;
var GLASS_HEIGHT = 420;
var THROTTLE_TIME = 500;

/* good stuff */
var vendorURL = window.URL || window.webkitURL;
var $glass = $('.glass-pane');
var snappable = true;

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
  if (!snappable)
    return;

  var imageBlob = camera.takePicture();

  disableSnapping();
  setTimeout(function() {
    enableSnapping();
  }, THROTTLE_TIME);

  showPic(imageBlob);
});

function disableSnapping() {
  snappable = false;
  $('.snap-button').addClass('just-snapped');
}

function enableSnapping() {
  snappable = true;
  $('.snap-button').removeClass('just-snapped');
}

function showPic(blob) {
  var url = vendorURL.createObjectURL(blob);
  var top = Math.floor(Math.random() * (GLASS_HEIGHT - 40));
  var left = Math.floor(Math.random() * ($(window).width() - 40));

  var pic = $('<img class="glass-image">');
  pic.attr('src', url);
  pic.css('top', top + 'px');
  pic.css('left', left + 'px');
  $glass.append(pic);
}
