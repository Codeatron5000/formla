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
