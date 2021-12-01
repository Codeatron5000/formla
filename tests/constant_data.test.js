/**
 * @jest-environment jsdom
 */
import Form from '../src/Form';

test('Append constant data to the form', () => {
    const form = new Form({});

    form.constantData('name', 'Bob');

    expect(form.name).not.toBe('Bob');

    expect(form.getData()).toEqual({ name: 'Bob' });
});

test('Append constant data object to the form', () => {
    const form = new Form({});

    form.constantData({
        name: 'Bob',
        job: 'Builder',
    });

    expect(form.name).not.toBe('Bob');
    expect(form.job).not.toBe('Builder');

    expect(form.getData()).toEqual({
        name: 'Bob',
        job: 'Builder',
    });
});

test('Attempting to modify constant data', () => {
    const form = new Form({});

    form.constantData('name', 'Bob');

    const t = () => {
        form.name = 'Bill';
    };

    expect(t).toThrow(Error);

    expect(form.getData()).toEqual({ name: 'Bob' });
});

test('Cloning constant data', () => {
    const form = new Form({});

    const email = { label: 'private', address: 'test@mail.com' };
    form.constantData('email', email);

    email.label = 'work';

    expect(form.getData()).toEqual({
        email: { label: 'private', address: 'test@mail.com' }
    });
});

test('Disabling cloning constant data', () => {
    const form = new Form({}, { clone: false });

    const email = { label: 'private', address: 'test@mail.com' };
    form.constantData('email', email);

    email.label = 'work';

    expect(form.getData()).toEqual({
        email: { label: 'work', address: 'test@mail.com' }
    });
});
