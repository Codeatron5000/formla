import Form from '../src/Form';

test('Appending data to the form', () => {
    const form = new Form({});

    form.append('name', 'Bob');

    expect(form.name).toBe('Bob');

    expect(form.getData()).toEqual({ name: 'Bob' });
});

test('Appending a data object to the form', () => {
    const form = new Form({});

    form.append({
        name: 'Bob',
        job: 'Builder',
    });

    expect(form.name).toBe('Bob');
    expect(form.job).toBe('Builder');

    expect(form.getData()).toEqual({
        name: 'Bob',
        job: 'Builder',
    });
});

test('Cloning appended data', () => {
    const form = new Form({});

    const email = { label: 'private', address: 'test@mail.com' };

    form.append('email', email);

    form.email.label = 'work';

    expect(form.email.label).toBe('work');
    expect(email.label).toBe('private');
});
