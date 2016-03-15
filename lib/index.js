// --------------------
// co-series module
// --------------------

// modules
var co = require('co-use'),
	isGeneratorFn = require('is-generator').fn;

// exports
var coSeriesUse = function(Promise) {
	// if no Promise implementation provided, use native Promise
	if (!Promise) {
		Promise = global.Promise;

		// if no native Promise, return dummy function which throws when used
		// (but with `.use()` method so Promise can be provided)
		if (!Promise) {
			var dummy = function() {throw new Error('No native Promise implementation present');};
			dummy.use = coSeriesUse;
			return dummy;
		}
	}

	// create coSeries
	var coUse = co.use(Promise);

	var coSeries = function(fn, options) {
		if (isGeneratorFn(fn)) fn = coUse.wrap(fn);

		var p;
		if (options && options.immediate === false) p = Promise.resolve();

		return function() {
			var self = this, args = arguments;
			var fnWrapped = function() {
				return fn.apply(self, args);
			};

			if (!p) {
				// first iteration - call immediately
				try {
					p = Promise.resolve(fnWrapped());
				} catch (err) {
					// sync error - reject promise
					p = Promise.reject(err);
				}
			} else {
				// not first iteration - queue to execute after previous iteration complete
				p = p.then(fnWrapped);
			}

	        return p;
		};
	};

	coSeries.use = coSeriesUse;

	return coSeries;
};

module.exports = coSeriesUse();
