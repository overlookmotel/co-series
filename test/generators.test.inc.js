// --------------------
// co-series module
// Generator tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = require('bluebird'),
	series = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* jshint esnext: true */
/* global describe, it */

describe('Generator', function() {
	it('runs serially', function() {
		var order = [];
		var fn = series(function*(i) {
			order.push('start' + i);
			yield Promise.resolve();
			order.push('end' + i);
			return i * 10;
		});

		var res = [1, 2, 3].map(fn);
		order.push('sync');

		return res[2].then(function(res) {
			expect(res).to.equal(30);
			expect(order).to.deep.equal(['start1', 'sync', 'end1', 'start2', 'end2', 'start3', 'end3']);
		});
	});

	it('delays first iteration with option {immediate: false}', function() {
		var order = [];
		var fn = series(function*(i) {
			order.push('start' + i);
			yield Promise.resolve();
			order.push('end' + i);
			return i * 10;
		}, {immediate: false});

		var res = [1, 2, 3].map(fn);
		order.push('sync');

		return res[2].then(function(res) {
			expect(res).to.equal(30);
			expect(order).to.deep.equal(['sync', 'start1', 'end1', 'start2', 'end2', 'start3', 'end3']);
		});
	});

	it('passes this context', function() {
		var fn = series(function*(i) {
			yield Promise.resolve();
			return i + '-' + this.j;
		});

		var x = {fn: fn, j: 9};

		return x.fn(3).then(function(res) {
			expect(res).to.equal('3-9');
		});
	});
});
