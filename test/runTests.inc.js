// --------------------
// co-series module
// Tests
// --------------------

// modules
var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	expect = chai.expect,
	Promise = global.Promise,
	Bluebird = require('bluebird'),
	Q = require('q'),
	series = require('../lib/');

// init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

// use Bluebird if no native Promise (e.g. Node v0.10)
if (!Promise) {
	Promise = require('bluebird');
	series = series.use(Promise);
}

// tests

/* jshint expr: true */
/* global describe, it, beforeEach */

module.exports = function(order, fn1, fn2, fn3, fn4, fn5) {
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

	describe('Error handling', function() {
		describe('sync error', function() {
			var fn;

			beforeEach(function() {
				fn = series(fn3);
			});

			describe('on 1st iteration', function() {
				it('rejects', function() {
					var res = [2, 3, 4].map(fn);

					return Promise.all([
						expect(res[0]).to.be.rejectedWith(Error, 'error2'),
						expect(res[1]).to.be.rejectedWith(Error, 'error2'),
						expect(res[2]).to.be.rejectedWith(Error, 'error2')
					]);
				});

				it('halts execution', function() {
					var res = [2, 3, 4].map(fn);

					return reflectAll(res).then(function() {
						expect(order).to.deep.equal(['start2']);
					});
				});
			});

			describe('on 2nd iteration', function() {
				it('rejects', function() {
					var res = [1, 2, 3].map(fn);

					return Promise.all([
						expect(res[0]).to.eventually.equal(10),
						expect(res[1]).to.be.rejectedWith(Error, 'error2'),
						expect(res[2]).to.be.rejectedWith(Error, 'error2')
					]);
				});

				it('halts execution', function() {
					var res = [1, 2, 3].map(fn);

					return reflectAll(res).then(function() {
						expect(order).to.deep.equal(['start1', 'end1', 'start2']);
					});
				});
			});
		});

		describe('async error', function() {
			var fn;

			beforeEach(function() {
				fn = series(fn4);
			});

			describe('on 1st iteration', function() {
				it('rejects', function() {
					var res = [2, 3, 4].map(fn);

					return Promise.all([
						expect(res[0]).to.be.rejectedWith(Error, 'error2'),
						expect(res[1]).to.be.rejectedWith(Error, 'error2'),
						expect(res[2]).to.be.rejectedWith(Error, 'error2')
					]);
				});

				it('halts execution', function() {
					var res = [2, 3, 4].map(fn);

					return reflectAll(res).then(function() {
						expect(order).to.deep.equal(['start2']);
					});
				});
			});

			describe('on 2nd iteration', function() {
				it('rejects', function() {
					var res = [1, 2, 3].map(fn);

					return Promise.all([
						expect(res[0]).to.eventually.equal(10),
						expect(res[1]).to.be.rejectedWith(Error, 'error2'),
						expect(res[2]).to.be.rejectedWith(Error, 'error2')
					]);
				});

				it('halts execution', function() {
					var res = [1, 2, 3].map(fn);

					return reflectAll(res).then(function() {
						expect(order).to.deep.equal(['start1', 'end1', 'start2']);
					});
				});
			});
		});
	});

	it('use method uses supplied promise implementation', function() {
		var useSeries = series.use(Q);

		var fn = useSeries(fn5);

		var p = fn();
		expect(isPromise(p)).to.be.true;
		expect(p).not.to.be.instanceof(Promise);
	});
};

function reflectAll(promises) {
	return Promise.all(promises.map(function(promise) {
		return Bluebird.resolve(promise).reflect();
	}));
}

function isPromise(obj) {
    return !!obj && (typeof obj == 'object' || typeof obj == 'function') && typeof obj.then == 'function';
}
