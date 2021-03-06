# Changelog

## 0.0.1

* Initial release

## 0.0.2

* README update

## 0.1.0

* Update bluebird dependency

## 1.0.0

* Add `.use(Promise)` method
* Remove redundant native-or-bluebird dependency
* Update bluebird dependency
* Update dev dependencies

## 2.0.0

* Execute first iteration immediately
* `immediate` option
* Only use `co.wrap` on generators
* README

Breaking changes:

* Function is called immediately on first iteration (previously it executed on next tick)

## 3.0.0

* Use native JS Promise instead of Bluebird
* Update dev dependencies
* Re-factor tests
* Tests for error handling
* Travis tests against Node v4 + v5
* README update
* package.json license field

## 3.0.1

* Remove foo.js from npm

## 3.0.2

* Remove harmony flag from coveralls run script
