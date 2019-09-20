// @flow
import {escapeRegExp, isArr, isNil} from "./utils";

type ErrorValue = string | Array<string>;
export type ErrorValues = { [string]: ErrorValue };

class Errors {

    errors: ErrorValues;
    elements: Array<{ key: string | RegExp, el: Element }>;

    /**
     * Create a new Errors instance.
     */
    constructor() {
        this.errors = {};
        this.elements = [];
    }

    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string|RegExp} field
     */
    has(field: string | RegExp): boolean {
        if (field instanceof RegExp) {
            return Object.keys(this.errors).some(key => field.test(key));
        }
        return this.errors.hasOwnProperty(field);
    }

    /**
     * Determine if we have any errors.
     */
    any(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    getFirst(field: string): ?string {
        let error = this.get(field);
        if (error) {
            if (isArr(error)) {
                return error.length ? error[0] : null;
            } else {
                return error || null;
            }
        }
    }

    get(field: string) {
        return this.errors[field];
    }

    /**
     * Add a new error message if one doesn't already exist.
     *
     * @param {string} field
     * @param error
     * @param force
     */
    add(field: string, error: ErrorValue, force: boolean = false) {
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
    record(errors: ErrorValues, timeout: ?(false | number) = 3000) {
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
    clear(field: ?string) {
        if (field) {
            delete this.errors[field];

            return;
        }

        this.errors = {};
    }

    addElement(key: string | RegExp | string[], el: Element) {
        if (isArr(key)) {
            key.forEach(field => this.addElement(field, el));
        } else {
            this.elements.push({ key, el });
        }
    }

    removeElement(element: Element) {
        this.elements = this.elements.filter(({ el }) => el !== element);
    }

    removeElementKey(field: string | RegExp | string[]) {
        if (isArr(field)) {
            field.forEach(key => this.removeElementKey(key));
        } else {
            this.elements = this.elements.filter(({ key }) => key !== field);
        }
    }

    hasElements(): boolean {
        return !!this.elements.length;
    }

    scrollToFirst(options: ?boolean | {
        behavior?: ('auto' | 'instant' | 'smooth'),
        block?: ('start' | 'center' | 'end' | 'nearest'),
        inline?: ('start' | 'center' | 'end' | 'nearest'),
    } = null) {
        options = isNil(options) ? { behavior: 'smooth', inline: 'center' } : options;

        const element = this.elements.find(({ key, el }) => {
            let rx: RegExp;
            if (key instanceof RegExp) {
                rx = key;
            } else {
                let expression = escapeRegExp(key);
                rx = new RegExp(expression.replace('*', '.*'));
            }

            if (Object.keys(this.errors).some(key => rx.test(key))) {
                return true;
            }
        });

        if (element) {
            element.el.scrollIntoView(options);
        }
    }
}

export default Errors;
