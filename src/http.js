// @flow
import type { Method } from './flow';
import type { Data } from "./Form";

type Options = {
    method: Method,
    url: string,
}

export default function http(method: Method, url: string, data: FormData | Data) {
    let xhr = new XMLHttpRequest();

    let response = new Promise<XMLHttpRequest>((resolve, reject) => {
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr);
            } else {
                reject(xhr);
            }
        };
        xhr.onerror = () => reject(xhr);
    });

    xhr.open(method, url);
    if (data instanceof FormData) {
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(data);
    } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }

    return response;
}