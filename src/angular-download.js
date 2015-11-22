"use strict";
var downloadLink;
angular.module("download", [])
	.run(function() {
		var template = '<angular-download style="display: none"><a></a></angular-download>';
		downloadLink = angular.element(document.body).append(template).find('angular-download').find("a");
	})
	.factory("download", function() {

		return {
			fromData: function(data, mimeType, name) {
				this.fromDataUrl("data:" + mimeType + ";base64," + btoa(data), name);
				this.fromDataUrl("data:" + mimeType + ";base64," + btoa(data), name);
			},
			fromDataUrl: function(dataUrl, name) {
				downloadLink.attr("href", dataUrl);
				downloadLink.attr("download", name || "");
				downloadLink[0].click();
			}
		};
	});