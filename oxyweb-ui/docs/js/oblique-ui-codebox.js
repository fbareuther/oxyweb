/**
 * ObliqueUI CodeBox plugin
 *
 * Based on: http://ace.c9.io (https://github.com/ajaxorg/ace)
 * Inspired from:
 *  - http://www.jqueryscript.net/text/Creating-A-JSFiddle-Like-Code-Editor-with-jQuery-ACE-Editor-Cloud-Edit.html
 *  - http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
 */
+function ($) {
	'use strict';

	// CODEBOX CLASS DEFINITION
	// =========================

	var selector = '[data-provides="codebox"]';
	var timers = {};

	var CodeBox = function (element, options) {
		if (typeof ace === 'undefined') { throw new Error('ObliqueUI CodeBox requires Ace editor: http://ace.c9.io'); }

		var $codebox    = this;
		this.$element   = $(element);
		this.options    = options;
		this.view       = CodeBox.VIEWS.composite;
		this.template   = null;

		$.when((function() {
			// Preload preview template, if any:
			if (options.templateUrl) {
				$codebox.state('loading', "Loading preview template: " + options.templateUrl);
				return $.get(options.templateUrl, function (data) {
					return data;
				});
			} else {
				return options.template;
			}
		})()).then(function(template) {
			// Store resolved template:
			$codebox.options.template = template;

			// Compile template:
			$codebox.template = Handlebars.compile($codebox.options.template);

			// Initialize live preview, if any:
			$('[data-codebox-preview="live"]').each(function () {
				var frame = $($codebox.options.frame);
				$(this).append(frame);

				// Listen for response messages from the frame:
				window.addEventListener('message', function (e) { // FIXME: IE8 not compatible!
					// Verify origin of the message's sender:
					if (e.origin === (window.location.protocol + "//" + window.location.host) && e.source === frame[0].contentWindow) {
						console.log('Result: ' + e.data);
					}
				});
			});

			// Initialize code editors, if any:
			$('[data-codebox-editor]').each(function () {
				var $this = $(this);
				var mode = $this.data('codebox-editor') || $codebox.options.mode;
				var delay = $this.data('codebox-preview-delay') || $codebox.options.delay;

				var editor = ace.edit(this);
				editor.setOptions({
					useWorker: true,
					theme: 'ace/theme/' + $codebox.options.theme,
					mode: 'ace/mode/' + mode,
					tabSize: 2,
					displayIndentGuides: true,
					useSoftTabs: true,
					showInvisibles: true,
					showPrintMargin: false
				});

				// Store editor:
				$this.data('oblique-ui.editor', editor);

				// Bind onchange listener:
				editor.getSession().on("change", function (e) {
					if (options.liveEdit) {
						$codebox.livePreview(mode, editor.getValue(), delay);
					}
				});
			});

		}).done(function() {
			$codebox.state('ready', "CodeBox is ready!");
		});
	};

	CodeBox.DEFAULTS = {
		mode: 'html',
		theme: 'twilight',
		liveEdit: true,
		delay: 350,
		frame:      '<iframe data-codebox-preview="frame" width="100%" sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms" allowtransparency="true"></iframe>',
		template:   '<!DOCTYPE html>' +
					'<html lang="en">' +
						'<head>' +
							'<meta charset="utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" />' +
							'<title>Live Preview &middot; ObliqueUI Codebox</title>' +
							'<style data-codebox-preview="css" type="text/css">{{{css}}}</style>' +
							'<script data-codebox-preview="javascript" type="text/javascript">{{{javascript}}}</script>' +
						'</head>' +
						'<body data-codebox-preview="html">{{{html}}}</body>' +
					'</html>',

		// DATA attributes:
		templateUrl: null
	};

	CodeBox.VIEWS = {
		composite: "composite",
		page: "page"
	};

	CodeBox.prototype.updateEditor = function (mode, data) {
		$('[data-codebox-editor="' + mode + '"]').each(function(){
			var editor = $(this).data('oblique-ui.editor');
			if(editor) {
				editor.setValue(data, 1); // Set value and move cursor to the end
			}
		});
	};

	CodeBox.prototype.updatePreview = function () {
		var $codebox = this;
		var content = '';

		if (this.view === CodeBox.VIEWS.composite) {
			var data = {};
			$('[data-codebox-editor]').each(function () {
				var mode = $(this).data('codebox-editor');
				var editor = $(this).data('oblique-ui.editor');
				if (editor) {
					data[mode] = (data[mode] || '') + editor.getValue();
				}
			});
			content = this.template(data);
		} else {
			$('[data-codebox-editor="html"]').each(function () {
				var mode = $(this).data('codebox-editor');
				var editor = $(this).data('oblique-ui.editor');
				if (editor) {
					content = content + editor.getValue();
				}
			});
		}

		$('iframe[data-codebox-preview="frame"]').each(function () {
			var frameWindow = this.contentWindow;
			frameWindow.document.open('text/html', 'replace');
			frameWindow.document.write(content);
			frameWindow.document.close();
		});
	};

	CodeBox.prototype.livePreview = function (mode, data, delay) {
		delay = delay || this.options.delay;
		var $codebox = this;
		if (timers[mode]) {
			window.clearTimeout(timers[mode]);
		}
		timers[mode] = window.setTimeout(function() {
			timers[mode] = null;
			$codebox.updatePreview();
		}, delay);
	};

	CodeBox.prototype.toggleView = function (view) {
		this.view = CodeBox.VIEWS[view] || this.view;
		this.trigger('viewchanged', this.view);
	};

	CodeBox.prototype.load = function (snippets, view) {
		this.state('loading', JSON.stringify(snippets));
		this.toggleView(view || CodeBox.VIEWS.composite);

		var $codebox = this;
		var requests = $.map(snippets, function(snippet, index){

			// TODO: improve this with multi notification status
			if(snippet.main) {
				$codebox.status(snippet.src);
			}

			return $.get(snippet.src, function(data) {
				$codebox.updateEditor(snippet.mode, data);
			}).fail(function(error, type, cause) {
				$codebox.state('error', "Unable to load source file: " + snippet.src);
				$codebox.notify('danger', 'Unable to load source file!',  'Cause: ' + cause + '(' + snippet.src + ')', error);
			});
		});

		$.when(requests).done(function() {
			$codebox.state('loaded');
		});
	};

	CodeBox.prototype.status = function (msg) {
		$('[data-codebox-notification="status"]').html(msg);
	};

	CodeBox.prototype.state = function (state, msg) {
		$(selector).removeClass (function (index, css) {
			return (css.match (/\bcodebox-state-\S+/g) || []).join(' ');
		}).addClass("codebox-state-" + state);

		// Update status bar, if a message is provided:
		if(msg){
			this.status(msg);
		}

		// Finallly, trigger state as event:
		this.trigger(state, msg);
	};

	CodeBox.prototype.notify = function (type, title, message, data) {
		$('[data-codebox-notification="alert"] h4').html(title);
		$('[data-codebox-notification="alert"] p').html(message);
		$('[data-codebox-notification="alert"]').addClass('alert-' + type)
			.addClass('in')
			.removeClass('hide');
	};

	CodeBox.prototype.trigger = function (eventName, data) {
		this.$element.trigger(eventName + '.oblique-ui.codebox', [this, data]);
	};

	// CODEBOX PLUGIN DEFINITION
	// ==========================

	function Plugin(option, args) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('oblique-ui.codebox');
			var options = $.extend({}, CodeBox.DEFAULTS, $this.data(), typeof option === 'object' && option);

			if (!data) {
				$this.data('oblique-ui.codebox', (data = new CodeBox(this, options)));
			}
			if (typeof option === 'string') {
				data[option].apply(data, args);
			}
		});
	}

	var old = $.fn.codeBox;

	$.fn.codeBox                = Plugin;
	$.fn.codeBox.Constructor    = CodeBox;


	// CODEBOX NO CONFLICT
	// ====================

	$.fn.codeBox.noConflict = function () {
		$.fn.codeBox = old;
		return this;
	};


	// CODEBOX DATA-API
	// =================

	$(window).on('load', function () {

		$(selector).each(function () {
			var $element = $(this);

			$element.on('ready.oblique-ui.codebox', function() {
				// Look for initial source loading:
				if (window.location.hash) {
					$('[href="' + window.location.hash + '"]').addClass('active').trigger('click')
						.parents('li[role="menuitem"]').each(function(){
							$(this).addClass('open active');
							$(this).children('ul').addClass('in');
						}
					);
				}
			});

			var data = $element.data();
			$element.codeBox(data);
		});
	});

	$(document)
		.on('click.oblique-ui.codebox.data-api', selector + ' [data-codebox-loads]', function(e){
			e.preventDefault();

			var $element = $(this);
			var modes = $element.data('codebox-loads').split(',');
			var view = $element.data('codebox-view');
			var src = $element.data('codebox-src');

			// Prepare snippets bundle for each mode:
			var snippets = [];
			$.each(modes, function(index, mode){
				snippets.push({
					mode: mode === 'js' ? 'javascript' : mode,
					src:  src + '.' + mode,
					main: mode === 'html' // TODO: improve this with multi notification status
				});
			});

			Plugin.call($(selector), 'load', [snippets, view]);

			// Update location hash:
			window.location.hash = $element.attr('href');
		});

}(jQuery);
