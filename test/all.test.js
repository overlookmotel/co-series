// --------------------
// co-series module
// Tests
// --------------------

// modules
var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	generatorSupported = require('generator-supported');

// init
chai.config.includeStack = true;
chai.use(chaiAsPromised);

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
