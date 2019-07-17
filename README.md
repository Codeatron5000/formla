# Ajax Form

## Installation
Using npm:
```
npm install ajax-form --save
```

Using yarn:
```
yarn add ajax-form --save
```

## Usage
To use the form first import it into your project and instantiate a new instance with the form fields and initial values.

```js
import Form from 'ajax-form';

const form = new Form({
  username: '',
  password: '',
});
```

### Append data
You can add fields to the form after instantiation using the `append` method.

You can pass the field name and initial value as arguments or you can pass an object of key value pairs.

```js
form.append('email', '');

form.append({
  firstName: '',
  lastName: '',
});
```

The values supplied to the form can be accessed and updated directly on the form object.

```js
let name = form.firstName + ' ' + form.lastName;

form.username = 'cheesy123';
```

### Constant data
Sometimes you may want to use data that shouldn't be changed, for example an api key or a CSRF token.

For these fields you can use the `constantData` method.

As with the `append` method you can either send a single key and value or an object.

```js
const form = new Form({
  username: '',
  password: '',
}).constantData('_token', csrfToken);
```

Any fields added using the `constantData` method cannot be accessed on the form object but will be sent in the body of the request when the form is submitted.

### Dealing with files
You can add a file as a value to any key in the form data but it can be quite annoying to do so.

Instead you can use the `addFileFromEvent` method which accepts an input event from a file `<input>` element and adds the file to the form.

```js
const form = new Form({
    file: null,
});

document.querySelector('input[name="file"]')
    .addEventListener('input', (event) => form.addFileFromEvent(event));
```

By default the file will use the name of the input field to find the key, however you can override this by passing the key as the second argument.

### Submitting the form
The `submit` method accepts 3 arguments. The request method, the url, and some optional options. Alternatively you could just pass the options as the first argument, so long as the options includes the method and the url.

```js
form.submit('post', 'https://api.com');
```

The form object also exposes a function for each request method.

```js
form.get('https://api.com');
form.post('https://api.com');
form.put('https://api.com');
form.patch('https://api.com');
form.delete('https://api.com');
```