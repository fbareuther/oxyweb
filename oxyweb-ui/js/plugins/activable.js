/* ========================================================================
 * ObliqueUI Framework: activable.js v<%= pkg.version %>
 * <%= pkg.homepage %>plugins/activable.html
 * ======================================================================== */
+function ($) {
	'use strict';

	// ACTIVABLE CLASS DEFINITION
	// =========================

	var selector = '[data-provides~="activable"]';

	var Activable = function (element, options) {
		this.$element   = $(element);
		this.options    = options;
	};

	Activable.prototype.toggle =  function (e) {
		var $this = $(this);
		if(getContainer($this).hasClass('open')){
			$this.activable('deactivate');
		} else {
			$this.activable('activate');
		}
	};

	Activable.prototype.activate =  function (e) {
		var $this = $(this);
		var $parent  = getParent($this);

		var relatedTarget = { relatedTarget: this };
		$parent.trigger(e = $.Event('activate.oblique-ui.activable', relatedTarget));
		if (e.isDefaultPrevented()) {return;}

		$parent.find('.active > a').not($this).activable('deactivate');

		$this.activable('enter');
		$this.data('activated', true);
		getContainer($this).addClass('open');

		$parent.trigger('activated.oblique-ui.activable', relatedTarget);
	};

	Activable.prototype.deactivate =  function (e) {
		var $this = $(this);
		$this.data('activated', false);
		getContainer($this).removeClass('open');
		$this.activable('leave');
	};

	Activable.prototype.enter =  function (e) {
		$(this).parent('li').addClass('active');
	};

	Activable.prototype.leave =  function (e) {
		var $this = $(this);
		!$this.data('activated') && $this.parent('li').removeClass('active');
	};

	function getContainer($this) {
		return $this.parent('li').length ? $this.parent('li') : getParent($this);
	}

	function getParent($this) {
		var $parent = $this.closest(selector);
		$parent = $parent.length && $parent.data('parent') ? $parent.closest($parent.data('parent')) : $parent;
		return $parent && $parent.length ? $parent : $this;
	}

	function onHashChange() {
		if(document.location.hash) {
			try {
				$(selector + ' a[href$=' + document.location.hash + ']').each(Activable.prototype.activate);
			} catch(e) {
				/* Ignore: Syntax error, unrecognized expression */
			}
		}
	}

	// ACTIVABLE PLUGIN DEFINITION
	// ==========================

	var old = $.fn.activable;

	$.fn.activable = function (option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('oblique-ui.activable');

			if (!data) {
				$this.data('oblique-ui.activable', (data = new Activable(this)));
			}
			if (typeof option === 'string') {
				data[option].call($this);
			}
		});
	};

	$.fn.activable.Constructor = Activable;


	// ACTIVABLE NO CONFLICT
	// ====================

	$.fn.activable.noConflict = function () {
		$.fn.activable = old;
		return this;
	};


	// ACTIVABLE DATA-API
	// =================
	var activableSelector = 'a' + selector + ', ' + selector + ' > li > a';
	$(document)
		.on('click.oblique-ui.activable.data-api', activableSelector, Activable.prototype.toggle)
		.on('blur.oblique-ui.activable.data-api', activableSelector, Activable.prototype.deactivate)
		.on('mouseenter.oblique-ui.activable.data-api', activableSelector, Activable.prototype.enter)
		.on('mouseleave.oblique-ui.activable.data-api', activableSelector, Activable.prototype.leave)
		.on('ready', onHashChange);
	$(window)
		.on('hashchange', onHashChange);
}(jQuery);
