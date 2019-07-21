// @flow
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn (obj: Object, key: string): boolean %checks {
    return hasOwnProperty.call(obj, key)
}

export function isFile(val: mixed): boolean %checks {
    return !!val && (val instanceof Blob);
}

export function fileTooBig(val: mixed, maxSize: number): boolean {
    return isFile(val) && val.size >= (maxSize * 1024 * 1024);
}

export function mixin(source: Object, target: Object): Object {
    let mix = {};

    for (const key in source) {
        mix[key] = hasOwn(target, key) ? target[key] : source[key]
    }

    return mix;
}

export function clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
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

export function isUndef(value: mixed): %checks {
    return typeof value === 'undefined';
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

export function escapeRegExp(string: string) {
    return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

type NestedObject = {
    [string]: NestedObject | mixed
}
export function containsFile(obj: NestedObject | Array<NestedObject | mixed>): boolean {
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
