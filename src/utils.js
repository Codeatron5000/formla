// @flow
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn (obj: Object, key: string): boolean %checks {
    return hasOwnProperty.call(obj, key)
}

export function isFile(val: mixed): boolean %checks {
    return !!val && (val instanceof Blob);
}

export function clone(obj: any): any {
    if (isArr(obj)) {
        return obj.map(clone);
    }
    if (obj === null || obj === undefined) {
        return null;
    }
    if (isFile(obj) || ['number', 'string', 'boolean'].includes(typeof obj)) {
        return obj;
    }
    if (isObj(obj)) {
        let target = {};

        Object.keys(obj).forEach((key) => target[key] = clone(obj[key]));

        return target;
    }
}

export function emptyValue(original: mixed): Array<any> | {} | '' | null {
    if (original instanceof Array) {
        return [];
    }
    if (typeof original === 'object') {
        return {};
    }
    if (typeof original === 'string') {
        return '';
    }
    return null;
}

export function isObj(value: mixed): boolean %checks {
    return value !== null && typeof value === 'object';
}

export function isArr(value: mixed): %checks {
    return value instanceof Array;
}

export function isNil(value: mixed): %checks {
    return value == null;
}

export function isFunc(value: mixed): %checks {
    return value instanceof Function;
}

export function isStr(value: mixed): %checks {
    return typeof value === 'string';
}

export function escapeRegExp(string: string) {
    return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

export function containsFile(obj: any): boolean {
    if (isArr(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] instanceof File) {
                return true;
            }
            if (isObj(obj[i])) {
                return containsFile(obj[i]);
            }
        }
    } else {
        for (let key in obj) {
            if (obj[key] instanceof File) {
                return true;
            }
            if (isObj(obj[key])) {
                return containsFile(obj[key]);
            }
        }
    }
    return false;
}

export function arrayToObject(array: any[]): { [string]: any } {
    let target = {};

    array.forEach((item, index) => {
        target[index] = item;
    });

    return target;
}

export function isInViewport(el: Element) {
    const boundingBox = el.getBoundingClientRect();
    return boundingBox.top >= 0 && boundingBox.bottom <= (window.innerHeight && document.documentElement.clientHeight);
}
