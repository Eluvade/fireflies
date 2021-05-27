
![preview](./examples/preview.gif "Fireflies")

# Fireflies &middot; [![npm version](https://img.shields.io/npm/v/fireflies.js.svg?style=flat)](https://www.npmjs.com/package/fireflies.js) [![GitHub license](https://img.shields.io/github/license/Eluvade/fireflies)](https://github.com/Eluvade/fireflies/blob/master/LICENSE)

Fireflies are an HTML canvas animation written in JavaScript.

## Installation

* Use Fireflies as a `<script>` tag from a [CDN](https://unpkg.com/fireflies.js/dist/fireflies.min.js)
* Add Fireflies package `npm i fireflies --only=prod` from [npm](https://www.npmjs.com/package/fireflies.js)

## Usage

Import and initialize fireflies with default configuration:
```JavaScript
import Fireflies from 'fireflies'
Fireflies.initialize()
```

Example of an alternative configuration:
```JavaScript
Fireflies.initialize(undefined, [5, 50], [{ fill: '#ffffff', glow: '#17a6bb' }], true, true, true, false)
```

# List of static methods

* `Fireflies.initialize()` Creates a canvas, appends it to the <body> animating the fireflies.
* `Fireflies.terminate()` Deletes the canvas and stops the animation.


# The initialize function
Please note that the order of parameters is fixed.
```JavaScript
/**
* The Fireflies.initialize() function
* @param {integer} quantity            - the number of fireflies to create, dynamically created based on window size by default
* @param {integer or an array} radius  - use array to specify the minimum and maximum firefly size in px
* @param {array of objects} color      - each object represents a possible firefly color styling containing the fill and glow property
* @param {boolean} collision           - should fireflies interact with each other and the mouse?
* @param {boolean} pulse               - should the glow of fireflies change its intensity over time?
* @param {boolean} flicker             - should the fireflies flicker periodically?
* @param {boolean} connect             - should fireflies weave a web of threads in-between them?
*/
  static initialize(quantity = Math.floor((window.innerHeight + window.innerWidth) / 100), radius = [5, 25 + Math.floor((window.innerHeight + window.innerWidth) / 100)], color = [{ fill: '#ffffea', glow: '#ff881b' }], collision = false, pulse = true, flicker = true, connect = false) {
  ...
}
```
The `undefined` value or omitting parameters will revert to default settings / parameters.


# Contributing

Fireflies were originally written by [Bunny Eluvade](https://github.com/Eluvade).  
Big thanks to all our other [contributors](https://github.com/Eluvade/fireflies/contributors) who made this possible.  
Keeping it simple and lightweight is the number 1 priority. Don't add any unnecessary libraries.

# License

This project is licensed under the [MIT](https://github.com/Eluvade/fireflies/blob/master/LICENSE) License.
