"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

var _Errors = _interopRequireDefault(require("./Errors"));

var _http = _interopRequireDefault(require("./http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parseOptions(method, url, options) {
  method = method ? (0, _utils.isObj)(method) ? method : {
    method: method
  } : {};
  url = url ? (0, _utils.isObj)(url) ? url : {
    url: url
  } : {};
  options = options || {};
  return _objectSpread({}, options, {}, url, {}, method);
}

function flattenToQueryParams(data) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var params = {};

  if ((0, _utils.isArr)(data)) {
    data.forEach(function (item) {
      var paramKey = "".concat(prefix, "[]");

      if ((0, _utils.isObj)(item) && !(0, _utils.isFile)(item)) {
        params = _objectSpread({}, params, {}, flattenToQueryParams(item, paramKey));
        return;
      }

      params[paramKey] = (0, _utils.isFile)(item) ? item : formValueToString(item);
    });
  } else {
    Object.keys(data).forEach(function (key) {
      var item = data[key];
      var paramKey = prefix ? "".concat(prefix, "[").concat(key, "]") : '' + key;

      if ((0, _utils.isObj)(item) && !(0, _utils.isFile)(item)) {
        params = _objectSpread({}, params, {}, flattenToQueryParams(item, paramKey));
        return;
      }

      params[paramKey] = (0, _utils.isFile)(item) ? item : formValueToString(item);
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
  return !errors || _typeof(errors) !== 'object' || !Object.keys(errors).length || Object.values(errors).some(function (error) {
    if ((0, _utils.isArr)(error)) {
      return error.some(function (message) {
        return !(0, _utils.isStr)(message);
      });
    }

    return !(0, _utils.isStr)(error);
  });
}

var Form =
/*#__PURE__*/
function () {
  function Form(data, options) {
    _classCallCheck(this, Form);

    _defineProperty(this, "errors", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "originalData", void 0);

    _defineProperty(this, "originalConstantData", void 0);

    _defineProperty(this, "options", void 0);

    this.setOptions(options);
    this.originalData = {};
    this.originalConstantData = {};
    this.data = {};
    this.append(data);
    this.errors = new _Errors.default();
  }

  _createClass(Form, [{
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

      if (_typeof(key) === 'object') {
        Object.keys(key).forEach(function (field) {
          _this.append(field, key[field], constant);
        });
        return this;
      }

      value = this.parseData(value);

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
      if ((0, _utils.hasOwn)(this, field)) {
        this.data[field] = (0, _utils.emptyValue)(this.data[field]);
      }

      return this;
    }
  }, {
    key: "parseData",
    value: function parseData(data) {
      return this.options.clone && !(0, _utils.isFile)(data) ? (0, _utils.clone)(data) : data;
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
    key: "submit",
    value: function submit(method, url, options) {
      var _this3 = this;

      options = parseOptions(method, url, options);

      var requestOptions = _objectSpread({}, this.options, {}, options);

      var formData,
          data = this.getData();

      if (this.shouldConvertToFormData(requestOptions)) {
        formData = new FormData();
        var params = flattenToQueryParams(data);
        Object.keys(params).forEach(function (key) {
          formData.append(key, params[key]);
        });
        data = formData;
      }

      var httpAdapter = requestOptions.sendWith;
      return httpAdapter(requestOptions.method, this.buildBaseUrl(requestOptions), data).then(function (response) {
        if (requestOptions.isValidationError(response)) {
          _this3.onFail(response, requestOptions);
        } else {
          _this3.onSuccess(requestOptions);
        }

        return response;
      }).catch(function (error) {
        if (requestOptions.isValidationError(error)) {
          _this3.onFail(error, requestOptions);
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
      return (0, _utils.containsFile)(this.getData());
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

        if ((0, _utils.isFile)(item)) {
          throw new Error('Cannot convert file to a string');
        }

        properties.push(key + ((0, _utils.isNil)(item) ? '' : "=".concat(item)));
      });
      return fullUrl + properties.join('&');
    }
  }, {
    key: "addElement",
    value: function addElement(key, el) {
      this.errors.addElement(key, el);
    }
  }]);

  return Form;
}();

_defineProperty(Form, "defaultOptions", {
  // The default method type used by the submit method
  method: 'post',
  // If set any relative urls will be appended to the baseUrl
  baseUrl: '',
  // The url to submit the form
  url: '',
  // A callback to implement custom HTTP logic.
  // It is recommended to use this option so the form can utilise your HTTP library.
  // The callback should return a promise that the form can use to handle the response.
  sendWith: _http.default,
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

_defineProperty(Form, "setOptions", function (options) {
  Form.defaultOptions = _objectSpread({}, Form.defaultOptions, {}, options);
});

var _default = Form;
exports.default = _default;