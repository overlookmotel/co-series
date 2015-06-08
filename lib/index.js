// --------------------
// co-series module
// --------------------

// modules
var co = require('co'),
	Promise = require('native-or-bluebird'),
	generatorSupported = require('generator-supported');

// exports
module.exports = function(fn) {
	var p = Promise.resolve();

	if (generatorSupported) fn = co.wrap(fn);

	return function() {
		var self = this, args = arguments;
		p = p.then(function() {
			return fn.apply(self, args);
		});
        return p;
	};
};
