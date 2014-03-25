
/* dependencies */
var camera = require('./camera');
var kutility = require('kutility');
var io = require('socket.io-client');

/* constants */
var MAX_PIC_WIDTH = 320;
var MAX_PIC_HEIGHT = MAX_PIC_WIDTH * 0.75;
var GLASS_HEIGHT = 420;
var THROTTLE_TIME = 1000;
var MAX_GLASS_TIME = 30;

/* good stuff */
var vendorURL = window.URL || window.webkitURL;
var $glass = $('.glass-pane');
var snappable = true;

/* view stuff */
function resize() {

}
$(window).resize(resize);
resize();

// on a read-only device, likely mobile
if (!camera.takePicture) {
  $('.window-controls').css('height', '0px');
  $('.window-controls').css('padding', '0px');
  $('.header').css('font-size', '1.5em');
}

/* get that socket chillin */
var socket = io(config.io);
socket.on('connect', function() {
  if (camera.takePicture)
    $('.snap-button').fadeIn();
});

socket.on('disconnect', function() {
  $('.snap-button').fadeOut();
});

socket.on('takepic', function(picBuf) {
  var blob = new Blob([picBuf], {type: 'image/png'});
  flashScreen();
  showPic(blob);
});

socket.on('connections', function(total) {
  $('.bystander-count').html(total);
});

/* UI events, etc */

$('.snap-button').click(function() {
  if (!snappable)
    return;

  var imageBlob = camera.takePicture();

  disableSnapping();
  setTimeout(function() {
    enableSnapping();
  }, THROTTLE_TIME);

  socket.emit('madepic', imageBlob);
});

function disableSnapping() {
  snappable = false;
  $('.snap-button').addClass('just-snapped');
}

function enableSnapping() {
  snappable = true;
  $('.snap-button').removeClass('just-snapped');
}

function flashScreen() {
  var c = kutility.randColor();
  $('body').css('background-color', c);
  $('.header').css('color', c);
}

function removeLater(el) {
  var s = Math.floor(Math.random() * (MAX_GLASS_TIME - 5)) + 5;
  setTimeout(function() {
    el.remove();
  }, s * 1000);
}

function showPic(blob) {
  var url = vendorURL.createObjectURL(blob);
  var top = Math.floor(Math.random() * (GLASS_HEIGHT - 40));
  var left = Math.floor(Math.random() * ($(window).width() - 100));
  var w = Math.floor(Math.random() * MAX_PIC_WIDTH) + 20;
  var h = w * 0.75;
  var o = 0.7 + (Math.random() * 0.3);

  var pic = $('<img class="glass-image">');
  pic.attr('src', url);
  pic.css('top', top + 'px');
  pic.css('left', left + 'px');
  pic.css('width', w + 'px');
  pic.css('height', h + 'px');
  pic.css('opacity', o);
  $glass.append(pic);

  removeLater(pic);
}
