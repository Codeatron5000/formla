// @flow
import type { Method } from './flow';

type Options = {
    method: Method,
    url: string,
}

type Response = {
    status: number,
    response: any,
    responseText: string,
    responseJson: any,
    xhr: XMLHttpRequest,
}

function generateResponse(xhr) {
    return {
        status: xhr.status,
        response: xhr.response,
        responseText: xhr.responseText,
        responseJson: JSON.parse(xhr.responseText),
        xhr,
    }
}

export default function http(options: Options) {
    let xhr = new XMLHttpRequest();

    let response = new Promise<Response>((resolve, reject) => {
        xhr.onload = function () {
            const response = generateResponse(xhr);
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(response);
            } else {
                reject(response);
            }
        };
    });

    xhr.open(options.method, options.url);
    xhr.send();

    return response;
}