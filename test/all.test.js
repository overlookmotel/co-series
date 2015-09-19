// --------------------
// co-series module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = require('bluebird'),
	generatorSupported = require('generator-supported'),
	series = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

describe('Function', function() {
	it('runs serially', function() {
		var order = [];
		var fn = series(function(i) {
			order.push('start' + i);
			return Promise.resolve().then(function() {
				order.push('end' + i);
				return i * 10;
			});
		});

		var res = [1, 2, 3].map(fn);

		return res[2].then(function(res) {
			expect(res).to.equal(30);
			expect(order).to.deep.equal(['start1', 'end1', 'start2', 'end2', 'start3', 'end3']);
		});
	});

	it('passes this context', function() {
		var fn = series(function(i) {
			var j = this.j;
			return Promise.resolve().then(function() {
				return i + '-' + j;
			});
		});

		var x = {fn: fn, j: 9};

		return x.fn(3).then(function(res) {
			expect(res).to.equal('3-9');
		});
	});
});

if (generatorSupported) {
	require('./generators.test.inc.js');
} else {
	describe('Generator', function() {
		it('works');
	});
}
