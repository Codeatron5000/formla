// @flow
import {isFile, mixin, clone, hasOwn, emptyValue, isObj, isNil, isArr} from "./utils";
import Errors from "./Errors";
import http from "./http";

type ErrorResponse = {
    status: number,
    response: {
        errors: {
            [string]: Array<string> | string
        }
    }
}

type PrimitiveFormValue = string | number | boolean;

type ScalarFormValue = PrimitiveFormValue | Blob | File;

type FormValue = ScalarFormValue | Array<FormValue> | { [string]: FormValue };

type Data = { [string]: FormValue };

type Method = 'get' | 'post' | 'put' | 'patch' | 'head' | 'option' | 'delete';

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
}

function parseOptions(method: string | Options, url: ?string | Options, options: ?Options): Options {
    if (isObj(method)) {
        return method;
    }
    if (isObj(url)) {
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

    let keys = isArr(data) ? data.keys() : Object.keys(data);

    keys.forEach(key => {
        let item = data[key];

        let paramKey = prefix ? `${prefix}[${key}]` : key;

        if (isObj(item) && !isFile(item)) {
            params = {
                ...params,
                ...flattenToQueryParams(item, toString, paramKey)
            };
            return;
        }

        params[paramKey] = formValueToString(item);
    });

    return params;
}

function formValueToString(value: PrimitiveFormValue): string {
    if (typeof value === 'boolean') {
        return ''+(+value);
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    return value;
}

class Form {

    errors: Errors;

    data: Data;

    static defaultOptions: Options = {
        method: null,
        url: null,
        clear: true,
        quiet: false,
        scrollToFirstError: false,
        timeout: false,
        clone: true,
        autoRemoveError: true,
        uploadLimit: null,
        responseType: 'json',
        validationStatusCode: 422,
    };

    static setDefaultOptions = function (options: Options) {
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

    setOptions(options: Options) {
        this.options = this.options || Form.defaultOptions;
        this.options = mixin(this.options, options || {});
    }

    append(key: string | Data, value: ?FormValue, constant: ?boolean = false): Form {
        if (typeof key === 'object') {
            Object.keys(key).forEach(field => {
                this.append(field, key[field], constant);
            });
            return this;
        }

        let originalDataKey = constant ? 'originalConstantData' : 'originalData';
        this[originalDataKey][key] = value;
        if (!constant) {
            this.data[key] = this.parseData(value);
            Object.defineProperty(
                this,
                key,
                {
                    get: () => this.data[key],
                    set: (newValue) => {
                        this.data[key] = newValue;
                        if (this.options.autoRemoveError) {
                            this.errors.clear(key);
                        }
                    }
                }
            );
        }

        return this;
    }

    constantData(key: string | Data, value: ?FormValue): Form {
        return this.append(key, value, true);
    }

    getData(): Data {
        return {
            ...this.data,
            ...this.originalConstantData,
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
            this.data[field] = emptyValue(this[field]);
        }
        return this;
    }

    parseData(data: Data): Data {
        return this.options.clone ? clone(data) : data;
    }

    addFileFromEvent(event: Event | DragEvent, key: string): Form {
        let node: HTMLInputElement = event.target;
        if (!key) {
            key = node.name;
        }
        if (key in this && (node.value !== '')) {
            if (event instanceof DragEvent) {
                this[key] = event.dataTransfer && event.dataTransfer.files.length && event.dataTransfer.files[0];
            } else {
                this[key] = node.files && node.files.length && node.files[0];
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

        let httpAdapter = this.options.httpAdapter || http;

        return httpAdapter({
            ...this.options,
            headers: {
                'Content-Type': hasFile && 'application/json',
                ...this.options.headers,
            },
            data,
        }).then(() => {
            this.onSuccess();
        }).catch(error => {
            if (!this.options.quiet) {
                this.onFail(error);
            }
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
            let scrollToFirstError = this.options.scrollToFirstError;
            if (scrollToFirstError) {
                if (typeof scrollToFirstError !== 'object') {
                    scrollToFirstError = { behavior: 'smooth', inline: 'center' }
                }
                this.errors.scrollToFirst(scrollToFirstError);
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

    addElement(key: string, el: HTMLElement, offset: number = 0) {
        this.errors.addElement(key, el, offset);
    }
}


export default Form;
