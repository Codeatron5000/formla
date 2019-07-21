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
The `submit` method accepts 3 arguments. The request method, the url, and some optional configuration.
Alternatively you could just pass the options as the first argument, so long as the options includes the method and the url.

```js
form.submit('post', 'https://api.com');
```

The form object also exposes a function for each request method.

```js
form.get('https://api.com'); // When using the `get` method the data will be converted to a query string and added to the url.
form.post('https://api.com');
form.put('https://api.com');
form.patch('https://api.com');
form.delete('https://api.com');
```

By default the form uses a basic implementation to submit the data however it is recommended to use a different library like `jQuery` or `axios` to send the request.

You can do this by passing a callback function to the `sendWith` options which accepts the method, url, and data as parameters.

```js
import axios from 'axios';

Form.setOptions({
    sendWith(method, url, data) {
        axios({
            method,
            url,
            data,
        });
    },
});
```

The data argument will be a `FormData` object constructed from the data provided to the form. You can set this to a json object by setting the `useJson` option to `true`.
> Note, you cannot have a `File` or `Blob` object in JSON so if a file is detected in the form data the form will be sent as a `FormData` object, even if `useJson` is `true`. Unless the `strictMode` option is `true` in which case an error will be thrown.
> All options can either be set globally using the static `setOptions` method, on a per form instance basis by passing them as the second argument to the constructor, or on a per request basis by passing them as the last parameter of the request method.

### Handling validation errors
An important feature of the form is handling validation errors.

If the form is submitted with invalid data, the server typically sends back error messages with information on why the data was invalid.

The form object will automatically store these errors and allow you to display them however you like.

By default the form will check for a 422 status code and a json response of the format:
```json
{
  "errors": {
    "username": [
      "The username was already taken",
      "The username was too long"
    ],
    "password": [
      "The password is required",
    ]
  }
}
```

You can change the status code it should look for with the `validationStatusCode` option.

If you're server doesn't return validation errors in this format, you can pass a callback to the `formatErrorResponse` option which should return an object of the form data keys with their corresponding error messages as a string or an array of strings:
```js
Form.setOptions({
    formatErrorResponse(response) {
        return response.error.details;
    }
})
```

Once an error response has been caught by the form you can access the errors class with the `errors` property on the form.
```js
if (form.errors.any()) {
    alert('There was an issue');
}
```

The `has` method accepts a string or a regular expression and tells you if the first field matching that string or expression has an error.

The `get` method will return all the errors for the field provided as the argument.

The `getFirst` method will return the first error if there is an array of errors, otherwise it will just return the error.

The `clear` method will remove the error messages for the specified field, or all messages if no field is specified.

If you want all the errors to clear after a certain interval you can use the `timeout` option on the form with the number of milliseconds to wait before clearing the errors.

When the value for a field with errors is updated the error messages for that field are automatically cleared.
This behaviour can be prevented by setting the `autoRemoveError` option to `false`.

Typically you will want to display an error message by the input element with the invalid data.
However sometimes this element could be off the page, especially when the user is on a mobile device.
The form object can automatically scroll to any elements that have errors if you tell it where to go:
```js
const form = new Form({
    username: '',
    password: '',
});

const usernameInput = document.querySelector('input[name="username"]');
const passwordInput = document.querySelector('input[name="password"]');

form.addElement('username', usernameInput);
form.addElement('password', passwordInput);
```
Make sure you add the elements in the order they appear in the page as the form will use the order they are added to determine which is the first element with an error and scroll to that one.

If you have a group of inputs inside a container and you just want to scroll to that element for all of the fields within it, you can pass an array of fields as the first argument, or a regular expression, or even just a string with `*` wildcards.

### Configuration
The form class has many options for customising the plugin to your needs.

You can set the options globally using the `setOptions` static method:
```js
import Form from 'ajax-form';

Form.setOptions({
    baseUrl: 'https://api.com',
});
```

You can set the options for a specific form instance by passing them as a second argument to the constructor or using the `setOptions` instance method.
These options will override any global options and any options set before them.
```js
const form = new Form({
    username: '',
}, {
    autoRemoveError: false,
});

form.setOptions({
    quiet: true,
});
```

Finally you can set additional options when sending a request.
These options are only used for the request and not saved once the request is finished.
```js
form.post('https://api.com/comments', {
    timeout: 5000,
});
```
**All available options and their defaults**
```js
Form.setOptions({
    // The default method type used by the submit method
    method: 'post',

    // If set any relative urls will be appended to the baseUrl
    baseUrl: '',

    // The url to submit the form
    url: '',

    // A callback to implement custom HTTP logic.
    // It is recommended to use this option so the form can utilise your HTTP library.
    // The callback should return a promise that the form can use to handle the response.
    sendWith: null,

    // Set to true if you want the form to submit the data as a json object.
    // This will pass the data as a JavaScript object to the sendWith callback so it is up to you to stringify it for your HTTP library.
    // If the data contains a File or Blob object the data will be a FormData object regardless of this option (unless strictMode is true).
    useJson: false,

    // If set to true the form will throw an Error if the data has a File or Blob object and the useJson option is true.
    strictMode: false,

    // The status code for which the form should handle validation errors.
    validationStatusCode: 422,

    // A callback that should turn the error response into an object of field names and their validation errors.
    formatErrorResponse: ({ errors }) => errors,

    // The number of milliseconds to wait before clearing the error messages.
    // When timeout is false the error messages will stay indefinitely.
    timeout: false,

    // When set to true the errors for a field will be cleared when that field's value is updated.
    autoRemoveError: true,

    // When set to true, the data will be reverted to it's original values after a successful request.
    clear: true,

    // When set to true, no errors will be recorded.
    quiet: false,

    // If clone is set to false any nested objects and arrays will be stored in the form by reference.
    clone: true,
});
```
