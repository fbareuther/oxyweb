/**
 * ObliqueUI Preview Widget
 */
$(function() {
	'use strict';

	if (typeof String.prototype.endsWith !== 'function') {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}

	function queryParam(param) {
		param = param.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
		var expr = "[\\?&]"+param+"=([^&#]*)";
		var regex = new RegExp( expr );
		var results = regex.exec( window.location.href );
		if ( results !== null ) {
			return results[1];
		} else {
			return false;
		}
	}

	function notify(type, message, data) {
		$('[data-notification="alert"] p').html(message);
		if(data) {
			$('[data-notification="alert"] pre').html(JSON.stringify(data, null, 2)).removeClass('hide');
		}
		$('[data-notification="alert"]').addClass('alert-' + type)
			.addClass('in')
			.removeClass('hide');
	}

	$('.widget-preview').each(function(){
		var preview = $(this);
		var label = $('.widget-preview > label');
		var url = queryParam('url');
		var title = queryParam('title') || label.text();
		console.log('[url=' + url + ', title=' + title + ']');

		if (url) {
			var path = url.endsWith('.html') ? url : url + '.html';
			$('.widget-preview-content').load(path, function (response, status) {
				if (status !== 'success') {
					notify('danger', 'Source not found!', {'path' : path, 'url': window.location.href});
				} else {
					label.text(title);
					preview.removeClass('hide');
				}
			});
		} else {
			notify('warning', 'Please, check your query parameters and ensure that you provide the mandatory <code>url</code> parameter and an optional <code>title</code> parameter.');
		}
	});
});

