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

## Docs

This exports or adds to `window.HermesMessenger` a constructor to create a new instance.

### Constructor
```js
var Hermes = require('hermes-messenger');
new Hermes(frame, origin);
```

* `frame` is the window of the Iframe or Frame Node Element (e.g. `document.querySelector('iframe').contentWindow`)
  * If not set, can't `send` messages but can still receive & respond
* `origin` is the url (with protocol) of the frame (e.g. `https://gojobhero.com`) or `*` for any origin
  * If not set, would default to `*`.
  * ** Always specify an exact target origin, not `*`. A malicious site can change the location of the window without your knowledge, and therefore it can intercept the data sent. **

Look at [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for more info.


### Send
Send a messsage to the frame. `data` can be anything.
```
hermes.send(data);
```

If you want to recieve a response pass a Node style callback as the 2nd param.
```
hermes.send({ msg: 'Yay rainbows!'}, function(err, resp) { });
hermes.send('Yay stringy rainbows!', function(err, resp) { });
```


### Receive
Listen on the message event.

The function takes the params:
* `data` that was received
* `callback` if the sender wants a reply. Node style.
* `source` source message came from
* `origin` origin message came from

```
hermes.on('message', function(data, cb, source, origin) { });
```

You can check if you need to reply back to this message by checking if a 2nd argument is passed, the callback.
```
hermes.on('message', function(data, callback) {
  var someErr = true;
  if (callback) {
    if (someErr) {
      cb('some err');
    } else {
      cb(null, 'ponies');
    }
  }
});
```

## Usage

```js
var Hermes = require('hermes-messenger'); // If using Browserify
var Hermes = window.HermesMessenger;      // Also exports onto window

// Only has ability to recieve/respond to https://gojobhero.com
var hermes = new Hermes(null, 'https://gojobhero.com');

var hermes = new Hermes(document.querySelector('iframe').contentWindow, '*');


// Send a message to an iframe
hermes.send({ message: 'Testing Rainbows!' });

// Send a message and wait for a response
hermes.send({
  message: 'How many rainbows?!'
}, 
function(err, data) {});


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

[Cross-document messaging](http://caniuse.com/#feat=x-doc-messaging)

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
[travis-image]: https://travis-ci.org/JobHero/hermes-messenger.svg?branch=master
[travis-url]: https://travis-ci.org/JobHero/hermes-messenger
[daviddm-image]: https://david-dm.org/JobHero/hermes-messenger.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JobHero/hermes-messenger
