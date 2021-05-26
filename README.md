# Evoke &middot; [![npm version](https://img.shields.io/npm/v/evoke.js.svg?style=flat)](https://www.npmjs.com/package/evoke.js) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/evoke-js/evoke.js/LICENSE)

Evoke is a lightweight JavaScript module for dynamic creation of html elements. It uses a virtual DOM which makes designing front-end a breeze.

## Installation

* Use Evoke as a `<script>` tag from a [CDN](https://unpkg.com/evoke.js/dist/evoke.min.js)
* Add Evoke package `npm i evoke.js --only=prod` from [npm](https://www.npmjs.com/package/evoke.js)

## Usage

```JavaScript
import Evoke from 'evoke.js' // import the Evoke module
const root = Evoke.create('section', 'body', 'mainContext', undefined, 'theme-dark', undefined, {style: 'display: flex;'})
const myDiv = Evoke.create('div', root, 'newContext', 'myDivID')
Evoke.create('p', 'myDiv', 'newContext', undefined, ['no-magin', 'p-2', 'col-md-12'], 'Hello  World!')
const independantDiv = Evoke.create()
independantDiv.innerHTML = "Extending my website..."
// Evoke.deleteContext('newContext') // Deletes the "Hello World!"
```

The regular DOM syntax can still be used on elements that are created with evoke.

# List of static methods

* `Evoke.create()` creates a new html element.
* `Evoke.update()` is work in progress.
* `Evoke.delete(element)` deletes the element object.
* `Evoke.createContext()` creates a new context.
* `Evoke.deleteContext()` deletes the desired context and the elements within it.
* `Evoke.contexts` is the getter function to view all contexts.

# The create function
Please note that the order of parameters is fixed.
```JavaScript
/**
* The Evoke.create() function
* @param {string} elementType          - string that specifies the type of html element to be created
* @param {object or a string} parent   - parent element of the element being created
* @param {string} context              - internal sorting structure
* @param {string} id                   - the ID attribute of the html element
* @param {string or an array} classes  - a singular class or a list of classes of the html element
* @param {string} text                 - the text content of the html element
* @param {object} attributes           - an object of which the key is the attribute name with it's assigned value
* @return {object}                     - returns the html element object
*/
create(elementType = 'div', parent = 'body', context = undefined, id = undefined, classes = undefined, text = undefined, attributes = undefined) {
  ...
}
```
The `undefined` value or omitting parameters will revert to Evoke's default settings / parameters.

# Understanding Context

Context is the way Evoke sorts the created html elements. Think of it as a connecting tag between a group of elements.  
A new context will be created by filling the context parameter when creating a new element. If the parameter is omitted, Evoke will deal with this for you.  
A new context can also be created with the `Evoke.createContext('contextName')` function which takes a string for it's parameter.  
To delete all elements within a context use `Evoke.deleteContext('contextName')`

# Contributing

Evoke was originally written by [Zaharija](https://github.com/zaharija) and [Bunny Eluvade](https://github.com/Eluvade).  
Big thanks to all our other [contributors](https://github.com/evoke-js/evoke.js/contributors) who made this possible.  
Keeping it simple and lightweight is the number 1 priority. Don't add any unnecessary libraries.

# License

This project is licensed under the [MIT](https://github.com/evoke-js/evoke.js/LICENSE) License.
