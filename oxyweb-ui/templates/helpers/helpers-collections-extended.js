// Export helpers
module.exports.register = function (Handlebars, options) {

	/**
	 * {{#asArray}}
	 * Returns the variable arguments as an array.
	 *
	 * Usage: {{#asArray "foo" "bar"}} {{this}} {{/asArray}}
	 */
	Handlebars.registerHelper('asArray', function (/* varargs */)  {
		var array = Array.prototype.slice.call(arguments);
		var options = array.pop(); // Retrieve 'options' argument
		return options.fn(array);
	});

	/**
	 * {{#push}}
	 * Pushes another element value to the provided array.
	 *
	 * Usage: {{#push items "foo"}} {{this}} {{/push}}
	 */
	Handlebars.registerHelper('push', function (array, value, options) {
		array.push(value);
		return options.fn(array);
	});

	/**
	 * {{#arrayConcat}}
	 * Concatenates provided arrays into another array.
	 *
	 * Usage: {{#arrayConcat items "foo"}} {{this}} {{/arrayConcat}}
	 */
	Handlebars.registerHelper('arrayConcat', function (left, right, options) {
		return options.fn(left.concat(right));
	});

	/**
	 * {{#tail}}
	 * Returns last `n` array elements.
	 *
	 * Usage: {{#tail items 2} {{this}} {{/tail}}
	 */
	Handlebars.registerHelper('tail', function (array, count, options) {
		return options.fn(array.splice(array.length - count, count));
	});
};
