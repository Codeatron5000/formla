import {isFile, fileTooBig, mixin, clone, hasOwn, emptyValue, isUndef, isObj, isArr, isNil} from "./utils";
import Errors from "./Errors";

function parseOptions(method, url, options) {
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

    static defaultOptions = {
        url: null,
        clear: true,
        quiet: false,
        scrollToFirstError: false,
        timeout: false,
        clone: true,
        autoRemoveError: true,
        uploadLimit: null,
    };

    constructor(data, options) {
        this.originalData = {};
        this.originalConstantData = {};
        this.data = {};

        this.append(data);

        this.errors = new Errors(this);

        this.setOptions(options);
    }

    setOptions(options) {
        this.options = this.options || Form.defaultOptions;
        this.options = mixin(this.options, options || {});
    }

    append(key, value, constant = false) {
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

    constantData(key, value) {
        return this.append(key, value, true);
    }

    formatData(cb) {
        this.formatDataCallback = cb;
        return this;
    }

    getData() {
        return {
            ...this.data,
            ...this.originalConstantData,
        }
    }

    reset() {
        for (let field in this.data) {
            this.data[field] = this.originalData[field];
        }

        this.errors.clear();

        return this;
    }

    clear(field) {
        if (hasOwn(this, field)) {
            this.data[field] = emptyValue(this[field]);
        }
        return this;
    }

    parseData(data) {
        return this.options.clone ? clone(data) : data;
    }

    addFileFromEvent(event, key) {
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

        return $.ajax({
            method,
            url,
            processData: !hasFile,
            dataType: 'json',
            contentType: hasFile ? false : 'application/json',
            data: formData,
            success: (response) => {
                if (options.redirect && response.hasOwnProperty('redirect')) {
                    window.location.replace(response.redirect);
                }
                setTimeout(() => this.onSuccess(response, options.clear), 20);
            },
            error: (error) => {
                if (!options.quiet) {
                    this.onFail(error, options.scrollToFirstError, options.timeout);
                }
            }
        }).then(response => (response.meta || !_.has(response, 'data')) ? response : response.data);
    }

    hasFile() {
        return Object.values(this.data).some(isFile);
    }



    onSuccess(response, clear) {
        if (clear) {
            this.reset();
        }
    }

    onFail(error, scrollToFirstError, timeout) {
        handleNalError(error, window.nal && window.nal.project)

        if (+error.status === 422) {
            this.errors.record(error.responseJSON && error.responseJSON.errors, timeout);
            if (scrollToFirstError) {
                if (typeof scrollToFirstError !== 'object') {
                    scrollToFirstError = {behavior: 'smooth', inline: 'center'}
                }
                this.errors.scrollToFirst(scrollToFirstError);
            }
            this.clear('password');
            this.clear('password_confirmation');
        }
    }

    makeUrl(url) {
        let fullUrl = url+'?';
        let properties = [];
        for (let key in this.data()) {
            let value = ((typeof this[key] === 'object') && ('toString' in this[key])) ? this[key].toString() : this[key];
            if (value) {
                properties.push(key+'='+value);
            }
        }
        return fullUrl + properties.join('&');
    }

    addElement(key, el, offset = 0) {
        this.errors.addElement(key, el, offset);
    }
}

Form.setDefaultOptions = function (options) {
    Form.defaultOptions = mixin(Form.defaultOptions, options);
};

export default Form;
