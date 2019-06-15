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
            if (xhr.status >= 200 && xhr.status < 300) {
                options.success(xhr);
                resolve(xhr);
            } else {
                options.failure(xhr);
                reject(xhr);
            }
        };
    });

    xhr.open(options.method, options.url);
    xhr.send();

    return response;
}