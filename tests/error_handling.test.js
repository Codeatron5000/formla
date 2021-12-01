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
        response: JSON.stringify({
            errors: {
                username: 'That username has already been taken',
                password: [
                    'The password cannot be less than 6 characters',
                    'The password must contain letters and numbers',
                ],
            }
        }),
        status: 422,
        setRequestHeader: jest.fn(),
    };

    const oldXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = jest.fn(() => mockXHR);
});

test('The form has errors after an invalid request', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.any()).toBe(true);
            done();
        });

    mockXHR.onload();
});

test('The status code for validation errors can be changed', (done) => {
    mockXHR.status = 419;

    const wrongCodeForm = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    let wrongCodeRequest = wrongCodeForm.submit('post', 'https://api.com')
        .catch((e) => {
            expect(wrongCodeForm._errors.any()).toBe(false);
        });

    mockXHR.onload();

    const rightCodeForm = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    }, {
         isValidationError: ({ status }) => status === 419
    });

    let rightCodeRequest = rightCodeForm.submit('post', 'https://api.com')
        .catch((e) => {
            expect(rightCodeForm._errors.any()).toBe(true);
        });

    mockXHR.onload();

    Promise.all([wrongCodeRequest, rightCodeRequest]).then(() => done());
});

test('The response can be modified to the correct response', (done) => {
    mockXHR.response = {
        messages: [
            { username: 'The username was taken' },
            { password: 'The password cannot be less than 6 characters' },
            { password: 'The password must contain letters and numbers' },
        ]
    };

    const wrongErrorForm = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    let wrongErrorRequest = wrongErrorForm.submit('post', 'https://api.com')
        .catch((e) => {
            expect(wrongErrorForm._errors.any()).toBe(false);
            expect(e instanceof Error).toBe(true)
        });

    mockXHR.onload();

    const rightErrorForm = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    }, {
         formatErrorResponse: (xhr) => {
             let errors = {};
             xhr.response.messages.forEach(message => {
                 Object.keys(message).forEach(key => {
                     if (!errors[key]) {
                         errors[key] = [];
                     }
                     errors[key].push(message[key]);
                 });
             });
             return errors;
         }
    });

    let rightErrorRequest = rightErrorForm.submit('post', 'https://api.com')
        .catch((e) => {
            expect(rightErrorForm._errors.any()).toBe(true);
        });

    mockXHR.onload();

    Promise.all([wrongErrorRequest, rightErrorRequest]).then(() => done());
});

test('The form errors can be silenced in options', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    }, {
        quiet: true,
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.any()).toBe(false);
            done();
        });

    mockXHR.onload();
});

test('Checking if the form has a certain error', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.has('username')).toBe(true);
            expect(form._errors.has('nothing')).toBe(false);
            done();
        });

    mockXHR.onload();
});

test('Getting a certain error', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.get('username')).toBe('That username has already been taken');
            expect(form._errors.get('password')).toEqual([
                'The password cannot be less than 6 characters',
                'The password must contain letters and numbers',
            ]);
            expect(form._errors.get('nothing')).toBe(undefined);
            done();
        });

    mockXHR.onload();
});

test('Getting the first error', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.getFirst('username')).toBe('That username has already been taken');
            expect(form._errors.getFirst('password')).toBe('The password cannot be less than 6 characters');
            expect(form._errors.getFirst('nothing')).toBe(undefined);
            done();
        });

    mockXHR.onload();
});

test('Clearing the errors', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.any()).toBe(true);
            form._errors.clear();
            expect(form._errors.any()).toBe(false);
            done();
        });

    mockXHR.onload();
});

test('Clearing the errors after timeout', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    }, {
        timeout: 100,
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            setTimeout(() => {
                expect(form._errors.any()).toBe(true);
            }, 90);
            setTimeout(() => {
                expect(form._errors.any()).toBe(false);
                done();
            }, 101);
        });

    mockXHR.onload();
});

test('Clearing errors when a field is updated', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.has('username')).toBe(true);
            expect(form._errors.has('password')).toBe(true);
            form.username = 'Bill';
            expect(form._errors.has('username')).toBe(false);
            expect(form._errors.has('password')).toBe(true);
            done();
        });

    mockXHR.onload();
});

test('Clearing errors when a field is updated can be disabled', (done) => {
    const form = new Form({
        username: 'Bob',
        password: 'Passw0rd!',
    }, {
        autoRemoveError: false,
    });

    form.submit('post', 'https://api.com')
        .catch(() => {
            expect(form._errors.has('username')).toBe(true);
            form.username = 'Bill';
            expect(form._errors.has('username')).toBe(true);
            done();
        });

    mockXHR.onload();
});
