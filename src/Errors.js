class Errors {
    /**
     * Create a new Errors instance.
     */
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.elements = {};
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
    get(field) {
        if (this.errors[field]) {
            return typeof this.errors[field] === 'object' ? this.errors[field][0] : this.errors[field];
        }
    }

    /**
     * Add a new error message if one doesn't already exist.
     *
     * @param {string} field
     * @param error
     */
    add(field, error) {
        if (!this.has(field)) {
            this.errors[field] = error;
        }
    }


    /**
     * Record the new errors.
     *
     * @param {object} errors
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
    clear(field = null) {
        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }

    addElement(key, el, useAlert) {
        this.elements[key] = { el, useAlert };
    }

    scrollToFirst(options = null) {
        options = options || { behavior: 'smooth', inline: 'center' };
        Vue.nextTick(() => {
            for (let key in this.elements) {
                let rx = new RegExp(key.replace('*', '.*'));
                if (Object.keys(this.errors).some(key => rx.test(key))) {
                    let { el, useAlert } = this.elements[key];
                    if (useAlert) {
                        el = el.getElementsByClassName('c-alert-tooltip')[0];
                    }
                    el.scrollIntoView(options);
                    break;
                }
            }
        });
    }
}

export default Errors;
