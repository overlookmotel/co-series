# co-series.js

# Run in series with co

## Current status

[![NPM version](https://img.shields.io/npm/v/co-series.svg)](https://www.npmjs.com/package/co-series)
[![Build Status](https://img.shields.io/travis/overlookmotel/co-series/master.svg)](http://travis-ci.org/overlookmotel/co-series)
[![Dependency Status](https://img.shields.io/david/overlookmotel/co-series.svg)](https://david-dm.org/overlookmotel/co-series)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookmotel/co-series.svg)](https://david-dm.org/overlookmotel/co-series)
[![Coverage Status](https://img.shields.io/coveralls/overlookmotel/co-series/master.svg)](https://coveralls.io/r/overlookmotel/co-series)

API is not yet stable. May change in v0.1.0.

## Usage

This small module shims a function to ensure it queues each execution after the the previous execution is complete.

Really comes into it's own when used in conjuction with co and generators. Then you can use native flow control methods (or something like lodash) to control execution.

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

## Tests

Use `npm test` to run the tests or `npm run test-harmony` to include generator tests.
Use `npm run cover` to check coverage.

## Changelog

See changelog.md

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/co-series/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add an entry to changelog
* add tests for new features
* document new functionality/API additions in README
