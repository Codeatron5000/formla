// @flow
import {isFile, mixin, clone, hasOwn, emptyValue, isObj, isNil, isArr, containsFile, isStr} from "./utils";
import Errors from "./Errors";
import http from "./http";
import type { Method } from './flow';
import type { ErrorValues } from "./Errors";

type ErrorResponse = {
    status: number,
    response: {
        errors: {
            [string]: Array<string> | string
        }
    }
}

type PrimitiveFormValue = string | number | boolean | null | typeof undefined;

type ScalarFormValue = PrimitiveFormValue | Blob | File;

type FormValue = ScalarFormValue | Array<?FormValue> | { [string]: ?FormValue };

export type Data = { [string]: FormValue };

type Options = {
    method: Method,
    baseUrl: string,
    url: string,
    sendWith: (method: Method, url: string, data: FormData | Data) => Promise<any>,
    useJson: boolean,
    strictMode: boolean,
    isValidationError: ({ status: number }) => boolean,
    formatErrorResponse: (any) => ErrorValues,
    timeout: false | number,
    autoRemoveError: boolean,
    clear: boolean,
    quiet: boolean,
    clone: boolean,
}

function parseOptions(method: Method | Options, url: ?(string | Options), options: ?Options): Options {
    if (isObj(method)) {
        return method;
    }
    if (url && isObj(url)) {
        return {
            method,
            ...url,
        };
    }
    return {
        method,
        url: url || '',
        ...options,
    };
}

function flattenToQueryParams(data: Data | Array<FormValue>, prefix: string = ''): { [string]: string | Blob | File } {
    let params = {};

    if (isArr(data)) {
        data.forEach(item => {
            let paramKey = `${prefix}[]`;

            if (isObj(item) && !isFile(item)) {
                params = {
                    ...params,
                    ...flattenToQueryParams(item, paramKey)
                };
                return;
            }

            params[paramKey] = isFile(item) ? item : formValueToString(item);
        })
    } else {
        Object.keys(data).forEach(key => {
            let item = data[key];

            let paramKey = prefix ? `${prefix}[${key}]` : '' + key;

            if (isObj(item) && !isFile(item)) {
                params = {
                    ...params,
                    ...flattenToQueryParams(item, paramKey)
                };
                return;
            }

            params[paramKey] = isFile(item) ? item : formValueToString(item);
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

    errors: Errors;

    data: Data;
    originalData: Data;
    originalConstantData: Data;
    options: Options;

    static defaultOptions: Options = {
        // The default method type used by the submit method
        method: 'post',

        // If set any relative urls will be appended to the baseUrl
        baseUrl: '',

        // The url to submit the form
        url: '',

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
        isValidationError: ({ status }) => status === 422,

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
    };

    static setOptions = function (options: Options) {
        Form.defaultOptions = mixin(Form.defaultOptions, options);
    };

    constructor(data: Data, options: ?Options) {
        this.setOptions(options);

        this.originalData = {};
        this.originalConstantData = {};
        this.data = {};

        this.append(data);

        this.errors = new Errors();
    }

    setOptions(options: ?Options) {
        this.options = this.options || Form.defaultOptions;
        this.options = mixin(this.options, options || {});
    }

    append(key: string | Data, value: FormValue, constant: ?boolean = false): Form {
        if (typeof key === 'object') {
            Object.keys(key).forEach(field => {
                this.append(field, key[field], constant);
            });
            return this;
        }

        if (constant) {
            this.originalConstantData[key] = value;
        } else {
            this.originalData[key] = value;
        }
        if (!constant) {
            this.data[key] = this.parseData(value);
            Object.defineProperty(
                this,
                key,
                {
                    get: () => this.data[key],
                    set: (newValue: FormValue) => {
                        this.setData(key, newValue);
                    }
                }
            );
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

    constantData(key: string | Data, value: FormValue): Form {
        return this.append(key, value, true);
    }

    getData(): Data {
        return {
            ...this.data,
            ...this.originalConstantData,
        }
    }

    setData(key: string, value: FormValue) {
        this.data[key] = value;
        if (this.options.autoRemoveError) {
            this.errors.clear(key);
        }
    }

    reset(): Form {
        for (let field in this.data) {
            this.data[field] = this.originalData[field];
        }

        this.errors.clear();

        return this;
    }

    clear(field: string): Form {
        if (hasOwn(this, field)) {
            this.data[field] = emptyValue(this.data[field]);
        }
        return this;
    }

    parseData(data: FormValue): FormValue {
        return this.options.clone && !isFile(data) ? clone(data) : data;
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

    submit(method: Method | Options, url: ?string | Options, options: ?Options): Promise<any> {
        const requestOptions = mixin(this.options || Form.defaultOptions, parseOptions(method, url, options || {}));

        let formData, data = this.getData();
        if (this.shouldConvertToFormData(requestOptions)) {
            formData = new FormData();

            let params = flattenToQueryParams(data);

            Object.keys(params).forEach(key => {
                formData.append(key, params[key]);
            });

            data = formData;
        }

        let httpAdapter = requestOptions.sendWith;

        return httpAdapter(requestOptions.method, this.buildBaseUrl(requestOptions), data).then(response => {
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
        options = options || this.options;
        if (!options.useJson) {
            return true;
        }
        if (this.hasFile() && options.strictMode) {
            throw new Error('Cannot convert a file to JSON');
        }
        return this.hasFile();
    }

    hasFile(): boolean {
        return containsFile(this.getData());
    }

    onSuccess(options: ?Options) {
        options = options || this.options;
        if (options.clear) {
            this.reset();
        }
    }

    onFail(error: XMLHttpRequest, options: ?Options) {
        options = options || this.options;
        if (!options.quiet) {
            let errors = options.formatErrorResponse(error);
            this.errors.record(errors, options.timeout);
            if (this.errors.hasElements()) {
                this.errors.scrollToFirst();
            }
        }
    }

    buildBaseUrl(options: ?Options) {
        options = options || this.options;
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

        Object.keys(params).forEach(key => {
            let item = params[key];

            if (isFile(item)) {
                throw new Error('Cannot convert file to a string');
            }

            properties.push(key + (isNil(item) ? '' : `=${item}`));
        });
        return fullUrl + properties.join('&');
    }

    addElement(key: string, el: HTMLElement) {
        this.errors.addElement(key, el);
    }
}


export default Form;
