# JSDoc inherit params plugin

Inherit parameters documentation from any class or function with JSDoc.

## Install

With yarn:

```bash
yarn add jsdoc-inheritparams-plugin --dev
```

With npm:

```bash
npm install jsdoc-inheritparams-plugin --save-dev
```

Add the plugin to your JSDoc config:

```json
{
  "plugins": [
    "node_modules/jsdoc-inheritparams-plugin"
  ]
}
```

## Usage

> All these examples work with any kind of function (constructor, member's function, global function).

Consider the following `User` class:

```javascript
/**
 * Represents a user.
 * @class User
 * @param {string} firstname User's firstname.
 * @param {string} lastname User's lastname.
 */
class User {
  constructor(firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
  }
}
```

#### Inherit parameters

> `@inheritparams` automatically determines super class from `@extends`.

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams
 */
class AdminUser extends User {
  constructor(...args) {
    super(...args)
    this.admin = true
  }
}
```

#### Specify super class or function

> You can give an explicit super class of function to inherit parameters from.\
> The given class or function can be any valid JSDoc path.

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams User
 */
class AdminUser extends User {
  constructor(...args) {
    super(...args)
    this.admin = true
  }
}
```

#### Add extra parameters:

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(firstname, lastname, username, email, password) {
    super(firstname, lastname)
    this.admin = true
    this.username = username
    this.email = email
    this.password = password
  }
}
```

#### Specify inherited parameters offset

> Prefix the offset with a colon: `@inheritparams :4`.\
> Super class or function path can be specified before offset: `@inheritparams CustomClass:4`.\
> The default offset is `0` so inherited parameters are inserted before extra parameters (see previous example).\
> The offset can be negative so it start from the end of extra parameters.

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams :1
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(
    username,
    firstname, lastname, // Offset 1
    email,
    password
  ) {
    // ...
  }
}
```

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams :2
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(
    username,
    email,
    firstname, lastname, // Offset 2
    password
  ) {
    // ...
  }
}
```

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams :3
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(
    username,
    email,
    password,
    firstname, lastname, // Offset 3
  ) {
    // ...
  }
}
```

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams :-1
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(
    username,
    email,
    password,
    firstname, lastname, // Offset -1
  ) {
    // ...
  }
}
```

```javascript
/**
 * Represents an admin user.
 * @class AdminUser
 * @extends User
 * @inheritparams :-2
 * @param {string} username Admin username.
 * @param {string} email Admin email.
 * @param {string} password Admin password.
 */
class AdminUser extends User {
  constructor(
    username,
    email,
    firstname, lastname, // Offset -2
    password
  ) {
    // ...
  }
}
```
