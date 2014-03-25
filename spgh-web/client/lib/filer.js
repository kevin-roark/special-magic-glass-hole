/**
 * Copyright 2013 - Eric Bidelman
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.

 * @fileoverview
 * Convenient wrapper library for the HTML5 Filesystem API, implementing
 * familiar UNIX commands (cp, mv, ls) for its API.
 *
 * @author Eric Bidelman (ebidel@gmail.com)
 * @version: 0.4.3
 */

var self = this; // window or worker context.

self.URL = self.URL || self.webkitURL;
self.requestFileSystem = self.requestFileSystem || self.webkitRequestFileSystem;
self.resolveLocalFileSystemURL = self.resolveLocalFileSystemURL ||
                                 self.webkitResolveLocalFileSystemURL;
navigator.temporaryStorage = navigator.temporaryStorage ||
                             navigator.webkitTemporaryStorage;
navigator.persistentStorage = navigator.persistentStorage ||
                              navigator.webkitPersistentStorage;
self.BlobBuilder = self.BlobBuilder || self.MozBlobBuilder ||
                   self.WebKitBlobBuilder;

// Prevent errors in browsers that don't support FileError.
if (self.FileError === undefined) {
  var FileError = function() {};
  FileError.prototype.prototype = Error.prototype;
}

exports.Util = {

  /**
   * Turns a NodeList into an array.
   *
   * @param {NodeList} list The array-like object.
   * @return {Array} The NodeList as an array.
   */
  toArray: function(list) {
    return Array.prototype.slice.call(list || [], 0);
  },

  /*toDataURL: function(contentType, uint8Array) {
    return 'data:' + contentType + ';base64,' +
        self.btoa(this.arrayToBinaryString(uint8Array));
  },*/

  /**
   * Creates a data: URL from string data.
   *
   * @param {string} str The content to encode the data: URL from.
   * @param {string} contentType The mimetype of the data str represents.
   * @param {bool=} opt_isBinary Whether the string data is a binary string
   *     (and therefore should be base64 encoded). True by default.
   * @return {string} The created data: URL.
   */
  strToDataURL: function(str, contentType, opt_isBinary) {
    var isBinary = opt_isBinary != undefined ? opt_isBinary : true;
    if (isBinary) {
      return 'data:' + contentType + ';base64,' + self.btoa(str);
    } else {
      return 'data:' + contentType + ',' + str;
    }
  },

  /**
   * Creates a blob: URL from a binary str.
   *
   * @param {string} binStr The content as a binary string.
   * @param {string=} opt_contentType An optional mimetype of the data.
   * @return {string} A new blob: URL.
   */
  strToObjectURL: function(binStr, opt_contentType) {

    var ui8a = new Uint8Array(binStr.length);
    for (var i = 0; i < ui8a.length; ++i) {
      ui8a[i] = binStr.charCodeAt(i);
    }

    var blob = new Blob([ui8a],
                        opt_contentType ? {type: opt_contentType} : {});

    return self.URL.createObjectURL(blob);
  },

  /**
   * Creates a blob: URL from a File or Blob object.
   *
   * @param {Blob|File} blob The File or Blob data.
   * @return {string} A new blob: URL.
   */
  fileToObjectURL: function(blob) {
    return self.URL.createObjectURL(blob);
  },

  /**
   * Reads a File or Blob object and returns it as an ArrayBuffer.
   *
   * @param {Blob|File} blob The File or Blob data.
   * @param {Function} callback Success callback passed the array buffer.
   * @param {Function=} opt_error Optional error callback if the read fails.
   */
  fileToArrayBuffer: function(blob, callback, opt_errorCallback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.onerror = function(e) {
      if (opt_errorCallback) {
        opt_errorCallback(e);
      }
    };

    reader.readAsArrayBuffer(blob);
  },

  /**
   * Creates and returns a blob from a data URL (either base64 encoded or not).
   *
   * @param {string} dataURL The data URL to convert.
   * @return {Blob} A blob representing the array buffer data.
   */
  dataURLToBlob: function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = parts[1];

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  },

  /**
   * Reads an ArrayBuffer as returns its contents as a binary string.
   *
   * @param {ArrayBuffer} buffer The buffer of data.
   * @param {string=} opt_contentType An optional mimetype of the data.
   * @return {Blob} A blob representing the array buffer data.
   */
  arrayBufferToBlob: function(buffer, opt_contentType) {
    var uInt8Array = new Uint8Array(buffer);
    return new Blob([uInt8Array],
                    opt_contentType ? {type: opt_contentType} : {});
  },

  /**
   * Reads an ArrayBuffer as returns its contents as a binary string.
   *
   * @param {ArrayBuffer} buffer The buffer of data.
   * @param {Function} callback Success callback passed the binary string.
   * @param {Function=} opt_error Optional error callback if the read fails.
   */
  arrayBufferToBinaryString: function(buffer, callback, opt_errorCallback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.onerror = function(e) {
      if (opt_errorCallback) {
        opt_errorCallback(e);
      }
    };

    var uInt8Array = new Uint8Array(buffer);
    reader.readAsBinaryString(new Blob([uInt8Array]));
  },

  /**
   * Create a binary string out of an array of numbers (bytes), each varying
   * from 0-255.
   *
   * @param {Array} bytes The array of numbers to transform into a binary str.
   * @return {string} The byte array as a string.
   */
  arrayToBinaryString: function(bytes) {
    if (typeof bytes != typeof []) {
      return null;
    }
    var i = bytes.length;
    var bstr = new Array(i);
    while (i--) {
      bstr[i] = String.fromCharCode(bytes[i]);
    }
    return bstr.join('');
  },

  /**
   * Returns the file extension for a given filename.
   *
   * @param {string} filename The filename.
   * @return {string} The file's extension.
   */
  getFileExtension: function(filename) {
    var idx = filename.lastIndexOf('.');
    return idx != -1 ? filename.substring(idx) : '';
  }
};
