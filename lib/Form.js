(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["formla"] = factory();
	else
		root["formla"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 562:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



exports.__esModule = true
exports.extractFiles = extractFiles

var _ReactNativeFile = __webpack_require__(850)

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
    value instanceof _ReactNativeFile.ReactNativeFile
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


/***/ }),

/***/ 568:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;


__webpack_unused_export__ = true
__webpack_unused_export__ = exports.lm = void 0

var _extractFiles = __webpack_require__(562)

exports.lm = _extractFiles.extractFiles

var _ReactNativeFile = __webpack_require__(850)

__webpack_unused_export__ = _ReactNativeFile.ReactNativeFile


/***/ }),

/***/ 850:
/***/ ((__unused_webpack_module, exports) => {



exports.__esModule = true
exports.ReactNativeFile = void 0

var ReactNativeFile = function ReactNativeFile(_ref) {
  var uri = _ref.uri,
    name = _ref.name,
    type = _ref.type
  this.uri = uri
  this.name = name
  this.type = type
}

exports.ReactNativeFile = ReactNativeFile


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src_Form)
});

// EXTERNAL MODULE: ./node_modules/extract-files/lib/index.js
var lib = __webpack_require__(568);
;// ./src/utils.js
const utils_hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return utils_hasOwnProperty.call(obj, key);
}
function isFile(val) {
  return !!val && val instanceof Blob;
}
function clone(obj) {
  if (isArr(obj)) {
    return obj.map(clone);
  }
  if (obj === null || obj === undefined) {
    return null;
  }
  if (isFile(obj) || ['number', 'string', 'boolean'].includes(typeof obj)) {
    return obj;
  }
  if (isObj(obj)) {
    let target = {};
    Object.keys(obj).forEach(key => target[key] = clone(obj[key]));
    return target;
  }
}
function emptyValue(original) {
  if (original instanceof Array) {
    return [];
  }
  if (typeof original === 'object') {
    return {};
  }
  if (typeof original === 'string') {
    return '';
  }
  return null;
}
function isObj(value) {
  return value !== null && typeof value === 'object';
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
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] instanceof File) {
        return true;
      }
      if (isObj(obj[i])) {
        return containsFile(obj[i]);
      }
    }
  } else {
    for (let key in obj) {
      if (obj[key] instanceof File) {
        return true;
      }
      if (isObj(obj[key]) && containsFile(obj[key])) {
        return true;
      }
    }
  }
  return false;
}
function arrayToObject(array) {
  let target = {};
  array.forEach((item, index) => {
    target[index] = item;
  });
  return target;
}
function isInViewport(el) {
  const boundingBox = el.getBoundingClientRect();
  // $FlowFixMe
  return boundingBox.top >= 0 && boundingBox.bottom <= (window.innerHeight || window.document.documentElement.clientHeight);
}
;// ./src/Errors.js
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

class Errors {
  /**
   * Create a new Errors instance.
   */
  constructor() {
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
  has(field) {
    if (field instanceof RegExp) {
      return Object.keys(this.errors).some(key => field.test(key));
    }
    return this.errors.hasOwnProperty(field);
  }

  /**
   * Determine if we have any errors.
   */
  any() {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field
   */
  getFirst(field, matchWildCards = true) {
    let error = this.get(field, matchWildCards);
    if (error) {
      if (isArr(error)) {
        return error.length ? error[0] : null;
      } else {
        return error || null;
      }
    }
  }
  get(field, matchWildCards = true) {
    if (field.includes('*') && matchWildCards) {
      const regExpStr = field.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace('*', '(.*)');
      const regExp = new RegExp(regExpStr);
      let errors = [];
      Object.keys(this.errors).forEach(key => {
        if (regExp.test(key)) {
          const keyErrors = this.errors[key];
          if (isArr(keyErrors)) {
            errors = errors.concat(keyErrors);
          } else {
            errors.push(keyErrors);
          }
        }
      });
      return errors;
    }
    return this.errors[field];
  }

  /**
   * Add a new error message if one doesn't already exist.
   *
   * @param {string} field
   * @param error
   * @param force
   */
  add(field, error, force = false) {
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
  record(errors, timeout = 3000) {
    this.errors = errors;
    if (timeout) {
      window.setTimeout(() => {
        this.clear();
      }, timeout);
    }
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear(field) {
    if (field) {
      const {
        [field]: _,
        ...rest
      } = this.errors;
      this.errors = rest;
      return;
    }
    this.errors = {};
  }
  addElement(key, el) {
    if (isArr(key)) {
      key.forEach(field => this.addElement(field, el));
    } else {
      this.elements.push({
        key,
        el
      });
    }
  }
  removeElement(element) {
    this.elements = this.elements.filter(({
      el
    }) => el !== element);
  }
  removeElementKey(field) {
    if (isArr(field)) {
      field.forEach(key => this.removeElementKey(key));
    } else {
      this.elements = this.elements.filter(({
        key
      }) => key !== field);
    }
  }
  hasElements() {
    return !!this.elements.length;
  }
  scrollToFirst(options = null) {
    options = isNil(options) ? {
      behavior: 'smooth',
      inline: 'center'
    } : options;
    const element = this.elements.find(({
      key,
      el
    }) => {
      let rx;
      if (key instanceof RegExp) {
        rx = key;
      } else {
        let expression = escapeRegExp(key);
        rx = new RegExp(expression.replace('*', '.*'));
      }
      if (Object.keys(this.errors).some(key => rx.test(key))) {
        return true;
      }
    });
    if (element && !isInViewport(element.el)) {
      element.el.scrollIntoView(options);
    }
  }
}
/* harmony default export */ const src_Errors = (Errors);
;// ./src/http.js
function http(method, url, data, options) {
  let xhr = new XMLHttpRequest();
  let response = new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr);
      } else {
        reject(xhr);
      }
    };
    xhr.onerror = () => reject(xhr);
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
;// ./src/Form.js
var _Form;
function Form_defineProperty(e, r, t) { return (r = Form_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Form_toPropertyKey(t) { var i = Form_toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function Form_toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




function set(obj, keys, value) {
  if (isStr(keys) || typeof keys === 'number') {
    keys = ('' + keys).split('.');
  }
  let key = keys.shift();
  if (!isObj(obj) || isFile(obj)) {
    return;
  }
  if (!keys.length) {
    if (isArr(obj)) {
      obj[+key] = value;
    } else {
      obj[key] = value;
    }
  } else {
    if (!hasOwn(obj, key)) {
      if (isArr(obj)) {
        obj[+key] = key === '0' ? [] : {};
      } else {
        obj[key] = key === '0' ? [] : {};
      }
    }
    if (isArr(obj)) {
      set(obj[+key], keys, value);
    } else {
      set(obj[key], keys, value);
    }
  }
}
function get(obj, keys) {
  if (isStr(keys)) {
    keys = keys.split('.');
  }
  let key = keys.shift();
  if (!isObj(obj) || isFile(obj) || !hasOwn(obj, key)) {
    return undefined;
  }
  let result;
  if (isArr(obj)) {
    result = obj[+key];
  } else if (isObj(obj) && !isFile(obj)) {
    result = obj[key];
  } else {
    result = undefined;
  }
  if (!keys.length) {
    return result;
  }
  get(result, keys);
}
function parseOptions(method, url, options) {
  method = method ? isObj(method) ? method : {
    method
  } : {};
  url = url ? isObj(url) ? url : {
    url
  } : {};
  options = options || {};
  return {
    ...options,
    ...url,
    ...method
  };
}
function flattenToQueryParams(data, prefix = '') {
  let params = [];
  if (isArr(data)) {
    data.forEach((item, index) => {
      let paramKey = `${prefix}[${index}]`;
      if (isObj(item) && !isFile(item)) {
        params = params.concat(flattenToQueryParams(item, paramKey));
        return;
      }
      params.push([paramKey, isFile(item) ? item : formValueToString(item)]);
    });
  } else {
    Object.keys(data).forEach(key => {
      let item = data[key];
      let paramKey = prefix ? `${prefix}[${key}]` : '' + key;
      if (isObj(item) && !isFile(item)) {
        params = params.concat(flattenToQueryParams(item, paramKey));
        return;
      }
      params.push([paramKey, isFile(item) ? item : formValueToString(item)]);
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
  return !errors || typeof errors !== 'object' || !Object.keys(errors).length || Object.values(errors).some(error => {
    if (isArr(error)) {
      return error.some(message => !isStr(message));
    }
    return !isStr(error);
  });
}
class Form {
  constructor(data, options) {
    Form_defineProperty(this, "_errors", void 0);
    Form_defineProperty(this, "_data", void 0);
    Form_defineProperty(this, "_dataCb", void 0);
    Form_defineProperty(this, "_originalData", void 0);
    Form_defineProperty(this, "_originalConstantData", void 0);
    Form_defineProperty(this, "_options", void 0);
    this.setOptions(options);
    if (isFunc(data)) {
      this._dataCb = data;
      data = data();
    }
    this._originalData = {};
    this._originalConstantData = {};
    this._data = {};

    // $FlowFixMe
    this.append(data, undefined, false, false);
    this._errors = new src_Errors();
  }
  setOptions(options) {
    this._options = this._options || Form.defaultOptions;
    if (options) {
      this._options = {
        ...this._options,
        ...options
      };
    }
  }
  append(key, value, constant = false, addToDataCallback = true) {
    if (this._dataCb && !constant && this._options.addAppendToDataCallback && addToDataCallback) {
      const originalCb = this._dataCb;
      this._dataCb = () => {
        const data = originalCb();
        if (isObj(key)) {
          return {
            ...data,
            ...key
          };
        }
        return {
          ...data,
          [key]: value
        };
      };
    }
    if (isObj(key)) {
      Object.keys(key).forEach(field => {
        this.append(field, key[field], constant, false);
      });
      return this;
    }
    value = this.parseData(value);
    if (constant) {
      set(this._originalConstantData, key, value);
    } else {
      set(this._originalData, key, this.parseData(value));
    }
    if (!constant) {
      set(this._data, key, value);
      this.defineProperty(key);
    } else {
      Object.defineProperty(this, key, {
        get: () => undefined,
        set: () => {
          throw new Error(`The "${key}" value has been set as constant and cannot be modified`);
        }
      });
    }
    return this;
  }
  defineProperty(key) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: () => get(this._data, key),
      set: newValue => {
        this.setData(key, newValue);
      }
    });
  }
  constantData(key, value) {
    return this.append(key, value, true, false);
  }
  getData() {
    return {
      ...this._data,
      ...this._originalConstantData
    };
  }
  setData(key, value) {
    set(this._data, key, value);
    if (this._options.autoRemoveError) {
      this._errors.clear(key);
    }
  }
  errors() {
    return this._errors;
  }
  reset() {
    const originalData = this._dataCb ? this._dataCb() : this._originalData;
    for (let field in this._data) {
      // $FlowFixMe
      delete this[field];
    }
    this._originalData = {};
    this._data = {};
    this.append(originalData, undefined, false, false);
    this._errors.clear();
    return this;
  }
  clear(field) {
    if (hasOwn(this, field)) {
      set(this._data, field, emptyValue(get(this._data, field)));
    }
    return this;
  }
  parseData(data) {
    return this._options.clone ? clone(data) : data;
  }
  addFileFromEvent(event, key) {
    let node = event.target;
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
  post(url, options) {
    return this.submit('post', url, options);
  }
  put(url, options) {
    return this.submit('put', url, options);
  }
  patch(url, options) {
    return this.submit('patch', url, options);
  }
  delete(url, options) {
    return this.submit('delete', url, options);
  }
  get(url, options) {
    return this.submit('get', url, options);
  }
  graphql(query, options) {
    options = options || {};
    const originalFormatDataCallback = options.formatData || this._options.formatData;
    options.url = options.graphql || this._options.graphql;
    options.query = query;
    if (typeof options.useJson === 'undefined') {
      options.useJson = !this.hasFile();
    }
    options.formatData = data => {
      data = originalFormatDataCallback ? originalFormatDataCallback(data) : data;
      const operations = {
        query,
        variables: data
      };
      if (!this.hasFile()) {
        return operations;
      }
      const {
        clone,
        files
      } = (0,lib/* extractFiles */.lm)(data);
      operations.variables = clone;
      return {
        operations: JSON.stringify(operations),
        map: JSON.stringify(arrayToObject(Array.from(files.values()))),
        ...arrayToObject(Array.from(files.keys()))
      };
    };
    return this.post(options);
  }
  submit(method, url, options) {
    options = parseOptions(method, url, options);
    const requestOptions = {
      ...this._options,
      ...options
    };
    let formData,
      data = requestOptions.formatData(this.getData());
    if (this.shouldConvertToFormData(requestOptions)) {
      formData = new FormData();
      let params = flattenToQueryParams(data);
      params.forEach(([key, param]) => {
        formData.append(key, param);
      });
      data = formData;
    }
    let httpAdapter = requestOptions.sendWith;
    const finalUrl = this.buildBaseUrl(requestOptions);
    delete requestOptions.baseUrl; // This is a reserved key by axios so it complains if we pass it

    return httpAdapter(requestOptions.method, finalUrl, data, requestOptions).then(response => {
      if (requestOptions.isValidationError(response)) {
        this.onFail(response, requestOptions);
      } else {
        this.onSuccess(requestOptions);
      }
      return response;
    }).catch(error => {
      if (requestOptions.isValidationError(error)) {
        this.onFail(error, requestOptions);
      }
      return bubbleError(error);
    });
  }
  shouldConvertToFormData(options) {
    options = options || this._options;
    if (options.strictMode) {
      return !options.useJson;
    }
    return !options.useJson || this.hasFile();
  }
  hasFile() {
    return containsFile(this.getData());
  }
  onSuccess(options) {
    options = options || this._options;
    if (options.clear) {
      this.reset();
    }
  }
  onFail(error, options) {
    options = options || this._options;
    if (!options.quiet) {
      let errors = options.formatErrorResponse(error);
      this._errors.record(errors, options.timeout);
      if (this._errors.hasElements()) {
        this._errors.scrollToFirst();
      }
    }
  }
  buildBaseUrl(options) {
    options = options || this._options;
    if (options.url.includes('://')) {
      return options.url;
    }
    let baseUrl = options.baseUrl;
    let relativeUrl = options.url;
    baseUrl = baseUrl.replace(/\/+$/g, '');
    relativeUrl = relativeUrl.replace(/^\/+/g, '');
    return `${baseUrl}/${relativeUrl}`;
  }
  makeUrl(options) {
    let url = this.buildBaseUrl(options);
    let queryStart = url.includes('?') ? '&' : '?';
    let fullUrl = url + queryStart;
    let properties = [];
    let data = this.getData();
    let params = flattenToQueryParams(data);
    params.forEach(([key, item]) => {
      if (isFile(item)) {
        throw new Error('Cannot convert file to a string');
      }
      properties.push(key + (isNil(item) ? '' : `=${item}`));
    });
    return fullUrl + properties.join('&');
  }
  addElement(key, el) {
    this._errors.addElement(key, el);
  }
  removeElement(el) {
    this._errors.removeElement(el);
  }
  removeElementKey(key) {
    this._errors.removeElementKey(key);
  }
}
_Form = Form;
Form_defineProperty(Form, "defaultOptions", {
  // The default method type used by the submit method
  method: 'post',
  // If set any relative urls will be appended to the baseUrl
  baseUrl: '',
  // The url to submit the form
  url: '',
  // The endpoint to use for all graphql queries
  graphql: 'graphql',
  query: '',
  // A callback to implement custom HTTP logic.
  // It is recommended to use this option so the form can utilise your HTTP library.
  // The callback should return a promise that the form can use to handle the response.
  sendWith: http,
  // Set to true if you want the form to submit the data as a json object.
  // This will pass the data as a JavaScript object to the sendWith callback so it is up to you to stringify it for your HTTP library.
  // If the data contains a File or Blob object the data will be a FormData object regardless of this option (unless strictMode is true).
  useJson: false,
  // If set to true the form will use follow the `useJson` option even if the data contains non JSONable values (including files).
  strictMode: false,
  // The status code for which the form should handle validation errors.
  isValidationError: ({
    status
  }) => status === 422,
  // A callback to format the data before sending it.
  formatData: data => data,
  // A callback that should turn the error response into an object of field names and their validation errors.
  formatErrorResponse: response => {
    let data = response.data || response.response;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error('Unable to find errors in the response');
      }
    }
    let errors = data.errors;
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
  clone: true,
  // If the form is called with a callback constructor then any data added
  // later will be included when the form is reset. Set this to false to
  // have the form reset using just the callback.
  addAppendToDataCallback: true
});
Form_defineProperty(Form, "setOptions", function (options) {
  _Form.defaultOptions = {
    ..._Form.defaultOptions,
    ...options
  };
});
/* harmony default export */ const src_Form = (Form);
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=Form.map