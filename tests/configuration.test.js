import Form from '../src/Form';

let mockXHR;

beforeEach(() => {
    mockXHR = {
        open: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        response: '',
        setRequestHeader: jest.fn(),
    };

    window.XMLHttpRequest = jest.fn(() => mockXHR);
});

test('Setting options globally', () => {
    Form.setOptions({
        method: 'delete',
        url: 'https://api.com',
    });

    const form = new Form({
        name: 'Bob',
    });

    form.submit();

    expect(mockXHR.open).toBeCalledWith('delete', 'https://api.com');
});

test('Setting options on the instance overrides global options', () => {
    Form.setOptions({
        method: 'delete',
        url: 'https://api.com',
    });

    const form = new Form({
        name: 'Bob',
    }, {
        method: 'put',
        url: 'https://json.com',
    });

    form.submit();

    expect(mockXHR.open).toBeCalledWith('put', 'https://json.com');
});

test('Setting options on the request overrides instance options', () => {
    Form.setOptions({
        method: 'delete',
        url: 'https://api.com',
    });

    const form = new Form({
        name: 'Bob',
    }, {
        method: 'put',
        url: 'https://json.com',
    });

    form.submit({
        method: 'get',
        url: 'https://server.com'
    });

    expect(mockXHR.open).toBeCalledWith('get', 'https://server.com');
});
