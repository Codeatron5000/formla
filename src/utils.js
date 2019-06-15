const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}

export function isFile(val) {
    return val && (val.constructor === File || val.constructor === Blob);
}

export function fileTooBig(val, maxSize) {
    return isFile(val) && val.size >= (maxSize * 1024 * 1024);
}

export function mixin(source, target) {
    let mix = {};

    for (const key in source) {
        mix[key] = hasOwn(target, key) ? target[key] : source[key]
    }

    return mix;
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function emptyValue(original) {
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

export function isUndef(value) {
    return typeof value === 'undefined';
}

export function isObj(value) {
    return typeof value === 'object';
}

export function isArr(value) {
    return value instanceof Array;
}

export function isNil(value) {
    return value == null;
}

export function isFunc(value) {
    return value instanceof Function;
}
