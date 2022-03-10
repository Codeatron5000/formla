/**
 * @jest-environment jsdom
 */
import Form from '../src/Form';

test('Accessing properties passed to the form', () => {
    const form = new Form({ name: 'Bob' });

    expect(form.name).toBe('Bob');

    expect(form.getData()).toEqual({ name: 'Bob' });
});

test('Properties passed to the form with a callback', () => {
    let name = 'Bob';
    let secondName;
    const form = new Form(() => {
        const data = { name };
        if (secondName) {
            data.secondName = secondName;
        } else {
            secondName = 'Ted';
        }
        return data;
    });

    expect(form.name).toBe('Bob');
    expect(form.secondName).toBeUndefined();

    expect(form.getData()).toEqual({ name: 'Bob' });

    name = 'Bill';

    form.reset();

    expect(form.name).toBe('Bill');
    expect(form.secondName).toBe('Ted');

    expect(form.getData()).toEqual({ name: 'Bill', secondName: 'Ted' });
});

test('Modifying data on the form', () => {
    const form = new Form({ name: 'Bob' });

    form.name = 'Bill';

    expect(form.name).toBe('Bill');

    expect(form.getData()).toEqual({ name: 'Bill' });
});

test('Modifying data on the form with a callback', () => {
    const form = new Form(() => ({ name: 'Bob' }));

    form.name = 'Bill';

    expect(form.name).toBe('Bill');

    expect(form.getData()).toEqual({ name: 'Bill' });
});

test('Cloning data', () => {
    let email = { label: 'private', address: 'test@mail.com' };
    const form = new Form({
        email
    });

    form.email.label = 'work';

    expect(form.email.label).toBe('work');
    expect(email.label).toBe('private');
});

test('Cloning data with callback', () => {
    let email = { label: 'private', address: 'test@mail.com' };
    const form = new Form(() => ({
        email
    }));

    form.email.label = 'work';

    expect(form.email.label).toBe('work');
    expect(email.label).toBe('private');
});

test('Disabling cloning data', () => {
    let email = { label: 'private', address: 'test@mail.com' };
    const form = new Form({
        email
    }, {
        clone: false,
    });

    form.email.label = 'work';

    expect(form.email.label).toBe('work');
    expect(email.label).toBe('work');
});

test('Disabling cloning data with callback', () => {
    let email = { label: 'private', address: 'test@mail.com' };
    const form = new Form(() => ({
        email
    }), {
        clone: false,
    });

    form.email.label = 'work';

    expect(form.email.label).toBe('work');
    expect(email.label).toBe('work');
});
