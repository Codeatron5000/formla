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
