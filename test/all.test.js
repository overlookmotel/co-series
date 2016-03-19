// --------------------
// co-series module
// Tests
// --------------------

// modules
var chai = require('chai'),
	generatorSupported = require('generator-supported');

// init
chai.config.includeStack = true;

// tests

/* global describe, it */

describe('Function', function() {
	require('./functions.test.inc.js');
});

describe('Generator', function() {
	if (generatorSupported) {
		require('./generators.test.inc.js');
	} else {
		it('works');
	}
});
