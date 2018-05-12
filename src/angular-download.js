"use strict";

// <A> element on no-IE browsers
var downloadLink;

angular.module("download", [])
	.run(function() {
		if (!navigator.msSaveBlob) {
			var template = '<angular-download style="display: none"><a></a></angular-download>';
			downloadLink = angular.element(document.body).append(template).find('angular-download').find("a");
		}
	})
	.factory("download", function() {

		return {
			fromData: function(data, mimeType, name) {
				this.fromDataURL("data:" + mimeType + ";base64," + btoa(encode_utf8(data)), name);
			},
			fromBase64: function(dataBase64, mimeType, name) {
				this.fromDataURL("data:" + mimeType + ";base64," + dataBase64, name);
			},
			fromDataURL: function(dataUrl, name) {
				if (downloadLink) {
					downloadLink.attr("href", dataUrl);
					downloadLink.attr("download", name || "");
					downloadLink[0].click();
				} else {
					this.fromBlob(dataUrlToBlob(dataUrl), name);
				}
			},
			fromBlob: function(dataBlob, name) {
				if (downloadLink) {
					var self = this;
					blobToDataURL(dataBlob, function(dataUrl) {
						self.fromDataURL(dataUrl, name);
					});
				} else {
					navigator.msSaveBlob(dataBlob, name);
				}
			}
		};
	});

function blobToDataURL(blob, callback) {
	var a = new FileReader();
	a.onload = function(e) {callback(e.target.result);}
	a.readAsDataURL(blob);
}

function dataUrlToBlob(dataUrl) {
	// data:[<media type>][;base64],<data>
	var match = dataUrl.match(/^data:(.*?)(;base64)?,(.*)/);
	if (!match) {
		throw new Error("Invalid dataUrl");
	}
	var contentType = match[1];
	var base64 = match[2];
	var data = match[3];
	var b64Data = base64 ? data : btoa(data);

	return b64toBlob(b64Data, contentType);
}

// From https://github.com/jeremybanks/b64-to-blob
function b64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {type: contentType});
	return blob;
}

// From http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}