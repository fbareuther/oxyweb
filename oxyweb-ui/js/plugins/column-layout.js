/* ========================================================================
 * ObliqueUI Framework: column-layout.js v<%= pkg.version %>
 * <%= pkg.homepage %>plugins/column-layout.html
 * ======================================================================== */
+function ($) {
	'use strict';

	// COLUMN-LAYOUT CLASS DEFINITION
	// =========================

	var ColumnLayout = function (element, options) {
		this.$element   = $(element);
		this.options    = options;
	};

	ColumnLayout.prototype.toggle =  function (e, columnKey) {
		var $this   = $(this);
		var column  = typeof columnKey === 'string' ? columnKey : $this.attr('data-column-toggle');
		var $column = $('[data-column="' + column + '"]');
		var $parent = $column.parents('[data-provides="column-layout"]');

		var relatedTarget = { relatedTarget: this, column : $column };
		$parent.trigger(e = $.Event('toggle.oblique-ui.column-layout', relatedTarget));

		if (e.isDefaultPrevented()) {return;}

		$parent
			.toggleClass('column-expanded-' + column)
			.trigger('toggled.oblique-ui.column-layout', relatedTarget);

		return false;
	};

	// COLUMN-LAYOUT PLUGIN DEFINITION
	// ==========================

	var old = $.fn.columnLayout;

	$.fn.columnLayout = function (column) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('oblique-ui.column-layout');

			if (!data) {
				$this.data('oblique-ui.column-layout', (data = new ColumnLayout(this)));
			}
			if (typeof column === 'string') {
				data.toggle(null, column);
			}
		});
	};

	$.fn.columnLayout.Constructor = ColumnLayout;


	// COLUMN-LAYOUT NO CONFLICT
	// ====================

	$.fn.columnLayout.noConflict = function () {
		$.fn.columnLayout = old;
		return this;
	};


	// COLUMN-LAYOUT DATA-API
	// =================

	$(document).on('click.oblique-ui.column-layout.data-api', '[data-column-toggle]', ColumnLayout.prototype.toggle);

	$(window).on('load', function () {
		$('[data-provides="column-layout"]').each(function () {
			var $columnLayout = $(this);
			$columnLayout.columnLayout($columnLayout.data());
		});
	});

}(jQuery);
