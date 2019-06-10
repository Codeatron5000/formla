import {isFile, fileTooBig, mixin, clone, hasOwn, emptyValue} from "./utils";
import Errors from "./Errors";

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
        if (typeof method === 'object') {
            options = method;
        }
        this.setOptions(options);

        let formData, hasFile = this.hasFile();
        if (hasFile) {
            if (this.tooBig()) {
                // Made the below change so that the 'TooBig' file be cleared out from the object.
                _(this.data()).each((val, key) => {
                    if (isTooBig(key, this.maxSize)) {
                        this[val] = null;
                    }
                });

                notify(trans('common.file-size', {
                    attribute: 'file',
                    max: this.maxSize
                }), 'alert')
                return Promise.reject(new Error('file too big'));
            }
            formData = new FormData();
            _(this.data()).each((value, key) => {
                if (key === 'customValues'){
                    formData.append(key, JSON.stringify(value));
                } else if (_.isArray(value)) {
                    _.each(value, val => {
                        formData.append(`${key}[]`, val);
                    });
                } else if(_.isObject(value) && value.constructor !== File && value.constructor !== Blob){
                    formData.append(key, JSON.stringify(value));
                } else if (_.isBoolean(value) && value.constructor !== File && value.constructor !== Blob) {
                    formData.append(key, +value);
                }
                else if (_.isNull(value) || _.isUndefined(value)) {
                    formData.append(key, "");
                }
                else {
                    formData.append(key, value);
                }
            });
            if (method !== 'post') {
                formData.append('_method', method.toUpperCase());
                method = 'post';
            }
        }
        formData = hasFile ? formData : this.data();
        if (this.formatDataCallback) {
            formData = this.formatDataCallback(formData);
        }

        if (!hasFile) {
            formData = JSON.stringify(formData);
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
