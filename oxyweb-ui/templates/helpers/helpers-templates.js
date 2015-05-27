// Export helpers
module.exports.register = function (Handlebars, options) {

	/**
	 * Context - augments context of nested content
	 *
	 * Usage: {{#context foo=1 bar=2}} ... {{/context}}
	 *
	 * Retrieved from: http://stackoverflow.com/questions/9411538/handlebars-is-it-possible-to-access-parent-context-in-a-partial/18026063#18026063
	 * TODO: remove when supported by Handlebars & Assemble (cf. https://github.com/wycats/handlebars.js/pull/182)
	 */
	Handlebars.registerHelper('context', function(options) {
		var context = {},
			mergeContext = function(obj) {
				for(var k in obj) {
					context[k]=obj[k];
				}
			};
		mergeContext(this);
		mergeContext(options.hash);
		return options.fn(context);
	});
};
