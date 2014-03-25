
/* globals $ */

/* requirements */
var filer = require('./lib/filer');

/* constants */
var MAX_PIC_WIDTH = 320;
var VIDEO_WIDTH = 160;
var VIDEO_HEIGHT = 120;

var streaming = false;
var video = document.querySelector('#video');
var videoMirror = document.querySelector('#video-mirror');
var canvas = document.querySelector('#canvas');

if (!navigator.getUserMedia) {
  navigator.getUserMedia = navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia
                           || navigator.msGetUserMedia;
}

navigator.getUserMedia({video: true, audio: false}, mediaHandler, function(e) {
  console.log('Error getting video');
  console.log(e);
});

function mediaHandler(stream) {
  if (navigator.mozGetUserMedia) {
    video.mozSrcObject = stream;
    videoMirror.mozSrcObject = stream;
  } else {
    var vendorURL = window.URL || window.webkitURL;
    var vidUrl = vendorURL.createObjectURL(stream);
    videoMirror.src = vidUrl;
    video.src = vidUrl;
  }
  video.play();
  videoMirror.play();
}

video.addEventListener('canplay', function(ev){
  if (!streaming) {
    video.setAttribute('width', VIDEO_WIDTH);
    video.setAttribute('height', VIDEO_HEIGHT);
    videoMirror.setAttribute('width', VIDEO_WIDTH);
    videoMirror.setAttribute('height', VIDEO_HEIGHT);
    canvas.setAttribute('width', VIDEO_WIDTH);
    canvas.setAttribute('height', VIDEO_HEIGHT);
    streaming = true;
  }
}, false);

exports.takePicture = function() {
  var w = Math.floor(Math.random() * MAX_PIC_WIDTH) + 20;
  var h = w * 0.75;

  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(video, 0, 0, w, h);
  var data = canvas.toDataURL('image/png');
  //photo.setAttribute('src', data);
  canvas.getContext('2d').clearRect(0, 0, w, h);

  return filer.Util.dataURLToBlob(data);
}
