// @flow
import {isFile, mixin, clone, hasOwn, emptyValue, isObj, isNil, isArr} from "./utils";
import Errors from "./Errors";
import http from "./http";
import type { Method } from './flow';

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

type Data = { [string]: FormValue };

type Options = {
    method: ?Method,
    url: ?string,
    clear: boolean,
    quiet: boolean,
    scrollToFirstError: boolean,
    timeout: boolean,
    clone: boolean,
    autoRemoveError: boolean,
    uploadLimit: ?number,
    responseType: string,
    validationStatusCode: number,
    httpAdaptor: ({ method: Method, url: string }) => Promise<any>,
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
        url,
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

class Form {

    errors: Errors;

    data: Data;
    originalData: Data;
    originalConstantData: Data;

    static defaultOptions: Options = {
        method: null,
        url: null,
        clear: true,
        quiet: false,
        timeout: false,
        clone: true,
        autoRemoveError: true,
        uploadLimit: null,
        responseType: 'json',
        validationStatusCode: 422,
        httpAdaptor: http,
    };

    static setOptions = function (options: Options) {
        Form.defaultOptions = mixin(Form.defaultOptions, options);
    };

    options = {};

    constructor(data: Data, options: ?Options) {
        this.originalData = {};
        this.originalConstantData = {};
        this.data = {};

        this.append(data);

        this.errors = new Errors();

        this.setOptions(options);
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
        return this.options.clone ? clone(data) : data;
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
        this.setOptions(parseOptions(method, url, options));

        let formData, hasFile = this.hasFile(), data = this.getData();
        if (hasFile) {
            formData = new FormData();

            let params = flattenToQueryParams(data);

            Object.keys(params).forEach(key => {
                formData.append(key, params[key]);
            });

            data = formData;
        } else {
            data = JSON.stringify(data);
        }

        let httpAdapter = this.options.httpAdapter;

        return httpAdapter({
            ...this.options,
            data,
        }).then(response => {
            this.onSuccess();
            return response;
        }).catch(error => {
            if (!this.options.quiet) {
                this.onFail(error);
            }
            return error;
        });
    }

    hasFile(): boolean {
        return Object.values(this.data).some(isFile);
    }

    onSuccess() {
        if (this.options.clear) {
            this.reset();
        }
    }

    onFail(error: ErrorResponse) {
        if (+error.status === this.options.validationStatusCode) {
            this.errors.record(error.response.errors, this.options.timeout);
            if (this.errors.hasElements()) {
                this.errors.scrollToFirst();
            }
        }
    }

    makeUrl(url: ?string): string {
        url = url || this.options.url;
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
