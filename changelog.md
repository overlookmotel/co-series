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

## Next

* Use native JS Promise instead of Bluebird
