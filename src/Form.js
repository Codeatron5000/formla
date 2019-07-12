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

type JsonFormValue = PrimitiveFormValue | Array<JsonFormValue> | { [string]: JsonFormValue };
type ShallowFormValue = PrimitiveFormValue | Array<PrimitiveFormValue> | { [string]: PrimitiveFormValue };
type FormValueWithFile = ShallowFormValue | File | Blob;
type FormValue = JsonFormValue | FormValueWithFile;

type JsonData = { [string]: JsonFormValue };
type ShallowData = { [string]: ShallowFormValue };
type DataWithFile = { [string]: FormValueWithFile };
type Data = JsonData | DataWithFile;

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

function isUrlSerializable(value: FormValue): boolean %checks {
    return isObj(value) && typeof value !== File && typeof value !== Blob;
}

function FormValueToString(value: PrimitiveFormValue): string {
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

    append(key: string, value: FormValue, constant: boolean = false): Form {
        if (typeof key === 'object') {
            for (let field in key) {
                this.append(field, key[field], constant);
            }
        } else {
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
        }

        return this;
    }

    constantData(key: string, value: FormValue): Form {
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
            this[key] = node.files[0] || event.dataTransfer.files[0];
            event.target.value = '';
        }
        return this;
    }

    post(url: string | Options, options: ?Options): Promise {
        return this.submit('post', url, options);
    }

    put(url: string | Options, options: ?Options): Promise {
        return this.submit('put', url, options);
    }

    patch(url: string | Options, options: Options): Promise {
        return this.submit('patch', url, options);
    }

    delete(url: string | Options, options: Options): Promise {
        return this.submit('delete', url, options);
    }

    get(url: string | Options, options: Options): Promise {
        return this.submit('get', url, options);
    }

    submit(method: Method | Options, url: ?string | Options, options: ?Options): Promise {
        this.setOptions(parseOptions(method, url, options));

        let formData, hasFile = this.hasFile(), data = this.getData();
        if (hasFile) {
            formData = new FormData();

            for (let key in data) {
                let value = data[key];
                if (isObj(value)) {
                    for (let index in value) {
                        let item = value[index];
                        if (isObj(item)) {
                            throw new Error('Cannot have nested objects in a form with a file');
                        }
                        formData.append(`${key}[${index}]`, item);
                    }
                } else {
                    formData.append(key, isNil(value) ? '' : value);
                }
                data = formData;
            }
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
        for (let key in data) {
            let value = data[key];
            if (isUrlSerializable(value)) {
                if (isArr(value)) {
                    properties = properties.concat(value.map(item => {
                        if (isObj(item)) {
                            throw new Error('Cannot have nested objects in a query string');
                        }
                        return `${key}[]=${item}`;
                    }))
                } else {
                    for (let index in value) {
                        let item = value[index];
                        if (isObj(item)) {
                            throw new Error('Cannot have nested objects in a query string');
                        }
                        properties.push(`${key}[${index}]=${item}`);
                    }
                }
            } else {
                properties.push(key + (isNil(value) ? '' : '=' + value));
            }
        }
        return fullUrl + properties.join('&');
    }

    addElement(key: string, el: HTMLElement, offset: number = 0) {
        this.errors.addElement(key, el, offset);
    }
}


export default Form;
