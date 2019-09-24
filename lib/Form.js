(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["formla"] = factory();
	else
		root["formla"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/extract-files/lib/ReactNativeFile.mjs
var ReactNativeFile = function ReactNativeFile(_ref) {
  var uri = _ref.uri,
    name = _ref.name,
    type = _ref.type
  this.uri = uri
  this.name = name
  this.type = type
}

// CONCATENATED MODULE: ./node_modules/extract-files/lib/extractFiles.mjs

function extractFiles(value, path) {
  if (path === void 0) {
    path = ''
  }

  var clone
  var files = new Map()

  function addFile(paths, file) {
    var storedPaths = files.get(file)
    if (storedPaths) storedPaths.push.apply(storedPaths, paths)
    else files.set(file, paths)
  }

  if (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    value instanceof ReactNativeFile
  ) {
    clone = null
    addFile([path], value)
  } else {
    var prefix = path ? path + '.' : ''
    if (typeof FileList !== 'undefined' && value instanceof FileList)
      clone = Array.prototype.map.call(value, function(file, i) {
        addFile(['' + prefix + i], file)
        return null
      })
    else if (Array.isArray(value))
      clone = value.map(function(child, i) {
        var result = extractFiles(child, '' + prefix + i)
        result.files.forEach(addFile)
        return result.clone
      })
    else if (value && value.constructor === Object) {
      clone = {}

      for (var i in value) {
        var result = extractFiles(value[i], '' + prefix + i)
        result.files.forEach(addFile)
        clone[i] = result.clone
      }
    } else clone = value
  }

  return {
    clone: clone,
    files: files
  }
}

// CONCATENATED MODULE: ./src/object-observer.js
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var sysObsKey = Symbol('system-observer-key');

var INSERT = 'insert',
    UPDATE = 'update',
    DELETE = 'delete',
    REVERSE = 'reverse',
    SHUFFLE = 'shuffle',
    nonObservables = {
  Date: true,
  Blob: true,
  Number: true,
  String: true,
  Boolean: true,
  Error: true,
  SyntaxError: true,
  TypeError: true,
  URIError: true,
  Function: true,
  Promise: true,
  RegExp: true,
  File: true
},
    validOptionsKeys = ['path', 'pathsFrom'],
    observableDefinition = {
  revoke: {
    value: function value() {
      this[sysObsKey].revoke();
    }
  },
  observe: {
    value: function value(observer, options) {
      var systemObserver = this[sysObsKey],
          observers = systemObserver.observers;

      if (typeof observer !== 'function') {
        throw new Error('observer parameter MUST be a function');
      }

      if (options) {
        if ('path' in options && (typeof options.path !== 'string' || !options.path)) {
          throw new Error('"path" option, if/when provided, MUST be a non-empty string');
        }

        if ('pathsFrom' in options && options.path) {
          throw new Error('"pathsFrom" option MAY NOT be specified together with "path" option');
        }

        if ('pathsFrom' in options && (typeof options.pathsFrom !== 'string' || !options.pathsFrom)) {
          throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');
        }

        var invalidOption = Object.keys(options).find(function (option) {
          return !validOptionsKeys.includes(option);
        });

        if (invalidOption) {
          throw new Error('"' + invalidOption + '" is not a one of the valid options (' + validOptionsKeys.join(', ') + ')');
        }
      }

      if (!observers.has(observer)) {
        observers.set(observer, Object.assign({}, options));
      } else {
        console.info('observer may be bound to an observable only once');
      }
    }
  },
  unobserve: {
    value: function value() {
      var systemObserver = this[sysObsKey],
          observers = systemObserver.observers;
      var l;

      if (observers.size) {
        l = arguments.length;

        if (l) {
          while (l) {
            observers.delete(arguments[--l]);
          }
        } else {
          observers.clear();
        }
      }
    }
  }
},
    prepareArray = function prepareArray(source, observer) {
  var l = source.length,
      item;
  var target = new Array(l);
  target[sysObsKey] = observer;

  while (l) {
    l--;
    item = source[l];

    if (item && _typeof(item) === 'object' && !Object.prototype.hasOwnProperty.call(nonObservables, item.constructor.name)) {
      target[l] = Array.isArray(item) ? new ArrayObserver({
        target: item,
        ownKey: l,
        parent: observer
      }).proxy : new ObjectObserver({
        target: item,
        ownKey: l,
        parent: observer
      }).proxy;
    } else {
      target[l] = item;
    }
  }

  return target;
},
    prepareObject = function prepareObject(source, observer) {
  var keys = Object.keys(source),
      target = _defineProperty({}, sysObsKey, observer);

  var l = keys.length,
      key,
      item;

  while (l) {
    l--;
    key = keys[l];
    item = source[key];

    if (item && _typeof(item) === 'object' && !nonObservables.hasOwnProperty(item.constructor.name)) {
      target[key] = Array.isArray(item) ? new ArrayObserver({
        target: item,
        ownKey: key,
        parent: observer
      }).proxy : new ObjectObserver({
        target: item,
        ownKey: key,
        parent: observer
      }).proxy;
    } else {
      target[key] = item;
    }
  }

  return target;
},
    callObservers = function callObservers(observers, changes) {
  var target, options, relevantChanges, oPath, oPaths;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = observers.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      target = _step.value;

      try {
        options = observers.get(target);
        relevantChanges = changes;

        if (options.path) {
          oPath = options.path;
          relevantChanges = changes.filter(function (change) {
            return change.path.join('.') === oPath;
          });
        } else if (options.pathsFrom) {
          oPaths = options.pathsFrom;
          relevantChanges = changes.filter(function (change) {
            return change.path.join('.').startsWith(oPaths);
          });
        }

        if (relevantChanges.length) {
          target(relevantChanges);
        }
      } catch (e) {
        console.error('failed to deliver changes to listener ' + target, e);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
},
    getAncestorInfo = function getAncestorInfo(self) {
  var tmp = [];
  var l1 = 0,
      l2 = 0;

  while (self.parent) {
    tmp[l1++] = self.ownKey;
    self = self.parent;
  }

  var result = new Array(l1);

  while (l1) {
    result[l2++] = tmp[--l1];
  }

  return {
    observers: self.observers,
    path: result
  };
};

var ObserverBase =
/*#__PURE__*/
function () {
  function ObserverBase(properties, cloningFunction) {
    _classCallCheck(this, ObserverBase);

    var source = properties.target,
        targetClone = cloningFunction(source, this);

    if (properties.parent === null) {
      this.isRevoked = false;
      Object.defineProperty(this, 'observers', {
        value: new Map()
      });
      Object.defineProperties(targetClone, observableDefinition);
    } else {
      this.parent = properties.parent;
      this.ownKey = properties.ownKey;
    }

    this.revokable = Proxy.revocable(targetClone, this);
    this.proxy = this.revokable.proxy;
    this.target = targetClone;
  }

  _createClass(ObserverBase, [{
    key: "set",
    value: function set(target, key, value) {
      var newValue,
          oldValue = target[key],
          changes;

      if (value === oldValue) {
        return true;
      }

      if (value && _typeof(value) === 'object' && !nonObservables.hasOwnProperty(value.constructor.name)) {
        newValue = Array.isArray(value) ? new ArrayObserver({
          target: value,
          ownKey: key,
          parent: this
        }).proxy : new ObjectObserver({
          target: value,
          ownKey: key,
          parent: this
        }).proxy;
      } else {
        newValue = value;
      }

      target[key] = newValue;

      if (oldValue && _typeof(oldValue) === 'object') {
        var tmpObserved = oldValue[sysObsKey];

        if (tmpObserved) {
          oldValue = tmpObserved.revoke();
        }
      } //	publish changes


      var ad = getAncestorInfo(this);

      if (ad.observers.size) {
        ad.path.push(key);
        changes = typeof oldValue === 'undefined' ? [{
          type: INSERT,
          path: ad.path,
          value: newValue,
          object: this.proxy
        }] : [{
          type: UPDATE,
          path: ad.path,
          value: newValue,
          oldValue: oldValue,
          object: this.proxy
        }];
        callObservers(ad.observers, changes);
      }

      return true;
    }
  }, {
    key: "deleteProperty",
    value: function deleteProperty(target, key) {
      var oldValue = target[key],
          changes;
      delete target[key];

      if (oldValue && _typeof(oldValue) === 'object') {
        var tmpObserved = oldValue[sysObsKey];

        if (tmpObserved) {
          oldValue = tmpObserved.revoke();
        }
      } //	publish changes


      var ad = getAncestorInfo(this);

      if (ad.observers.size) {
        ad.path.push(key);
        changes = [{
          type: DELETE,
          path: ad.path,
          oldValue: oldValue,
          object: this.proxy
        }];
        callObservers(ad.observers, changes);
      }

      return true;
    }
  }]);

  return ObserverBase;
}();

var ArrayObserver =
/*#__PURE__*/
function (_ObserverBase) {
  _inherits(ArrayObserver, _ObserverBase);

  function ArrayObserver(properties) {
    _classCallCheck(this, ArrayObserver);

    return _possibleConstructorReturn(this, _getPrototypeOf(ArrayObserver).call(this, properties, prepareArray));
  } //	returns an unobserved graph (effectively this is an opposite of an ArrayObserver constructor logic)


  _createClass(ArrayObserver, [{
    key: "revoke",
    value: function revoke() {
      //	revoke native proxy
      this.revokable.revoke(); //	roll back observed array to an unobserved one

      var target = this.target;
      var l = target.length,
          item,
          tmpObserved;

      while (l) {
        l--;
        item = target[l];

        if (item && _typeof(item) === 'object') {
          tmpObserved = item[sysObsKey];

          if (tmpObserved) {
            target[l] = tmpObserved.revoke();
          }
        }
      }

      return target;
    }
  }, {
    key: "get",
    value: function get(target, key) {
      var proxiedArrayMethods = {
        pop: function proxiedPop(target, observed) {
          var poppedIndex = target.length - 1;
          var popResult = target.pop();

          if (popResult && _typeof(popResult) === 'object') {
            var tmpObserved = popResult[sysObsKey];

            if (tmpObserved) {
              popResult = tmpObserved.revoke();
            }
          } //	publish changes


          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            ad.path.push(poppedIndex);
            callObservers(ad.observers, [{
              type: DELETE,
              path: ad.path,
              oldValue: popResult,
              object: observed.proxy
            }]);
          }

          return popResult;
        },
        push: function proxiedPush(target, observed) {
          var i,
              l = arguments.length - 2,
              item,
              changes,
              path;
          var pushContent = new Array(l),
              initialLength = target.length;

          for (i = 0; i < l; i++) {
            item = arguments[i + 2];

            if (item && _typeof(item) === 'object' && !nonObservables.hasOwnProperty(item.constructor.name)) {
              item = Array.isArray(item) ? new ArrayObserver({
                target: item,
                ownKey: initialLength + i,
                parent: observed
              }).proxy : new ObjectObserver({
                target: item,
                ownKey: initialLength + i,
                parent: observed
              }).proxy;
            }

            pushContent[i] = item;
          }

          var pushResult = Reflect.apply(target.push, target, pushContent); //	publish changes

          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            changes = [];

            for (i = initialLength, l = target.length; i < l; i++) {
              path = ad.path.slice(0);
              path.push(i);
              changes[i - initialLength] = {
                type: INSERT,
                path: path,
                value: target[i],
                object: observed.proxy
              };
            }

            callObservers(ad.observers, changes);
          }

          return pushResult;
        },
        shift: function proxiedShift(target, observed) {
          var shiftResult, i, l, item, changes, tmpObserved;
          shiftResult = target.shift();

          if (shiftResult && _typeof(shiftResult) === 'object') {
            tmpObserved = shiftResult[sysObsKey];

            if (tmpObserved) {
              shiftResult = tmpObserved.revoke();
            }
          } //	update indices of the remaining items


          for (i = 0, l = target.length; i < l; i++) {
            item = target[i];

            if (item && _typeof(item) === 'object') {
              tmpObserved = item[sysObsKey];

              if (tmpObserved) {
                tmpObserved.ownKey = i;
              }
            }
          } //	publish changes


          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            ad.path.push(0);
            changes = [{
              type: DELETE,
              path: ad.path,
              oldValue: shiftResult,
              object: observed.proxy
            }];
            callObservers(ad.observers, changes);
          }

          return shiftResult;
        },
        unshift: function proxiedUnshift(target, observed) {
          var unshiftContent = Array.from(arguments);
          var changes;
          unshiftContent.splice(0, 2);
          unshiftContent.forEach(function (item, index) {
            if (item && _typeof(item) === 'object' && !nonObservables.hasOwnProperty(item.constructor.name)) {
              unshiftContent[index] = Array.isArray(item) ? new ArrayObserver({
                target: item,
                ownKey: index,
                parent: observed
              }).proxy : new ObjectObserver({
                target: item,
                ownKey: index,
                parent: observed
              }).proxy;
            }
          });
          var unshiftResult = Reflect.apply(target.unshift, target, unshiftContent);

          for (var i = 0, l = target.length, item; i < l; i++) {
            item = target[i];

            if (item && _typeof(item) === 'object') {
              var tmpObserved = item[sysObsKey];

              if (tmpObserved) {
                tmpObserved.ownKey = i;
              }
            }
          } //	publish changes


          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            var _l = unshiftContent.length;
            var path;
            changes = new Array(_l);

            for (var _i = 0; _i < _l; _i++) {
              path = ad.path.slice(0);
              path.push(_i);
              changes[_i] = {
                type: INSERT,
                path: path,
                value: target[_i],
                object: observed.proxy
              };
            }

            callObservers(ad.observers, changes);
          }

          return unshiftResult;
        },
        reverse: function proxiedReverse(target, observed) {
          var i, l, item, changes;
          target.reverse();

          for (i = 0, l = target.length; i < l; i++) {
            item = target[i];

            if (item && _typeof(item) === 'object') {
              var tmpObserved = item[sysObsKey];

              if (tmpObserved) {
                tmpObserved.ownKey = i;
              }
            }
          } //	publish changes


          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            changes = [{
              type: REVERSE,
              path: ad.path,
              object: observed.proxy
            }];
            callObservers(ad.observers, changes);
          }

          return observed.proxy;
        },
        sort: function proxiedSort(target, observed, comparator) {
          var i, l, item, changes;
          target.sort(comparator);

          for (i = 0, l = target.length; i < l; i++) {
            item = target[i];

            if (item && _typeof(item) === 'object') {
              var tmpObserved = item[sysObsKey];

              if (tmpObserved) {
                tmpObserved.ownKey = i;
              }
            }
          } //	publish changes


          var ad = getAncestorInfo(observed);

          if (ad.observers.size) {
            changes = [{
              type: SHUFFLE,
              path: ad.path,
              object: observed.proxy
            }];
            callObservers(ad.observers, changes);
          }

          return observed.proxy;
        },
        fill: function proxiedFill(target, observed) {
          var ad = getAncestorInfo(observed),
              changes = [],
              tarLen = target.length,
              normArgs = Array.from(arguments);
          normArgs.splice(0, 2);
          var argLen = normArgs.length,
              start = argLen < 2 ? 0 : normArgs[1] < 0 ? tarLen + normArgs[1] : normArgs[1],
              end = argLen < 3 ? tarLen : normArgs[2] < 0 ? tarLen + normArgs[2] : normArgs[2],
              prev = target.slice(0);
          Reflect.apply(target.fill, target, normArgs);
          var tmpObserved, path;

          for (var i = start, item, tmpTarget; i < end; i++) {
            item = target[i];

            if (item && _typeof(item) === 'object' && !nonObservables.hasOwnProperty(item.constructor.name)) {
              target[i] = Array.isArray(item) ? new ArrayObserver({
                target: item,
                ownKey: i,
                parent: observed
              }).proxy : new ObjectObserver({
                target: item,
                ownKey: i,
                parent: observed
              }).proxy;
            }

            if (prev.hasOwnProperty(i)) {
              tmpTarget = prev[i];

              if (tmpTarget && _typeof(tmpTarget) === 'object') {
                tmpObserved = tmpTarget[sysObsKey];

                if (tmpObserved) {
                  tmpTarget = tmpObserved.revoke();
                }
              }

              path = ad.path.slice(0);
              path.push(i);
              changes.push({
                type: UPDATE,
                path: path,
                value: target[i],
                oldValue: tmpTarget,
                object: observed.proxy
              });
            } else {
              path = ad.path.slice(0);
              path.push(i);
              changes.push({
                type: INSERT,
                path: path,
                value: target[i],
                object: observed.proxy
              });
            }
          } //	publish changes


          if (ad.observers.size) {
            callObservers(ad.observers, changes);
          }

          return observed.proxy;
        },
        splice: function proxiedSplice(target, observed) {
          var ad = getAncestorInfo(observed),
              changes = [],
              spliceContent = Array.from(arguments),
              tarLen = target.length;
          spliceContent.splice(0, 2);
          var splLen = spliceContent.length; //	observify the newcomers

          for (var _i2 = 2, _item; _i2 < splLen; _i2++) {
            _item = spliceContent[_i2];

            if (_item && _typeof(_item) === 'object' && !nonObservables.hasOwnProperty(_item.constructor.name)) {
              spliceContent[_i2] = Array.isArray(_item) ? new ArrayObserver({
                target: _item,
                ownKey: _i2,
                parent: observed
              }).proxy : new ObjectObserver({
                target: _item,
                ownKey: _i2,
                parent: observed
              }).proxy;
            }
          } //	calculate pointers


          var startIndex = splLen === 0 ? 0 : spliceContent[0] < 0 ? tarLen + spliceContent[0] : spliceContent[0],
              removed = splLen < 2 ? tarLen - startIndex : spliceContent[1],
              inserted = Math.max(splLen - 2, 0),
              spliceResult = Reflect.apply(target.splice, target, spliceContent),
              newTarLen = target.length; //	reindex the paths

          var tmpObserved;

          for (var _i3 = 0, _item2; _i3 < newTarLen; _i3++) {
            _item2 = target[_i3];

            if (_item2 && _typeof(_item2) === 'object') {
              tmpObserved = _item2[sysObsKey];

              if (tmpObserved) {
                tmpObserved.ownKey = _i3;
              }
            }
          } //	revoke removed Observed


          var i, l, item;

          for (i = 0, l = spliceResult.length; i < l; i++) {
            item = spliceResult[i];

            if (item && _typeof(item) === 'object') {
              tmpObserved = item[sysObsKey];

              if (tmpObserved) {
                spliceResult[i] = tmpObserved.revoke();
              }
            }
          } //	publish changes


          if (ad.observers.size) {
            var index, path;

            for (index = 0; index < removed; index++) {
              path = ad.path.slice(0);
              path.push(startIndex + index);

              if (index < inserted) {
                changes.push({
                  type: UPDATE,
                  path: path,
                  value: target[startIndex + index],
                  oldValue: spliceResult[index],
                  object: observed.proxy
                });
              } else {
                changes.push({
                  type: DELETE,
                  path: path,
                  oldValue: spliceResult[index],
                  object: observed.proxy
                });
              }
            }

            for (; index < inserted; index++) {
              path = ad.path.slice(0);
              path.push(startIndex + index);
              changes.push({
                type: INSERT,
                path: path,
                value: target[startIndex + index],
                object: observed.proxy
              });
            }

            callObservers(ad.observers, changes);
          }

          return spliceResult;
        }
      };

      if (proxiedArrayMethods.hasOwnProperty(key)) {
        return proxiedArrayMethods[key].bind(undefined, target, this);
      } else {
        return target[key];
      }
    }
  }]);

  return ArrayObserver;
}(ObserverBase);

var ObjectObserver =
/*#__PURE__*/
function (_ObserverBase2) {
  _inherits(ObjectObserver, _ObserverBase2);

  function ObjectObserver(properties) {
    _classCallCheck(this, ObjectObserver);

    return _possibleConstructorReturn(this, _getPrototypeOf(ObjectObserver).call(this, properties, prepareObject));
  } //	returns an unobserved graph (effectively this is an opposite of an ObjectObserver constructor logic)


  _createClass(ObjectObserver, [{
    key: "revoke",
    value: function revoke() {
      //	revoke native proxy
      this.revokable.revoke(); //	roll back observed graph to an unobserved one

      var target = this.target,
          keys = Object.keys(target);
      var l = keys.length,
          key,
          item,
          tmpObserved;

      while (l) {
        key = keys[--l];
        item = target[key];

        if (item && _typeof(item) === 'object') {
          tmpObserved = item[sysObsKey];

          if (tmpObserved) {
            target[key] = tmpObserved.revoke();
          }
        }
      }

      return target;
    }
  }]);

  return ObjectObserver;
}(ObserverBase);

var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);

    throw new Error('Observable MAY NOT be created via constructor, see "Observable.from" API');
  }

  _createClass(Observable, null, [{
    key: "from",
    value: function from(target) {
      if (target && _typeof(target) === 'object' && !nonObservables.hasOwnProperty(target.constructor.name) && !('observe' in target) && !('unobserve' in target) && !('revoke' in target)) {
        var observed = Array.isArray(target) ? new ArrayObserver({
          target: target,
          ownKey: null,
          parent: null
        }) : new ObjectObserver({
          target: target,
          ownKey: null,
          parent: null
        });
        return observed.proxy;
      } else {
        if (!target || _typeof(target) !== 'object') {
          throw new Error('observable MAY ONLY be created from non-null object only');
        } else if ('observe' in target || 'unobserve' in target || 'revoke' in target) {
          throw new Error('target object MUST NOT have nor own neither inherited properties from the following list: "observe", "unobserve", "revoke"');
        } else if (nonObservables.hasOwnProperty(target.constructor.name)) {
          throw new Error(target + ' found to be one of non-observable object types: ' + nonObservables);
        }
      }
    }
  }, {
    key: "isObservable",
    value: function isObservable(input) {
      return !!(input && input[sysObsKey] && input.observe);
    }
  }]);

  return Observable;
}();

Object.freeze(Observable);

// CONCATENATED MODULE: ./src/utils.js
function utils_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { utils_typeof = function _typeof(obj) { return typeof obj; }; } else { utils_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return utils_typeof(obj); }

var utils_hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return utils_hasOwnProperty.call(obj, key);
}
function isFile(val) {
  return !!val && val instanceof Blob;
}
function emptyValue(original) {
  if (original instanceof Array) {
    return [];
  }

  if (utils_typeof(original) === 'object') {
    return {};
  }

  if (typeof original === 'string') {
    return '';
  }

  return null;
}
function isObj(value) {
  return value !== null && utils_typeof(value) === 'object';
}
function isArr(value) {
  return value instanceof Array;
}
function isNil(value) {
  return value == null;
}
function isFunc(value) {
  return value instanceof Function;
}
function isStr(value) {
  return typeof value === 'string';
}
function escapeRegExp(string) {
  return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
function containsFile(obj) {
  if (isArr(obj)) {
    for (var i = 0; i < obj.length; i++) {
      if (obj[i] instanceof File) {
        return true;
      }

      if (isObj(obj[i])) {
        return containsFile(obj[i]);
      }
    }
  } else {
    for (var key in obj) {
      if (obj[key] instanceof File) {
        return true;
      }

      if (isObj(obj[key])) {
        return containsFile(obj[key]);
      }
    }
  }

  return false;
}
function arrayToObject(array) {
  var target = {};
  array.forEach(function (item, index) {
    target[index] = item;
  });
  return target;
}
// CONCATENATED MODULE: ./src/Errors.js
function Errors_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Errors_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Errors_createClass(Constructor, protoProps, staticProps) { if (protoProps) Errors_defineProperties(Constructor.prototype, protoProps); if (staticProps) Errors_defineProperties(Constructor, staticProps); return Constructor; }

function Errors_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var Errors_Errors =
/*#__PURE__*/
function () {
  /**
   * Create a new Errors instance.
   */
  function Errors() {
    Errors_classCallCheck(this, Errors);

    Errors_defineProperty(this, "errors", void 0);

    Errors_defineProperty(this, "elements", void 0);

    this.errors = {};
    this.elements = [];
  }
  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string|RegExp} field
   */


  Errors_createClass(Errors, [{
    key: "has",
    value: function has(field) {
      if (field instanceof RegExp) {
        return Object.keys(this.errors).some(function (key) {
          return field.test(key);
        });
      }

      return this.errors.hasOwnProperty(field);
    }
    /**
     * Determine if we have any errors.
     */

  }, {
    key: "any",
    value: function any() {
      return Object.keys(this.errors).length > 0;
    }
    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */

  }, {
    key: "getFirst",
    value: function getFirst(field) {
      var error = this.get(field);

      if (error) {
        if (isArr(error)) {
          return error.length ? error[0] : null;
        } else {
          return error || null;
        }
      }
    }
  }, {
    key: "get",
    value: function get(field) {
      return this.errors[field];
    }
    /**
     * Add a new error message if one doesn't already exist.
     *
     * @param {string} field
     * @param error
     * @param force
     */

  }, {
    key: "add",
    value: function add(field, error) {
      var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!this.has(field) || force) {
        this.errors[field] = error;
      }
    }
    /**
     * Record the new errors.
     *
     * @param {object} errors
     * @param timeout
     */

  }, {
    key: "record",
    value: function record(errors) {
      var _this = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
      this.errors = errors;

      if (timeout) {
        window.setTimeout(function () {
          _this.clear();
        }, timeout);
      }
    }
    /**
     * Clear one or all error fields.
     *
     * @param {string|null} field
     */

  }, {
    key: "clear",
    value: function clear(field) {
      if (field) {
        delete this.errors[field];
        return;
      }

      this.errors = {};
    }
  }, {
    key: "addElement",
    value: function addElement(key, el) {
      var _this2 = this;

      if (isArr(key)) {
        key.forEach(function (field) {
          return _this2.addElement(field, el);
        });
      } else {
        this.elements.push({
          key: key,
          el: el
        });
      }
    }
  }, {
    key: "removeElement",
    value: function removeElement(element) {
      this.elements = this.elements.filter(function (_ref) {
        var el = _ref.el;
        return el !== element;
      });
    }
  }, {
    key: "removeElementKey",
    value: function removeElementKey(field) {
      var _this3 = this;

      if (isArr(field)) {
        field.forEach(function (key) {
          return _this3.removeElementKey(key);
        });
      } else {
        this.elements = this.elements.filter(function (_ref2) {
          var key = _ref2.key;
          return key !== field;
        });
      }
    }
  }, {
    key: "hasElements",
    value: function hasElements() {
      return !!this.elements.length;
    }
  }, {
    key: "scrollToFirst",
    value: function scrollToFirst() {
      var _this4 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      options = isNil(options) ? {
        behavior: 'smooth',
        inline: 'center'
      } : options;
      var element = this.elements.find(function (_ref3) {
        var key = _ref3.key,
            el = _ref3.el;
        var rx;

        if (key instanceof RegExp) {
          rx = key;
        } else {
          var expression = escapeRegExp(key);
          rx = new RegExp(expression.replace('*', '.*'));
        }

        if (Object.keys(_this4.errors).some(function (key) {
          return rx.test(key);
        })) {
          return true;
        }
      });

      if (element) {
        element.el.scrollIntoView(options);
      }
    }
  }]);

  return Errors;
}();

/* harmony default export */ var src_Errors = (Errors_Errors);
// CONCATENATED MODULE: ./src/http.js
function http(method, url, data, options) {
  var xhr = new XMLHttpRequest();
  var response = new Promise(function (resolve, reject) {
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr);
      } else {
        reject(xhr);
      }
    };

    xhr.onerror = function () {
      return reject(xhr);
    };
  });
  xhr.open(method, url);

  if (data instanceof FormData) {
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(data);
  } else {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  return response;
}
// CONCATENATED MODULE: ./src/Form.js
function Form_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Form_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Form_createClass(Constructor, protoProps, staticProps) { if (protoProps) Form_defineProperties(Constructor.prototype, protoProps); if (staticProps) Form_defineProperties(Constructor, staticProps); return Constructor; }

function Form_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { Form_typeof = function _typeof(obj) { return typeof obj; }; } else { Form_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return Form_typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Form_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Form_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







function parseOptions(method, url, options) {
  method = method ? isObj(method) ? method : {
    method: method
  } : {};
  url = url ? isObj(url) ? url : {
    url: url
  } : {};
  options = options || {};
  return _objectSpread({}, options, {}, url, {}, method);
}

function flattenToQueryParams(data) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var params = {};

  if (isArr(data)) {
    data.forEach(function (item) {
      var paramKey = "".concat(prefix, "[]");

      if (isObj(item) && !isFile(item)) {
        params = _objectSpread({}, params, {}, flattenToQueryParams(item, paramKey));
        return;
      }

      params[paramKey] = isFile(item) ? item : formValueToString(item);
    });
  } else {
    Object.keys(data).forEach(function (key) {
      var item = data[key];
      var paramKey = prefix ? "".concat(prefix, "[").concat(key, "]") : '' + key;

      if (isObj(item) && !isFile(item)) {
        params = _objectSpread({}, params, {}, flattenToQueryParams(item, paramKey));
        return;
      }

      params[paramKey] = isFile(item) ? item : formValueToString(item);
    });
  }

  return params;
}

function formValueToString(value) {
  if (typeof value === 'boolean') {
    return '' + +value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return value || '';
}

function bubbleError(error) {
  if (error instanceof Error) {
    throw error;
  }

  return Promise.reject(error);
}

function isValidErrorObject(errors) {
  return !errors || Form_typeof(errors) !== 'object' || !Object.keys(errors).length || Object.values(errors).some(function (error) {
    if (isArr(error)) {
      return error.some(function (message) {
        return !isStr(message);
      });
    }

    return !isStr(error);
  });
}

var Form_Form =
/*#__PURE__*/
function () {
  function Form(data, options) {
    var _this = this;

    Form_classCallCheck(this, Form);

    Form_defineProperty(this, "errors", void 0);

    Form_defineProperty(this, "data", void 0);

    Form_defineProperty(this, "originalData", void 0);

    Form_defineProperty(this, "originalConstantData", void 0);

    Form_defineProperty(this, "options", void 0);

    this.setOptions(options);
    this.originalData = {};
    this.originalConstantData = {};
    this.data = Observable.from({});
    this.append(data);
    this.errors = new src_Errors(); // $FlowFixMe

    this.data.observe(function (changes) {
      changes.forEach(function (_ref) {
        var path = _ref.path;
        _this.options.autoRemoveError && _this.errors.clear(path.join('.'));
      });
    });
  }

  Form_createClass(Form, [{
    key: "setOptions",
    value: function setOptions(options) {
      this.options = this.options || Form.defaultOptions;

      if (options) {
        this.options = _objectSpread({}, this.options, {}, options);
      }
    }
  }, {
    key: "append",
    value: function append(key, value) {
      var _this2 = this;

      var constant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isObj(key)) {
        Object.keys(key).forEach(function (field) {
          _this2.append(field, key[field], constant);
        });
        return this;
      }

      if (constant) {
        this.originalConstantData[key] = value;
      } else {
        this.originalData[key] = value;
      }

      if (!constant) {
        this.data[key] = value;
        this.defineProperty(key);
      } else {
        Object.defineProperty(this, key, {
          get: function get() {
            return undefined;
          },
          set: function set() {
            throw new Error("The \"".concat(key, "\" value has been set as constant and cannot be modified"));
          }
        });
      }

      return this;
    }
  }, {
    key: "defineProperty",
    value: function defineProperty(key) {
      var _this3 = this;

      Object.defineProperty(this, key, {
        get: function get() {
          return _this3.data[key];
        },
        set: function set(newValue) {
          _this3.setData(key, newValue);
        }
      });
    }
  }, {
    key: "constantData",
    value: function constantData(key, value) {
      return this.append(key, value, true);
    }
  }, {
    key: "getData",
    value: function getData() {
      var data = _objectSpread({}, this.data, {}, this.originalConstantData);

      delete data[sysObsKey];
      return data;
    }
  }, {
    key: "setData",
    value: function setData(key, value) {
      this.data[key] = value;
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var field in this.data) {
        this.data[field] = this.originalData[field];
      }

      this.errors.clear();
      return this;
    }
  }, {
    key: "clear",
    value: function clear(field) {
      if (hasOwn(this, field)) {
        this.data[field] = emptyValue(this.data[field]);
      }

      return this;
    }
  }, {
    key: "addFileFromEvent",
    value: function addFileFromEvent(event, key) {
      var node = event.target;

      if (!(node instanceof HTMLInputElement)) {
        throw new Error('Incompatible event target, must be of type HTMLInputElement');
      }

      if (!key) {
        key = node.name;
      }

      if (key in this && node.value !== '') {
        if (event instanceof DragEvent) {
          this.setData(key, event.dataTransfer && event.dataTransfer.files.length && event.dataTransfer.files[0]);
        } else {
          this.setData(key, node.files && node.files.length && node.files[0]);
        }

        node.value = '';
      }

      return this;
    }
  }, {
    key: "post",
    value: function post(url, options) {
      return this.submit('post', url, options);
    }
  }, {
    key: "put",
    value: function put(url, options) {
      return this.submit('put', url, options);
    }
  }, {
    key: "patch",
    value: function patch(url, options) {
      return this.submit('patch', url, options);
    }
  }, {
    key: "delete",
    value: function _delete(url, options) {
      return this.submit('delete', url, options);
    }
  }, {
    key: "get",
    value: function get(url, options) {
      return this.submit('get', url, options);
    }
  }, {
    key: "graphql",
    value: function graphql(query, options) {
      var _this4 = this;

      options = options || {};
      var originalFormatDataCallback = options.formatData;
      options.url = options.graphql || this.options.graphql;
      options.useJson = !this.hasFile();

      options.formatData = function (data) {
        data = originalFormatDataCallback ? originalFormatDataCallback(data) : data;
        var operations = {
          query: query,
          variables: data
        };

        if (!_this4.hasFile()) {
          return operations;
        }

        var _extractFiles = extractFiles(data),
            clone = _extractFiles.clone,
            files = _extractFiles.files;

        operations.variables = clone;
        return _objectSpread({
          operations: JSON.stringify(operations),
          map: JSON.stringify(arrayToObject(Array.from(files.values())))
        }, arrayToObject(Array.from(files.keys())));
      };

      return this.post(options);
    }
  }, {
    key: "submit",
    value: function submit(method, url, options) {
      var _this5 = this;

      options = parseOptions(method, url, options);

      var requestOptions = _objectSpread({}, this.options, {}, options);

      var formData,
          data = requestOptions.formatData(this.getData());

      if (this.shouldConvertToFormData(requestOptions)) {
        formData = new FormData();
        var params = flattenToQueryParams(data);
        Object.keys(params).forEach(function (key) {
          formData.append(key, params[key]);
        });
        data = formData;
      }

      var httpAdapter = requestOptions.sendWith;
      return httpAdapter(requestOptions.method, this.buildBaseUrl(requestOptions), data, requestOptions).then(function (response) {
        if (requestOptions.isValidationError(response)) {
          _this5.onFail(response, requestOptions);
        } else {
          _this5.onSuccess(requestOptions);
        }

        return response;
      }).catch(function (error) {
        if (requestOptions.isValidationError(error)) {
          _this5.onFail(error, requestOptions);
        }

        return bubbleError(error);
      });
    }
  }, {
    key: "shouldConvertToFormData",
    value: function shouldConvertToFormData(options) {
      options = options || this.options;

      if (!options.useJson) {
        return true;
      }

      if (this.hasFile() && options.strictMode) {
        throw new Error('Cannot convert a file to JSON');
      }

      return this.hasFile();
    }
  }, {
    key: "hasFile",
    value: function hasFile() {
      return containsFile(this.getData());
    }
  }, {
    key: "onSuccess",
    value: function onSuccess(options) {
      options = options || this.options;

      if (options.clear) {
        this.reset();
      }
    }
  }, {
    key: "onFail",
    value: function onFail(error, options) {
      options = options || this.options;

      if (!options.quiet) {
        var errors = options.formatErrorResponse(error);
        this.errors.record(errors, options.timeout);

        if (this.errors.hasElements()) {
          this.errors.scrollToFirst();
        }
      }
    }
  }, {
    key: "buildBaseUrl",
    value: function buildBaseUrl(options) {
      options = options || this.options;

      if (options.url.includes('://')) {
        return options.url;
      }

      var baseUrl = options.baseUrl;
      var relativeUrl = options.url;
      baseUrl = baseUrl.replace(/\/+$/g, '');
      relativeUrl = relativeUrl.replace(/^\/+/g, '');
      return "".concat(baseUrl, "/").concat(relativeUrl);
    }
  }, {
    key: "makeUrl",
    value: function makeUrl(options) {
      var url = this.buildBaseUrl(options);
      var queryStart = url.includes('?') ? '&' : '?';
      var fullUrl = url + queryStart;
      var properties = [];
      var data = this.getData();
      var params = flattenToQueryParams(data);
      Object.keys(params).forEach(function (key) {
        var item = params[key];

        if (isFile(item)) {
          throw new Error('Cannot convert file to a string');
        }

        properties.push(key + (isNil(item) ? '' : "=".concat(item)));
      });
      return fullUrl + properties.join('&');
    }
  }, {
    key: "addElement",
    value: function addElement(key, el) {
      this.errors.addElement(key, el);
    }
  }, {
    key: "removeElement",
    value: function removeElement(el) {
      this.errors.removeElement(el);
    }
  }, {
    key: "removeElementKey",
    value: function removeElementKey(key) {
      this.errors.removeElementKey(key);
    }
  }]);

  return Form;
}();

Form_defineProperty(Form_Form, "defaultOptions", {
  // The default method type used by the submit method
  method: 'post',
  // If set any relative urls will be appended to the baseUrl
  baseUrl: '',
  // The url to submit the form
  url: '',
  // The endpoint to use for all graphql queries
  graphql: 'graphql',
  // A callback to implement custom HTTP logic.
  // It is recommended to use this option so the form can utilise your HTTP library.
  // The callback should return a promise that the form can use to handle the response.
  sendWith: http,
  // Set to true if you want the form to submit the data as a json object.
  // This will pass the data as a JavaScript object to the sendWith callback so it is up to you to stringify it for your HTTP library.
  // If the data contains a File or Blob object the data will be a FormData object regardless of this option (unless strictMode is true).
  useJson: false,
  // If set to true the form will throw an Error if the data has a File or Blob object and the useJson option is true.
  strictMode: false,
  // The status code for which the form should handle validation errors.
  isValidationError: function isValidationError(_ref2) {
    var status = _ref2.status;
    return status === 422;
  },
  // A callback to format the data before sending it.
  formatData: function formatData(data) {
    return data;
  },
  // A callback that should turn the error response into an object of field names and their validation errors.
  formatErrorResponse: function formatErrorResponse(response) {
    var data = response.data || response.response;

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error('Unable to find errors in the response');
      }
    }

    var errors = data.errors;

    if (isValidErrorObject(errors)) {
      throw new Error('Unable to find errors in the response');
    }

    return errors;
  },
  // The number of milliseconds to wait before clearing the error messages.
  // When timeout is false the error messages will stay indefinitely.
  timeout: false,
  // When set to true the errors for a field will be cleared when that field's value is updated.
  autoRemoveError: true,
  // When set to true, the data will be reverted to it's original values after a successful request.
  clear: true,
  // When set to true, no errors will be recorded.
  quiet: false
});

Form_defineProperty(Form_Form, "setOptions", function (options) {
  Form_Form.defaultOptions = _objectSpread({}, Form_Form.defaultOptions, {}, options);
});

/* harmony default export */ var src_Form = __webpack_exports__["default"] = (Form_Form);

/***/ })
/******/ ]);
});
//# sourceMappingURL=Form.map