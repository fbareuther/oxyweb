$(function() {
	'use strict';

	// Layout-specific:
	// -------------------------------------------

	// Enable background rendering through HolderJS on cover layout:
	$('.cover-layout #wrapper').addClass('holderjs');

	// Source code
	// -------------------------------------------

	// Highlight `pre` blocks:
	hljs.initHighlightingOnLoad();

	// Dynamically insert source code controls before `pre` or .docs-example elements:
	function sourceControls(codebox) {
		return  '<div class="source-controls">' +
					'<div class="btn-group">' +
						(codebox ? '<a role="button" class="btn btn-sm" data-provides="codebox-bookmark">CodeBox</a>' : '') +
						'<button type="button" class="btn btn-sm" data-provides="clipboard">Copy</button>' +
					'</div>' +
				'</div>';
	}

	$('section > pre, pre.highlight').each(function () {
		var code = $(this);
		var previous = code.prev();
		if (previous.hasClass('docs-example')) {
			previous.before(sourceControls(true));
		} else {
			code.before(sourceControls());
		}
	});

	// CodeBox bookmark --------------------------
	$('[data-provides="codebox-bookmark"]').each(function(){
		var bookmark = $(this).parents('.source-controls').prevAll('[id]');
		if(bookmark.length) {
			$(this).attr('href', 'codebox.html#codebox-' + bookmark.attr('id'));
		}
	});

	// Clipboard ---------------------------------
	// Based on: http://zeroclipboard.org (https://github.com/zeroclipboard/zeroclipboard)

	// Initialize ZeroClipboard:
	ZeroClipboard.config({
		hoverClass: 'btn-clipboard-hover'
	});

	var zeroClipboard = new ZeroClipboard($('[data-provides="clipboard"]'));
	var htmlBridge = $('#global-zeroclipboard-html-bridge')
		.data('placement', 'top')
		.attr('title', 'Copy to clipboard')
		.tooltip('fixTitle')
		.tooltip();

	// Handle on copy:
	zeroClipboard.on('copy', function (e) {
		var trigger = $(e.target);
		var source = $(trigger.data('source'));
		var data = source.length ? source.text() : trigger.parents('.source-controls').nextAll('pre').first().text();

		// Check if source targets a codebox editor:
		if(source.data('codebox-editor')) {
			var editor = ace.edit(source[0]); // Ace needs a native DOM element!
			if(editor) {
				data = editor.getSession().getValue();
			}
		}

		// Copy source HTML to clipboard:
		zeroClipboard.setData({
			"text/plain": data
		});

		// Notify copy success and reset tooltip title:
		htmlBridge
			.attr('title', 'Copied!')
			.tooltip('fixTitle')
			.tooltip('show')
			.attr('title', 'Copy to clipboard')
			.tooltip('fixTitle');
	});

	// Notify on failure:
	zeroClipboard.on("error", function(e) {
		htmlBridge
			.attr('title', e.message)
			.tooltip('fixTitle')
			.tooltip('show')
			.on('hidden.bs.tooltip', function () {
				zeroClipboard.destroy();
			});

		$('.btn-clipboard').data('placement', 'left').attr('title', e.message).tooltip('fixTitle');
	});

	// CodeBox
	// -------------------------------------------

	$('[data-provides="codebox"]').on('ready.oblique-ui.codebox', function (event, codebox) {

		var $element = $(this);

		$("#codebox-view-toggle").change(function() {
			if($(this).is(':checked')) {
				$('[data-codebox-view="composite"]').show();
			} else {
				$('[data-codebox-view-type="page"]').click();
				$('[data-codebox-view="composite"]').hide();
			}
		});

		$element.on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
			console.log($(this).data('codebox-mode'));
		});

		$element.on('viewchanged.oblique-ui.codebox', function(event, codebox, view) {
			$("#codebox-view-toggle").prop("checked", view === "composite").change();
		});

		$(window).resize(redraw);

		function redraw() {
			var preview = $('[data-codebox-preview="live"]');
			var width = preview.width();

			// Size:
			$('[data-codebox-meta="size"]').text(width + 'x' + preview.height());

			// Grid:
			var grid = width < 768 ? 'XS' : (width < 992 ? 'SM' : (width < 1200 ? 'MD' : (width < 1440 ? 'LG' : (width < 1900 ? 'XL' : 'XXL'))));
			$('[data-codebox-meta="grid"] span').hide();
			$('[data-codebox-meta="grid"] span.' + grid).show();

			// Collapsed?
			$('[data-codebox-meta="collapse"]')[width < 768 ? 'fadeIn' : 'fadeOut']().tooltip('fixTitle');
		}

		// Init:
		redraw();
		$('[data-codebox-meta="preview"]').show();
	});

	// Dev
	// -------------------------------------------
	$.cookie('dev') && $('.dev-only').show();
});
