'use strict';

var EventEmitter = require('events').EventEmitter,
  inherits = require('inherits');

var HERMES_READY = 'HERMES_READY';

function Hermes(frame, origin) {
  this.targetFrame = frame;
  this.targetOrigin = origin || '*';

  this.ready = false;

  this.callbacks = {};
  this.callbackId = 0;

  this._messageListener = this._receiveMessage.bind(this);

  window.addEventListener('message', this._messageListener);
}

inherits(Hermes, EventEmitter);

Hermes.prototype.send = function send(data, cb) {
  if (this.destroyed) {
    throw new Error('Hermes instance already destroyed');
  } else if (!this.targetFrame) {
    throw new Error('Hermes not set up to send data, only receive & respond');
  }

  var obj = { data: data };

  if (cb) {
    obj._responseId = this._serializeCb(cb);
  }

  var text = this._serializeData(obj);

  this.targetFrame.postMessage(text, this.targetOrigin);
};

Hermes.prototype.announceReady = function announceReady() {
  this.send({
    type: HERMES_READY
  });
};

Hermes.prototype.destroy = function destroy() {
  this.destroyed = true;
  this.removeAllListeners();
  window.removeEventListener('message', this._messageListener);
};

Hermes.prototype._receiveMessage = function _receiveMessage(event) {
  if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
    return;
  }

  var json, _this = this;

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

  // Response to a specific request, don't emit event, just call cb
  if (json._callbackId && this.callbacks[json._callbackId]) {
    this.callbacks[json._callbackId](json.err, json.success);
    return;
  }

  // If expecting a response, give a way to respond
  var cb;
  if (json._responseId !== undefined && json._responseId !== null) {
    cb = function(err, success) {
      // Respond to the sender
      event.source.postMessage(_this._serializeData({
        _callbackId: json._responseId,
        err: err,
        success: success
      }), event.origin);
    };
  }

  // Emit a message and give ability to respond
  this.emit('message', json.data, cb, event.source, event.origin);
};

Hermes.prototype._serializeData = function _serializeData(data) {
  return JSON.stringify(data);
};

Hermes.prototype._serializeCb = function _serializeCb(cb) {
  var id = this.callbackId;
  this.callbacks[this.callbackId++] = cb;
  return id;
};

module.exports = Hermes;
