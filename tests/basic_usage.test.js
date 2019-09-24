import Form from '../src/Form';

test('Accessing properties passed to the form', () => {
    const form = new Form({ name: 'Bob' });

    expect(form.name).toBe('Bob');

    expect(form.getData()).toEqual({ name: 'Bob' });
});

test('Modifying data on the form', () => {
    const form = new Form({ name: 'Bob' });

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
