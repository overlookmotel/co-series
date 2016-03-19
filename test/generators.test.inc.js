// --------------------
// co-series module
// Generator tests
// --------------------

// modules
var Promise = global.Promise || require('bluebird');

// imports
var runTests = require('./runTests.inc');

// run tests

/* jshint esnext: true */

var order = [];

runTests(order,
	function*(i) {
		order.push('start' + i);
		yield Promise.resolve();
		order.push('end' + i);
		return i * 10;
	},
	function*(i) {
		yield Promise.resolve();
		return i + '-' + this.j;
	},
	function*() {
		yield Promise.resolve();
	}
);
