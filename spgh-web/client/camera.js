
/* globals $ */

/* requirements */
var filer = require('./lib/filer');

/* constants */
var PIC_WIDTH = 60;
var PIC_HEIGHT = PIC_WIDTH * 0.75;
var VIDEO_WIDTH = 160;
var VIDEO_HEIGHT = 120;

var video = document.querySelector('#video');
var videoMirror = document.querySelector('#video-mirror');
var canvas = document.querySelector('#canvas');

if (!navigator.getUserMedia) {
  navigator.getUserMedia = navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia
                           || navigator.msGetUserMedia;
}

if (navigator.getUserMedia) {
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
}

function setDimensions() {
  var w, h;
  if (navigator.getUserMedia) {
    w = VIDEO_WIDTH;
    h = VIDEO_HEIGHT;
  } else {
    w = 0;
    h = 0;
  }

  video.setAttribute('width', w);
  video.setAttribute('height', h);
  videoMirror.setAttribute('width', w);
  videoMirror.setAttribute('height', h);
  canvas.setAttribute('width', w);
  canvas.setAttribute('height', h);
}
setDimensions();

if (navigator.getUserMedia) {
  exports.takePicture = function() {
    var w = PIC_WIDTH;
    var h = PIC_HEIGHT;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(video, 0, 0, w, h);

    var data = canvas.toDataURL('image/png');
    canvas.getContext('2d').clearRect(0, 0, w, h);

    return filer.Util.dataURLToBlob(data);
  }
} else {
  exports.takePicture = null;
}

exports.resizeFileImage = function(f, callback) {
  var img = document.createElement('img');
  var reader = new FileReader();  
  reader.onload = function(e) {
    img.src = e.target.result;

    canvas.getContext('2d').drawImage(img, 0, 0);

    var w = img.width;
    var h = img.height;

    if (w == 0 && h == 0) {
      reader.readAsDataURL(f);
      return;
    }

    if (w > h) {
      if (w > PIC_WIDTH) {
        h *= PIC_WIDTH / w;
        w = PIC_WIDTH;
      }
    } else if (h >= w && h != 0) {
      if (h > PIC_HEIGHT) {
        w *= PIC_HEIGHT / h;
        h = PIC_HEIGHT;
      }
    } else if (h == 0) {
      w = PIC_WIDTH;
      h = PIC_HEIGHT;
    }

    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
 
    var dataurl = canvas.toDataURL('image/png');
    canvas.getContext('2d').clearRect(0, 0, w, h);
    
    var blob = filer.Util.dataURLToBlob(dataurl);
    callback(blob);
  }
  reader.readAsDataURL(f);
}

