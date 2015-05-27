/* ========================================================================
 * ObliqueUI Framework: inner-navigation.js v<%= pkg.version %>
 * <%= pkg.homepage %>plugins/inner-navigation.html
 * ======================================================================== */
+function ($) {
	'use strict';

	// INNER-NAVIGATION CLASS DEFINITION
	// =========================

	var selector = '[data-provides~="inner-navigation"]';

	var InnerNavigation = function (element, options) {
		this.$element   = $(element);
		this.options    = options;
	};

	InnerNavigation.prototype.scrollTo =  function (e) {
		var $this = $(this);

		// Retrieve hash:
		var hash = this.hash;
		var anchor = $(hash);

		if(anchor.length) {
			// Prevent default anchor click behavior:
			e && e.preventDefault();

			var $parent = getParent($this);
			var relatedTarget = { relatedTarget: this, hash: hash };
			$parent.trigger(e = $.Event('scroll.oblique-ui.inner-navigation', relatedTarget));

			if (e.isDefaultPrevented()) {
				return;
			}

			// Retrieve any extra top offset:
			var topOffset = anchor.offset().top;
			var additionalTopOffsets = $('[data-offset-top]').map(function() {
				var top = $(this).data('offset-top');
				return topOffset > top ? top : 0;
			}).get();

			var additionalTopOffset = additionalTopOffsets.length ? Math.max.apply(null, additionalTopOffsets) : 0;
			var scrollTop = topOffset - additionalTopOffset;

			// Animate:
			$('html, body').animate({
				scrollTop: scrollTop
			}, 300, function () {
				// Restore default behaviour:
				window.location.hash = hash;
			});

			$parent.trigger('scrolled.oblique-ui.inner-navigation', relatedTarget);
		}
	};

	function getParent($this) {
		var $parent = $this.closest(selector);
		$parent = $parent.length && $parent.data('parent') ? $parent.closest($parent.data('parent')) : $parent;
		return $parent && $parent.length ? $parent : $this;
	}

	// INNER-NAVIGATION PLUGIN DEFINITION
	// ==========================

	var old = $.fn.innerNavigation;

	$.fn.innerNavigation = function () {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('oblique-ui.inner-navigation');

			if (!data) {
				$this.data('oblique-ui.inner-navigation', (data = new InnerNavigation(this)));
			}
			data.scrollTo.call(this);
		});
	};

	$.fn.innerNavigation.Constructor = InnerNavigation;


	// INNER-NAVIGATION NO CONFLICT
	// ====================

	$.fn.innerNavigation.noConflict = function () {
		$.fn.innerNavigation = old;
		return this;
	};


	// INNER-NAVIGATION DATA-API
	// =================

	$(document).on('click.oblique-ui.inner-navigation.data-api', selector + ' li > a', InnerNavigation.prototype.scrollTo);

}(jQuery);
