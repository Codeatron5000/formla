/**
 * @jest-environment jsdom
 */
import Form from '../src/Form';

let mockXHR;

beforeEach(() => {
    mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        response: JSON.stringify(
            [
                { title: 'test post' },
                { tile: 'second test post' }
            ]
        ),
        status: 200,
        setRequestHeader: jest.fn(),
    };

    const oldXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = jest.fn(() => mockXHR);
});

test('Submitting a request', () => {
    const form = new Form({
        name: 'Bob',
    });

    form.submit('post', 'https://api.com');

    expect(mockXHR.setRequestHeader).toBeCalledWith('Content-Type', 'multipart/form-data');
    expect(mockXHR.open).toBeCalledWith('post', 'https://api.com');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData instanceof FormData).toBe(true);

    expect(submittedData.get('name')).toBe('Bob');
});

test('Submitting with different methods', () => {
    const form = new Form({
        name: 'Bob',
    });

    form.get('https://api.com');
    expect(mockXHR.open).toBeCalledWith('get', 'https://api.com');
    form.post('https://api.com');
    expect(mockXHR.open).toBeCalledWith('post', 'https://api.com');
    form.put('https://api.com');
    expect(mockXHR.open).toBeCalledWith('put', 'https://api.com');
    form.patch('https://api.com');
    expect(mockXHR.open).toBeCalledWith('patch', 'https://api.com');
    form.delete('https://api.com');
    expect(mockXHR.open).toBeCalledWith('delete', 'https://api.com');
});

test('Submitting with different methods overrides request options', () => {
    const form = new Form({
        name: 'Bob',
    });

    form.get('https://api.com', { method: 'post' });
    expect(mockXHR.open).toBeCalledWith('get', 'https://api.com');
});

test('Submitting with a custom callback', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        sendWith(method, url, data) {
            expect(method).toBe('post');
            expect(url).toBe('https://api.com');
            expect(data.get('name')).toBe('Bob');

            return Promise.resolve({});
        }
    });

    form.post('https://api.com').catch();
});

test('Submitting json data', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        useJson: true,
    });

    form.submit('post', 'https://api.com');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData).toBe(JSON.stringify({
        name: 'Bob',
    }));
});

test('Submitting FormData', () => {
    const file = new File(['foo'], 'foo.txt', {
        type: 'text/plain',
    });
    const form = new Form({
        file,
        arr: [1, 2, 3],
        key: 'value',
        obj: {
            key: 'value',
        },
    }, {
        useJson: false,
    });

    form.submit('post', 'https://api.com');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData instanceof FormData).toBe(true);
    const entries = Array.from(submittedData.entries());
    expect(entries).toEqual([
        ['file', file],
        ['arr[0]', '1'],
        ['arr[1]', '2'],
        ['arr[2]', '3'],
        ['key', 'value'],
        ['obj[key]', 'value'],
    ]);
});

test('Submitting a form with useJson reverts to FormData', () => {
    const file = new File(['foo'], 'foo.txt', {
        type: 'text/plain',
    });
    const form = new Form({
        file,
    }, {
        useJson: true,
    });

    form.submit('post', 'https://api.com');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData instanceof FormData).toBe(true);
    expect(submittedData.get('file')).toBe(file);
});

test('Submitting a file with useJson in strict mode will still use JSON', () => {
    const file = new File(['foo'], 'foo.txt', {
        type: 'text/plain',
    });
    const form = new Form({
        file,
    }, {
        useJson: true,
        strictMode: true,
        sendWith(method, url, data) {
            expect(data instanceof FormData).toBe(false);
            return Promise.resolve(true);
        }
    });

    form.submit('post', 'https://api.com');
});

test('Submitting a request with a base url', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        baseUrl: 'https://api.com',
    });

    form.submit('post', 'posts');
    expect(mockXHR.open).toBeCalledWith('post', 'https://api.com/posts');
});

test('Submitting a request with a base url trims excess slashes', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        baseUrl: 'https://api.com/',
    });

    form.submit('post', '/posts');
    expect(mockXHR.open).toBeCalledWith('post', 'https://api.com/posts');
});

test('Fields are reverted to their original value after a successful request', (done) => {
    const form = new Form({
        name: 'Bob',
    });

    form.name = 'Bill';

    form.submit('post', '/posts').then(() => {
        expect(form.name).toBe('Bob');
        done();
    });

    mockXHR.onload();
});

test('Disabling field clearance after a successful request', (done) => {
    const form = new Form({
        name: 'Bob',
    }, {
        clear: false,
    });

    form.name = 'Bill';

    form.submit('post', '/posts').then(() => {
        expect(form.name).toBe('Bill');
        done();
    });

    mockXHR.onload();
});

test('Data can be modified before a request is sent', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        formatData(data) {
            data.name = data.name.toUpperCase();
            return data;
        }
    });

    form.submit('post', 'https://api.com');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData.get('name')).toBe('BOB');
});

test('baseUrl option is not passed to submit function', () => {
    const form = new Form({
        name: 'Bob',
    }, {
        baseUrl: 'https://api.com',
        sendWith(method, url, data, options) {
            expect(options.baseUrl).toBe(undefined);
            expect(url).toBe('https://api.com/posts');
            return Promise.resolve({});
        }
    });

    form.submit('post', '/posts');
});
