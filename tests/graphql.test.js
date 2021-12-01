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

test('Submitting a graphql request', () => {
    const form = new Form({
        title: 'Blog',
        body: 'The body',
    });

    const query = `
        mutation CreateBlog($title: String!, $body: String!) {
            createBlog(title: $title, body: $body) {
                body
                title
            }
        }
    `;

    form.graphql(query);

    expect(mockXHR.setRequestHeader).toBeCalledWith('Content-Type', 'application/json');
    expect(mockXHR.open).toBeCalledWith('post', '/graphql');

    const submittedData = JSON.parse(mockXHR.send.mock.calls[0][0]);

    expect(submittedData.query).toBe(query);
    expect(submittedData.variables).toEqual({
        title: 'Blog',
        body: 'The body',
    });
});

test('Submitting a graphql request with a different endpoint', () => {
    const form = new Form({
        title: 'Blog',
        body: 'The body',
    }, {
        graphql: 'api',
    });

    const query = `
        mutation CreateBlog($title: String!, $body: String!) {
            createBlog(title: $title, body: $body) {
                body
                title
            }
        }
    `;

    form.graphql(query);

    expect(mockXHR.open).toBeCalledWith('post', '/api');
});

test('Submitting a graphql request with files', () => {
    const file = new File([1], 'a.txt', { type: 'text/plain' });

    const form = new Form({
        title: 'Blog',
        doc: file,
    });

    const query = `
        mutation CreateBlog($title: String!, $file: Upload) {
            createBlog(title: $title, file: $file) {
                title
            }
        }
    `;

    form.graphql(query);

    expect(mockXHR.setRequestHeader).toBeCalledWith('Content-Type', 'multipart/form-data');
    expect(mockXHR.open).toBeCalledWith('post', '/graphql');

    const submittedData = mockXHR.send.mock.calls[0][0];

    expect(submittedData instanceof FormData).toBe(true);

    expect(submittedData.get('operations')).toBe(JSON.stringify({
        query,
        variables: {
            title: 'Blog',
            doc: null,
        }
    }));

    expect(submittedData.get('map')).toBe(JSON.stringify({0: ['doc']}));

    expect(submittedData.get('0')).toBe(file);
});
