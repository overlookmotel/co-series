// --------------------
// co-series module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = global.Promise,
	Q = require('q'),
	series = require('../lib/');

// init
chai.config.includeStack = true;

// use Bluebird if no native Promise (e.g. Node v0.10)
if (!Promise) {
	Promise = require('bluebird');
	series = series.use(Promise);
}

// tests

/* jshint expr: true */
/* global it, beforeEach */

module.exports = function(order, fn1, fn2, fn3) {
	beforeEach(function() {
		order.length = 0;
	});

	it('runs serially', function() {
		var fn = series(fn1);
		var res = [1, 2, 3].map(fn);
		order.push('sync');

		return res[2].then(function(res) {
			expect(res).to.equal(30);
			expect(order).to.deep.equal(['start1', 'sync', 'end1', 'start2', 'end2', 'start3', 'end3']);
		});
	});

	it('delays first iteration with option {immediate: false}', function() {
		var fn = series(fn1, {immediate: false});
		var res = [1, 2, 3].map(fn);
		order.push('sync');

		return res[2].then(function(res) {
			expect(res).to.equal(30);
			expect(order).to.deep.equal(['sync', 'start1', 'end1', 'start2', 'end2', 'start3', 'end3']);
		});
	});

	it('passes this context', function() {
		var fn = series(fn2);

		var x = {fn: fn, j: 9};

		return x.fn(3).then(function(res) {
			expect(res).to.equal('3-9');
		});
	});

	it('use method uses supplied promise implementation', function() {
		var useSeries = series.use(Q);

		var fn = useSeries(fn3);

		var p = fn();
		expect(isPromise(p)).to.be.true;
		expect(p).not.to.be.instanceof(Promise);
	});
};

function isPromise(obj) {
    return !!obj && (typeof obj == 'object' || typeof obj == 'function') && typeof obj.then == 'function';
}
