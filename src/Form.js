// @flow
import { extractFiles } from 'extract-files';
import type { ErrorValues } from './Errors';
import Errors from './Errors';
import type { Method } from './flow';
import http from './http';
import { arrayToObject, clone, containsFile, emptyValue, hasOwn, isArr, isFile, isNil, isObj, isStr, isFunc } from './utils';

type PrimitiveFormValue = string | number | boolean | null | typeof undefined;

type ScalarFormValue = PrimitiveFormValue | Blob | File;

type FormValue = ScalarFormValue | Array<?FormValue> | { [string]: ?FormValue };

export type Data = { [string]: FormValue };

type DataCb = () => Data;

type Options = {
    method: Method,
    baseUrl: string,
    url: string,
    graphql: string,
    sendWith: (method: Method, url: string, data: FormData | Data, options: Options) => Promise<any>,
    useJson: boolean,
    strictMode: boolean,
    isValidationError: ({ status: number }) => boolean,
    formatData: (Data) => Data,
    formatErrorResponse: (any) => ErrorValues,
    timeout: false | number,
    autoRemoveError: boolean,
    clear: boolean,
    quiet: boolean,
    clone: boolean,
    addAppendToDataCallback: boolean,
}

type PartialOptions = $Shape<Options>;

function set(obj: FormValue, keys: number|string|string[], value: FormValue) {
    if (isStr(keys) || (typeof keys === 'number')) {
        keys = (''+keys).split('.');
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

function get(obj: FormValue, keys: string|string[]): FormValue {
    if (isStr(keys)) {
        keys = keys.split('.');
    }

    let key = keys.shift();

    if (!isObj(obj) || isFile(obj) || !hasOwn(obj, key)) {
        return undefined;
    }

    let result: FormValue;

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

function parseOptions(method: ?(Method | PartialOptions), url: ?(string | PartialOptions), options: ?PartialOptions): PartialOptions {
    method = method ? (isObj(method) ? method : { method }) : {};
    url = url ? (isObj(url) ? url : { url }) : {};
    options = options || {};

    return {
        ...options,
        ...url,
        ...method,
    }
}

function flattenToQueryParams(data: Data | Array<FormValue>, prefix: string = ''): Array<[ string, string | Blob | File ]> {
    let params = [];

    if (isArr(data)) {
        data.forEach((item, index) => {
            let paramKey = `${prefix}[${index}]`;

            if (isObj(item) && !isFile(item)) {
                params = params.concat(flattenToQueryParams(item, paramKey));
                return;
            }

            params.push([paramKey, isFile(item) ? item : formValueToString(item)]);
        })
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

function formValueToString(value: PrimitiveFormValue): string {
    if (typeof value === 'boolean') {
        return ''+(+value);
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    return value || '';
}

function bubbleError(error: Error | Object): Promise<Object> {
    if (error instanceof Error) {
        throw error;
    }
    return Promise.reject(error);
}

function isValidErrorObject(errors) {
    return !errors ||
        typeof errors !== 'object' ||
        !Object.keys(errors).length ||
        Object.values(errors).some(error => {
            if (isArr(error)) {
                return error.some(message => !isStr(message));
            }
            return !isStr(error);
        });
}

class Form {

    _errors: Errors;

    _data: Data;
    _dataCb: ?DataCb;
    _originalData: Data;
    _originalConstantData: Data;
    _options: Options;

    static defaultOptions: Options = {
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

        // If set to true the form will use follow the `useJson` option even if the data contains non JSONable values (including files).
        strictMode: false,

        // The status code for which the form should handle validation errors.
        isValidationError: ({ status }) => status === 422,

        // A callback to format the data before sending it.
        formatData: (data) => data,

        // A callback that should turn the error response into an object of field names and their validation errors.
        formatErrorResponse: (response) => {
            let data = response.data || response.response;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    throw new Error('Unable to find errors in the response');
                }
            }
            let errors: ErrorValues = data.errors;
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
        addAppendToDataCallback: true,
    };

    static setOptions = function (options: Options) {
        Form.defaultOptions = {
            ...Form.defaultOptions,
            ...options
        };
    };

    constructor(data: Data|DataCb, options: ?Options) {
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

        this._errors = new Errors();
    }

    setOptions(options: ?Options) {
        this._options = this._options || Form.defaultOptions;
        if (options) {
            this._options = {
                ...this._options,
                ...options,
            }
        }
    }

    append(key: string | Data, value: FormValue, constant: ?boolean = false, addToDataCallback: ?boolean = true): Form {
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
                    [key]: value,
                };
            }
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
            Object.defineProperty(
                this,
                key,
                {
                    get: () => undefined,
                    set: () => {
                        throw new Error(`The "${key}" value has been set as constant and cannot be modified`);
                    }
                }
            );
        }

        return this;
    }

    defineProperty(key: string) {
        Object.defineProperty(
            this,
            key,
            {
                configurable: true,
                enumerable: true,
                get: () => get(this._data, key),
                set: (newValue: FormValue) => {
                    this.setData(key, newValue);
                }
            }
        );
    }

    constantData(key: string | Data, value: FormValue): Form {
        return this.append(key, value, true, false);
    }

    getData(): Data {
        return {
            ...this._data,
            ...this._originalConstantData,
        }
    }

    setData(key: string, value: FormValue) {
        set(this._data, key, value);
        if (this._options.autoRemoveError) {
            this._errors.clear(key);
        }
    }

    errors(): Errors {
        return this._errors;
    }

    reset(): Form {
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

    clear(field: string): Form {
        if (hasOwn(this, field)) {
            set(this._data, field, emptyValue(get(this._data, field)));
        }
        return this;
    }

    parseData(data: FormValue): FormValue {
        return this._options.clone ? clone(data) : data;
    }

    addFileFromEvent(event: Event | DragEvent, key: ?string): Form {
        let node = event.target;
        if (!(node instanceof HTMLInputElement)) {
            throw new Error('Incompatible event target, must be of type HTMLInputElement');
        }
        if (!key) {
            key = node.name;
        }
        if (key in this && (node.value !== '')) {
            if (event instanceof DragEvent) {
                this.setData(key, event.dataTransfer && event.dataTransfer.files.length && event.dataTransfer.files[0]);
            } else {
                this.setData(key, node.files && node.files.length && node.files[0]);
            }
            node.value = '';
        }
        return this;
    }

    post(url: string | Options, options: ?Options): Promise<any> {
        return this.submit('post', url, options);
    }

    put(url: string | Options, options: ?Options): Promise<any> {
        return this.submit('put', url, options);
    }

    patch(url: string | Options, options: ?Options): Promise<any> {
        return this.submit('patch', url, options);
    }

    delete(url: string | Options, options: ?Options): Promise<any> {
        return this.submit('delete', url, options);
    }

    get(url: string | Options, options: ?Options): Promise<any> {
        return this.submit('get', url, options);
    }

    graphql(query: string, options: ?Options): Promise<any> {
        options = options || {};
        const originalFormatDataCallback = options.formatData || this._options.formatData;

        options.url = options.graphql || this._options.graphql;

        options.useJson = !this.hasFile();

        options.formatData = (data) => {
            data = originalFormatDataCallback ? originalFormatDataCallback(data) : data;
            const operations = {
                query,
                variables: data,
            };

            if (!this.hasFile()) {
                return operations;
            }
            const { clone, files } = extractFiles(data);
            operations.variables = clone;
            return {
                operations: JSON.stringify(operations),
                map: JSON.stringify(arrayToObject(Array.from(files.values()))),
                ...arrayToObject(Array.from(files.keys())),
            };
        };
        return this.post(options);
    }

    submit(method: Method | Options, url: ?string | Options, options: ?Options): Promise<any> {
        options = parseOptions(method, url, options);
        const requestOptions = {
            ...this._options,
            ...options,
        };

        let formData, data = requestOptions.formatData(this.getData());
        if (this.shouldConvertToFormData(requestOptions)) {
            formData = new FormData();

            let params = flattenToQueryParams(data);

            params.forEach(([key, param]) => {
                formData.append(key, param);
            });

            data = formData;
        }

        let httpAdapter = requestOptions.sendWith;

        return httpAdapter(requestOptions.method, this.buildBaseUrl(requestOptions), data, requestOptions).then(response => {
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

    shouldConvertToFormData(options: ?Options) {
        options = options || this._options;
        if (options.strictMode) {
            return !options.useJson;
        }
        return !options.useJson || this.hasFile();
    }

    hasFile(): boolean {
        return containsFile(this.getData());
    }

    onSuccess(options: ?Options) {
        options = options || this._options;
        if (options.clear) {
            this.reset();
        }
    }

    onFail(error: XMLHttpRequest, options: ?Options) {
        options = options || this._options;
        if (!options.quiet) {
            let errors = options.formatErrorResponse(error);
            this._errors.record(errors, options.timeout);
            if (this._errors.hasElements()) {
                this._errors.scrollToFirst();
            }
        }
    }

    buildBaseUrl(options: ?Options) {
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

    makeUrl(options: ?Options): string {
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

    addElement(key: string, el: HTMLElement) {
        this._errors.addElement(key, el);
    }

    removeElement(el: HTMLElement) {
        this._errors.removeElement(el);
    }

    removeElementKey(key: string) {
        this._errors.removeElementKey(key);
    }
}


export default Form;
