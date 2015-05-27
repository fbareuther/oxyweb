// Export helpers
module.exports.register = function (Handlebars, options) {

	/**
	 * {{concat}}
	 * Concatenates variable arguments
	 *
	 * Usage: {{concat "Hello " firstname "!"}}
	 */
	Handlebars.registerHelper('concat', function (/* varargs */)  {
		var args = Array.prototype.slice.call(arguments);
		args.pop(); // Remove unused 'options' argument
		return args.join('');
	});

	/**
	 * {{format}}
	 * Replaces each {0} {1} {n...} block with the argument in that position.
	 * If the argument is an object or an array it will be stringified to JSON.
	 *
	 * Usage: {{format "Hello {0}! {1}" firstname "Welcome again."}}
	 *
	 * Adapted from: https://gist.github.com/1049426
	 * Inspired by: http://bit.ly/juSAWl
	 */
	Handlebars.registerHelper('format', function (string /*, varargs */)  {
		var args = Array.prototype.slice.call(arguments, 1);
		args.pop(); // Remove unused 'options' argument

		args.forEach(function(arg, i){
			var safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
			string = string.replace(new RegExp('\\{' + i + '\\}', 'g'), safe);
		});

		return string.trim();
	});

	/**
	 * {{split}}
	 * Splits a string using provided separator.
	 *
	 * Usage: {{split "1.2.3.4.5" "."}}
	 */
	Handlebars.registerHelper('split', function (string, sep)  {
		if(string && typeof string === "string") {
			return string.split(sep || " ");
		}
	});
};
