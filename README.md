#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Small wrapper on top of Cross Origin postMessage


## Install

### Bower
```sh
$ bower install --save hermes-messenger
```

### Browserify
```sh
$ npm install --save hermes-messenger
```

## Usage

```js
var Hermes = require('hermes-messenger'); // If using Browserify
var Hermes = window.HermesMessenger;      // Also exports onto window

var hermes = new Hermes(document.querySelector('iframe'), '*');

// Send a message to an iframe
hermes.send({ message: 'Testing Rainbows!' });

// Send a message and get a response
hermes.send({
  message: 'How many rainbows?!',
  callback: function(err, data) {
  }
});

// Listen for messages
hermes.on('message', function(data) {
  
});

// Listen for messages and respond
hermes.on('message', function(data, cb) {
  var err = false;

  if (cb) {
    if (err) {
      cb('Error getting data'); // Send error
    } else {
      cb(null, 'All of the rainbows');
    }
  }
});
```

## Browser Compatibility

[Cross-document message](http://caniuse.com/#feat=x-doc-messaging)

For all versions of IE, the window must be either a Frame or Iframe. Popups won't work.

## Building

```sh
# creates browser files
$ gulp
```

## License

MIT © [JobHero](gojobhero.com)


[npm-image]: https://badge.fury.io/js/hermes-messenger.svg
[npm-url]: https://npmjs.org/package/hermes-messenger
[travis-image]: https://travis-ci.org/JetFault/hermes-messenger.svg?branch=master
[travis-url]: https://travis-ci.org/JetFault/hermes-messenger
[daviddm-image]: https://david-dm.org/JetFault/hermes-messenger.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JetFault/hermes-messenger
