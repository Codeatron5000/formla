import { escapeRegExp, isArr } from "./utils";

class Errors {
    /**
     * Create a new Errors instance.
     */
    constructor() {
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
    getFirst(field) {
        let error = this.get(field);
        if (error && error.length) {
            return error[0];
        }
    }

    get(field) {
        return this.errors[field];
    }

    /**
     * Add a new error message if one doesn't already exist.
     *
     * @param {string} field
     * @param error
     * @param force
     */
    add(field, error, force = false) {
        if (!this.has(field) || force) {
            this.errors[field] = error;
        }
    }

    /**
     * Record the new errors.
     *
     * @param {object} errors
     * @param timeout
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

    addElement(key, el) {
        this.elements[key] = el;
    }

    scrollToFirst(options = null) {
        options = options || { behavior: 'smooth', inline: 'center' };

        for (let key in this.elements) {
            let rx = escapeRegExp(key);
            rx = new RegExp(rx.replace('*', '.*'));

            if (Object.keys(this.errors).some(key => rx.test(key))) {
                let el = this.elements[key];
                el.scrollIntoView(options);
                break;
            }
        }
    }
}

export default Errors;