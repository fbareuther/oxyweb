/* ========================================================================
 * ObliqueUI Framework: app.js v<%= pkg.version %>
 * <%= pkg.homepage %>#app
 * ======================================================================== */

$(function(){
	'use strict';

	// Tooltips
	// ---------------------------------

	// Data-API initialization:
	$('[data-toggle="tooltip"]').tooltip();

	// Scoped initialization (enables tooltips on elements that specify a `title` attribute):
	$('.has-tooltips').find("a[title], button[title], span[title], label[title], img[title]").tooltip();

});
