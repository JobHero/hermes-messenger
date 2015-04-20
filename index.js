'use strict';

var EventEmitter = require('events').EventEmitter,
  inherits = require('inherits');

var HERMES_READY = 'HERMES_READY';

function Hermes(frame, origin) {
  this.targetFrame = frame;
  this.targetOrigin = origin;
  this.ready = false;

  this.callbacks = {};
  this.callbackId = 0;

  window.addEventListener('message', this.receiveMessage);
}

inherits(Hermes, EventEmitter);

Hermes.prototype.sendMessage = function(obj, cb) {
  var text;

  if (this.destroyed) {
    throw new Error('Hermes instance already destroyed');
  }

  if (cb) {
    obj.responseId = this._serializeCb(cb);
  }

  text = JSON.stringify(obj);
  this.targetFrame.contentWindow.postMessage(text, this.targetDomain);
};

Hermes.prototype.receiveMessage = function receiveMessage(event) {
  if (this.targetDomain !== '*' && event.origin !== this.targetOrigin) {
    return;
  }

  var json;

  try {
    json = JSON.parse(event.data);
  } catch (err) {
    console.error('Hermes: Error parsing response', event.data);
    return;
  }

  // Ready event
  if (json.type === HERMES_READY) {
    this.ready = true;
    this.emit('ready');
    return;
  }

  // Response to a specific request, don't emit event
  if (json.callbackId && this.callbacks[json.callbackId]) {
    this.callbacks[json.callbackId](json.err, json.success);
    return;
  }

  // If expecting a response, give a way to respond
  var cb;
  if (json.responseId) {
    cb = function(err, success) {
      this.sendMessage({
        callbackId: json.responseId,
        err: err,
        success: success
      });
    };
  }

  // Emit a message and give ability to respond
  this.emit('message', json, cb);
};

Hermes.prototype.announceReady = function() {
  this.sendMessage({
    type: HERMES_READY
  });
};

Hermes.prototype.destroy = function() {
  this.destroyed = true;
  this.removeAllListeners();
  window.removeEventListener('message', this.receiveMessage);
};

Hermes.prototype._serializeCb = function(cb) {
  var id = this.callbackId;
  this.callbacks[this.callbackId++] = cb;
  return id;
};

module.exports = Hermes;
