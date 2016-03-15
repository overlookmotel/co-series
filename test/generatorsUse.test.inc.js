// --------------------
// co-series module
// Generator use tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = global.Promise || require('bluebird'),
	Q = require('q'),
	series = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* jshint esnext: true */
/* global it */

it('with generator', function() {
	var useSeries = series.use(Q);

	var fn = useSeries(function*() {
		yield Promise.resolve();
	});

	var p = fn();
	expect(p).not.to.be.instanceof(Promise);
});
