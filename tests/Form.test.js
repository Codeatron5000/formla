const Form = require('../src/Form');

test('Access properties passed to the form', () => {
    const form = new Form({ name: 'Bob' });

    expect(form.name).toBe('Bob');
});
