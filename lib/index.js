// --------------------
// co-series module
// --------------------

// modules
var co = require('co-use'),
	Promise = require('bluebird'),
	isGeneratorFn = require('is-generator').fn;

// exports
module.exports = coSeriesUse(Promise);

function coSeriesUse(Promise) {
	var coUse = co.use(Promise);

	var coSeries = function(fn) {
		if (isGeneratorFn(fn)) fn = coUse.wrap(fn);

		var p;

		return function() {
			var self = this, args = arguments;
			var fnWrapped = function() {
				return fn.apply(self, args);
			};

			if (!p) {
				// first iteration - call immediately
				p = Promise.try(fnWrapped);
			} else {
				// not first iteration - queue to execute after previous iteration complete
				p = p.then(fnWrapped);
			}

	        return p;
		};
	};

	coSeries.use = coSeriesUse;

	return coSeries;
}
