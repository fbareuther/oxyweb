/**
 * ObliqueUI Viewport Widget
 */
$(function() {
	'use strict';


	$('iframe[data-provides="responsive-viewport"][data-viewport-source]').each(function () {
		var $this = $(this);

		function afterReady() {
			$this.parent().find('.overlay').fadeOut(function(){
				$this.parent().removeClass('has-overlay');
			});
		}

		// Handle on viewport resizer ready:
		$(this.contentWindow.document).on('viewport-resizer.ready', function() {
			afterReady();
		});

		// IE8+ compatible message handling between frames:
		window.onmessage = function(e){
			if (e.data === 'viewport-resizer.ready') {
				afterReady();
			}
		};

		var html = '<!DOCTYPE HTML>' +
			'<html style="opacity:0;"><head><meta charset="utf-8"/></head>' +
			'<body data-viewport-source="' + $(this).data('viewport-source') + '">' +
			'<a data-viewport="320x480" data-icon="mobile">Mobile (e.g. Apple iPhone)</a><a data-viewport="320x568" data-icon="mobile" data-version="5">Apple iPhone 5</a><a data-viewport="600x800" data-icon="small-tablet">Small Tablet</a><a data-viewport="768x1024" data-icon="tablet">Tablet (e.g. Apple iPad 2-3rd, mini)</a><a data-viewport="1280x800" data-icon="notebook">Widescreen</a><a data-viewport="1920x1080" data-icon="tv">HDTV 1080p</a>' +
			'<script src="' + $(this).data('viewport-base') + 'vendor/viewport-resizer/viewport-resizer.custom.min.js"></script>' +
			'</body></html>';
		this.contentWindow.document.write(html);

	});
});

