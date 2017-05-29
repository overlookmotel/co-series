# co-series.js

[![Greenkeeper badge](https://badges.greenkeeper.io/overlookmotel/co-series.svg)](https://greenkeeper.io/)

# Run in series with co

## Current status

[![NPM version](https://img.shields.io/npm/v/co-series.svg)](https://www.npmjs.com/package/co-series)
[![Build Status](https://img.shields.io/travis/overlookmotel/co-series/master.svg)](http://travis-ci.org/overlookmotel/co-series)
[![Dependency Status](https://img.shields.io/david/overlookmotel/co-series.svg)](https://david-dm.org/overlookmotel/co-series)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/co-series.svg)](https://david-dm.org/overlookmotel/co-series)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/co-series/master.svg)](https://coveralls.io/r/overlookmotel/co-series)

v3.x.x uses native JS Promises rather than Bluebird by default. If you prefer Bluebird, use [co-series-bluebird](https://www.npmjs.com/package/co-series-bluebird).

## Usage

This small module shims an asynchronous function to ensure it queues each execution after the the previous execution is complete.

Really comes into it's own when used in conjunction with co and generators. Then you can use native flow control methods (or something like [lodash](https://www.npmjs.com/package/lodash)) to control execution.

### Generators

```js
var co = require('co');

var order;
var fn = function*(num) {
    order.push('start ' + num);
    yield Promise.resolve();
    order.push('end ' + num);

    return num * 10;
}

// execute function in parallel
co(function*() {
    order = [];
    var result = yield [1, 2, 3].map(co.wrap(fn));
    order.push('finished ' + result);

    // order = ['start 1', 'start 2', 'start 3', 'end 1', 'end2', 'end 3', 'finished [10, 20, 30]']
});
```

```js
var series = require('co-series');

// execute function in series
co(function*() {
    order = [];
    var result = yield [1, 2, 3].map(series(fn));
    order.push('finished ' + result);

    // order = ['start 1', 'end 1', 'start 2', 'end2', 'start 3', 'end 3', 'finished [10, 20, 30]']
});
```

### Promises

You don't need to use co and generators!

```js
var order;
var fn = function(num) {
    order.push('start ' + num);
    return Promise.resolve().then(function() {
        order.push('end ' + num);
        return num * 10;
    });
}

// execute function in parallel
order = [];
Promise.all([1, 2, 3].map(fn));

// order = ['start 1', 'start 2', 'start 3', 'end 1', 'end2', 'end 3']
```

```js
var series = require('co-series');

// execute function in series
Promise.all([1, 2, 3].map(series(fn)));

// order = ['start 1', 'end 1', 'start 2', 'end2', 'start 3', 'end 3']
```

### Errors/rejections

If an error is thrown or the promise returned by `fn` is rejected, further iterations are cancelled.

### Execution order

On the first iteration, `fn` is called immediately. Thereafter, each iteration awaits the previous iteration to complete.

```js
var promise = Promise.all([1, 2, 3].map(series(fn)));
order.push('sync');

// order = ['start 1', 'sync', 'end 1', 'start 2', 'end2', 'start 3', 'end 3']
```

If you wish the first iteration to execute on the next tick, pass option `immediate` as `false`

```js
var promise = Promise.all([1, 2, 3].map(series(fn, {immediate: false})));
order.push('sync');

// order = ['sync', 'start 1', 'end 1', 'start 2', 'end2', 'start 3', 'end 3']
```

### `series.use(Promise)`

Creates a new instance of `co-series`, which uses the Promise implementation provided (by default `co-series` uses native JS promises).

```js
var Bluebird = require('bluebird');
var series = require('co-series').use(Bluebird);

// now use `co-series` in the usual way
var fn = series(function() {});

var promise = fn();

console.log(promise instanceof Bluebird); // true
```

If `.use()` is called without an argument, a new instance of `co-series` is created using native JS Promises.

## Tests

Use `npm test` to run the tests (or `npm run test-harmony` on Node v0.12.x).
Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookmotel/co-series/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/co-series/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
