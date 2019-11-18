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

// CONCATENATED MODULE: ./src/utils.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var utils_hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return utils_hasOwnProperty.call(obj, key);
}
function isFile(val) {
  return !!val && val instanceof Blob;
}
function utils_clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function emptyValue(original) {
  if (original instanceof Array) {
    return [];
  }

  if (_typeof(original) === 'object') {
    return {};
  }

  if (typeof original === 'string') {
    return '';
  }

  return null;
}
function isObj(value) {
  return value !== null && _typeof(value) === 'object';
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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var Errors_Errors =
/*#__PURE__*/
function () {
  /**
   * Create a new Errors instance.
   */
  function Errors() {
    _classCallCheck(this, Errors);

    _defineProperty(this, "errors", void 0);

    _defineProperty(this, "elements", void 0);

    this.errors = {};
    this.elements = [];
  }
  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string|RegExp} field
   */


  _createClass(Errors, [{
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
    Form_classCallCheck(this, Form);

    Form_defineProperty(this, "errors", void 0);

    Form_defineProperty(this, "data", void 0);

    Form_defineProperty(this, "originalData", void 0);

    Form_defineProperty(this, "originalConstantData", void 0);

    Form_defineProperty(this, "options", void 0);

    this.setOptions(options);
    this.originalData = {};
    this.originalConstantData = {};
    this.data = {};
    this.append(data);
    this.errors = new src_Errors();
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
      var _this = this;

      var constant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Form_typeof(key) === 'object') {
        Object.keys(key).forEach(function (field) {
          _this.append(field, key[field], constant);
        });
        return this;
      }

      value = this.parseData(value);

      if (constant) {
        this.originalConstantData[key] = value;
      } else {
        this.originalData[key] = isFile(value) ? value : utils_clone(value);
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
      var _this2 = this;

      Object.defineProperty(this, key, {
        get: function get() {
          return _this2.data[key];
        },
        set: function set(newValue) {
          _this2.setData(key, newValue);
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
      return _objectSpread({}, this.data, {}, this.originalConstantData);
    }
  }, {
    key: "setData",
    value: function setData(key, value) {
      this.data[key] = value;

      if (this.options.autoRemoveError) {
        this.errors.clear(key);
      }
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
    key: "parseData",
    value: function parseData(data) {
      return this.options.clone && !isFile(data) ? utils_clone(data) : data;
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
      var _this3 = this;

      options = options || {};
      var originalFormatDataCallback = options.formatData || this.options.formatData;
      options.url = options.graphql || this.options.graphql;
      options.useJson = !this.hasFile();

      options.formatData = function (data) {
        data = originalFormatDataCallback ? originalFormatDataCallback(data) : data;
        var operations = {
          query: query,
          variables: data
        };

        if (!_this3.hasFile()) {
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
      var _this4 = this;

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
          _this4.onFail(response, requestOptions);
        } else {
          _this4.onSuccess(requestOptions);
        }

        return response;
      }).catch(function (error) {
        if (requestOptions.isValidationError(error)) {
          _this4.onFail(error, requestOptions);
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
  isValidationError: function isValidationError(_ref) {
    var status = _ref.status;
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
  quiet: false,
  // If clone is set to false any nested objects and arrays will be stored in the form by reference.
  clone: true
});

Form_defineProperty(Form_Form, "setOptions", function (options) {
  Form_Form.defaultOptions = _objectSpread({}, Form_Form.defaultOptions, {}, options);
});

/* harmony default export */ var src_Form = __webpack_exports__["default"] = (Form_Form);

/***/ })
/******/ ]);
});
//# sourceMappingURL=Form.map