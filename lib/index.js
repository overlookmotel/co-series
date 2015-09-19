// --------------------
// co-series module
// --------------------

// modules
var co = require('co-use'),
	Promise = require('bluebird'),
	generatorSupported = require('generator-supported');

// exports
module.exports = coSeriesUse(Promise);

function coSeriesUse(Promise) {
	var coUse = co.use(Promise);

	var coSeries = function(fn) {
		var p = Promise.resolve();

		if (generatorSupported) fn = coUse.wrap(fn);

		return function() {
			var self = this, args = arguments;
			p = p.then(function() {
				return fn.apply(self, args);
			});
	        return p;
		};
	};

	coSeries.use = coSeriesUse;

	return coSeries;
}
