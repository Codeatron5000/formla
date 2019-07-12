// @flow
import { isFile, mixin, clone, hasOwn, emptyValue, isObj, isNil } from "./utils";
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

type FormValue = string | number | boolean | File | Blob | Array<FormValue> | { [string]: FormValue }

type Data = { [string]: FormValue }

type Options = {
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


class Form {

    errors: Errors;

    data: { [string]: FormValue };

    static defaultOptions: Options = {
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

    addFileFromEvent(event: Event, key: string): Form {
        key = key || event.target.name;
        if (key in this && (event.target.value !== '')) {
            this[key] = event.target.files[0] || event.dataTransfer.files[0];
            event.target.value = '';
        }
        return this;
    }

    post(url, options = null) {
        return this.submit('post', url, options);
    }

    put(url, options = null) {
        return this.submit('put', url, options);
    }

    patch(url, options = null) {
        return this.submit('patch', url, options);
    }

    delete(url, options = null) {
        return this.submit('delete', url, options);
    }

    get(url, options = null) {
        return this.submit('get', url, options);
    }

    submit(method, url, options) {
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

    hasFile() {
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
            if (isObj(value)) {
                for (let index in value) {
                    let item = value[index];
                    if (isObj(item)) {
                        throw new Error('Cannot have nested objects in a query string');
                    }
                    properties.push(`${key}[${index}]=item`);
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
