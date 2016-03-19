// --------------------
// co-series module
// Function tests
// --------------------

// modules
var Promise = global.Promise || require('bluebird');

// imports
var runTests = require('./runTests.inc');

// run tests

var order = [];

runTests(order,
	function(i) {
		order.push('start' + i);
		return Promise.resolve().then(function() {
			order.push('end' + i);
			return i * 10;
		});
	},
	function(i) {
		var j = this.j;
		return Promise.resolve().then(function() {
			return i + '-' + j;
		});
	},
	function(i) {
		order.push('start' + i);

		if (i > 1) throw new Error('error' + i);

		return Promise.resolve().then(function() {
			order.push('end' + i);
			return i * 10;
		});
	},
	function(i) {
		order.push('start' + i);

		return Promise.resolve().then(function() {
			if (i > 1) throw new Error('error' + i);

			order.push('end' + i);
			return i * 10;
		});
	},
	function() {
		return Promise.resolve();
	}
);
