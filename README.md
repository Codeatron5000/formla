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
Import the form at the root of your project to set up initial configuration:

```js
import Form from 'ajax-form';

Form.setOptions({
  /* ... */
});
```

Then import the form when you want to use it and instantiate a new instance.

```js
const form = new Form({
  username: '',
  password: '',
});
```