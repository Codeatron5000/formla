function generateResponse(xhr) {
    return {
        status: xhr.status,
        response: xhr.response,
        responseText: xhr.responseText,
        responseJson: JSON.parse(xhr.responseText),
        xhr,
    }
}

export default function http(options) {
    let xhr = new XMLHttpRequest();

    let response = new Promise((resolve, reject) => {
        xhr.onload = function () {
            const response = generateResponse(xhr);
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(response);
            } else {
                reject(response);
            }
        };
    });

    if (options.headers) {
        for (let key in options.headers) {
            xhr.setRequestHeader(key, options.headers[key]);
        }
    }

    xhr.open(options.method, options.url);
    xhr.send();

    return response;
}