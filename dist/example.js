(function () {
  'use strict';

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isFunction(x) {
      return typeof x === 'function';
  }
  //# sourceMappingURL=isFunction.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config$1 = {
      Promise: undefined,
      set useDeprecatedSynchronousErrorHandling(value) {
          if (value) {
              var error = /*@__PURE__*/ new Error();
              /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
          }
          else if (_enable_super_gross_mode_that_will_cause_bad_things) {
              /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
          }
          _enable_super_gross_mode_that_will_cause_bad_things = value;
      },
      get useDeprecatedSynchronousErrorHandling() {
          return _enable_super_gross_mode_that_will_cause_bad_things;
      },
  };
  //# sourceMappingURL=config.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function hostReportError(err) {
      setTimeout(function () { throw err; });
  }
  //# sourceMappingURL=hostReportError.js.map

  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
  var empty = {
      closed: true,
      next: function (value) { },
      error: function (err) {
          if (config$1.useDeprecatedSynchronousErrorHandling) {
              throw err;
          }
          else {
              hostReportError(err);
          }
      },
      complete: function () { }
  };
  //# sourceMappingURL=Observer.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
  //# sourceMappingURL=isArray.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isObject(x) {
      return x != null && typeof x === 'object';
  }
  //# sourceMappingURL=isObject.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var errorObject = { e: {} };
  //# sourceMappingURL=errorObject.js.map

  /** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
  var tryCatchTarget;
  function tryCatcher() {
      try {
          return tryCatchTarget.apply(this, arguments);
      }
      catch (e) {
          errorObject.e = e;
          return errorObject;
      }
  }
  function tryCatch(fn) {
      tryCatchTarget = fn;
      return tryCatcher;
  }
  //# sourceMappingURL=tryCatch.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors ?
          errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
      this.name = 'UnsubscriptionError';
      this.errors = errors;
      return this;
  }
  UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var UnsubscriptionError = UnsubscriptionErrorImpl;
  //# sourceMappingURL=UnsubscriptionError.js.map

  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
  var Subscription = /*@__PURE__*/ (function () {
      function Subscription(unsubscribe) {
          this.closed = false;
          this._parent = null;
          this._parents = null;
          this._subscriptions = null;
          if (unsubscribe) {
              this._unsubscribe = unsubscribe;
          }
      }
      Subscription.prototype.unsubscribe = function () {
          var hasErrors = false;
          var errors;
          if (this.closed) {
              return;
          }
          var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
          this.closed = true;
          this._parent = null;
          this._parents = null;
          this._subscriptions = null;
          var index = -1;
          var len = _parents ? _parents.length : 0;
          while (_parent) {
              _parent.remove(this);
              _parent = ++index < len && _parents[index] || null;
          }
          if (isFunction(_unsubscribe)) {
              var trial = tryCatch(_unsubscribe).call(this);
              if (trial === errorObject) {
                  hasErrors = true;
                  errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                      flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
              }
          }
          if (isArray(_subscriptions)) {
              index = -1;
              len = _subscriptions.length;
              while (++index < len) {
                  var sub = _subscriptions[index];
                  if (isObject(sub)) {
                      var trial = tryCatch(sub.unsubscribe).call(sub);
                      if (trial === errorObject) {
                          hasErrors = true;
                          errors = errors || [];
                          var err = errorObject.e;
                          if (err instanceof UnsubscriptionError) {
                              errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                          }
                          else {
                              errors.push(err);
                          }
                      }
                  }
              }
          }
          if (hasErrors) {
              throw new UnsubscriptionError(errors);
          }
      };
      Subscription.prototype.add = function (teardown) {
          if (!teardown || (teardown === Subscription.EMPTY)) {
              return Subscription.EMPTY;
          }
          if (teardown === this) {
              return this;
          }
          var subscription = teardown;
          switch (typeof teardown) {
              case 'function':
                  subscription = new Subscription(teardown);
              case 'object':
                  if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                      return subscription;
                  }
                  else if (this.closed) {
                      subscription.unsubscribe();
                      return subscription;
                  }
                  else if (typeof subscription._addParent !== 'function') {
                      var tmp = subscription;
                      subscription = new Subscription();
                      subscription._subscriptions = [tmp];
                  }
                  break;
              default:
                  throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
          }
          var subscriptions = this._subscriptions || (this._subscriptions = []);
          subscriptions.push(subscription);
          subscription._addParent(this);
          return subscription;
      };
      Subscription.prototype.remove = function (subscription) {
          var subscriptions = this._subscriptions;
          if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                  subscriptions.splice(subscriptionIndex, 1);
              }
          }
      };
      Subscription.prototype._addParent = function (parent) {
          var _a = this, _parent = _a._parent, _parents = _a._parents;
          if (!_parent || _parent === parent) {
              this._parent = parent;
          }
          else if (!_parents) {
              this._parents = [parent];
          }
          else if (_parents.indexOf(parent) === -1) {
              _parents.push(parent);
          }
      };
      Subscription.EMPTY = (function (empty) {
          empty.closed = true;
          return empty;
      }(new Subscription()));
      return Subscription;
  }());
  function flattenUnsubscriptionErrors(errors) {
      return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
  }
  //# sourceMappingURL=Subscription.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var rxSubscriber = typeof Symbol === 'function'
      ? /*@__PURE__*/ Symbol('rxSubscriber')
      : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
  //# sourceMappingURL=rxSubscriber.js.map

  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
  var Subscriber = /*@__PURE__*/ (function (_super) {
      __extends(Subscriber, _super);
      function Subscriber(destinationOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this.syncErrorValue = null;
          _this.syncErrorThrown = false;
          _this.syncErrorThrowable = false;
          _this.isStopped = false;
          _this._parentSubscription = null;
          switch (arguments.length) {
              case 0:
                  _this.destination = empty;
                  break;
              case 1:
                  if (!destinationOrNext) {
                      _this.destination = empty;
                      break;
                  }
                  if (typeof destinationOrNext === 'object') {
                      if (destinationOrNext instanceof Subscriber) {
                          _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                          _this.destination = destinationOrNext;
                          destinationOrNext.add(_this);
                      }
                      else {
                          _this.syncErrorThrowable = true;
                          _this.destination = new SafeSubscriber(_this, destinationOrNext);
                      }
                      break;
                  }
              default:
                  _this.syncErrorThrowable = true;
                  _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                  break;
          }
          return _this;
      }
      Subscriber.prototype[rxSubscriber] = function () { return this; };
      Subscriber.create = function (next, error, complete) {
          var subscriber = new Subscriber(next, error, complete);
          subscriber.syncErrorThrowable = false;
          return subscriber;
      };
      Subscriber.prototype.next = function (value) {
          if (!this.isStopped) {
              this._next(value);
          }
      };
      Subscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
          }
      };
      Subscriber.prototype.complete = function () {
          if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
          }
      };
      Subscriber.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
      };
      Subscriber.prototype._next = function (value) {
          this.destination.next(value);
      };
      Subscriber.prototype._error = function (err) {
          this.destination.error(err);
          this.unsubscribe();
      };
      Subscriber.prototype._complete = function () {
          this.destination.complete();
          this.unsubscribe();
      };
      Subscriber.prototype._unsubscribeAndRecycle = function () {
          var _a = this, _parent = _a._parent, _parents = _a._parents;
          this._parent = null;
          this._parents = null;
          this.unsubscribe();
          this.closed = false;
          this.isStopped = false;
          this._parent = _parent;
          this._parents = _parents;
          this._parentSubscription = null;
          return this;
      };
      return Subscriber;
  }(Subscription));
  var SafeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SafeSubscriber, _super);
      function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          _this._parentSubscriber = _parentSubscriber;
          var next;
          var context = _this;
          if (isFunction(observerOrNext)) {
              next = observerOrNext;
          }
          else if (observerOrNext) {
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (observerOrNext !== empty) {
                  context = Object.create(observerOrNext);
                  if (isFunction(context.unsubscribe)) {
                      _this.add(context.unsubscribe.bind(context));
                  }
                  context.unsubscribe = _this.unsubscribe.bind(_this);
              }
          }
          _this._context = context;
          _this._next = next;
          _this._error = error;
          _this._complete = complete;
          return _this;
      }
      SafeSubscriber.prototype.next = function (value) {
          if (!this.isStopped && this._next) {
              var _parentSubscriber = this._parentSubscriber;
              if (!config$1.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                  this.__tryOrUnsub(this._next, value);
              }
              else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              var useDeprecatedSynchronousErrorHandling = config$1.useDeprecatedSynchronousErrorHandling;
              if (this._error) {
                  if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(this._error, err);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, this._error, err);
                      this.unsubscribe();
                  }
              }
              else if (!_parentSubscriber.syncErrorThrowable) {
                  this.unsubscribe();
                  if (useDeprecatedSynchronousErrorHandling) {
                      throw err;
                  }
                  hostReportError(err);
              }
              else {
                  if (useDeprecatedSynchronousErrorHandling) {
                      _parentSubscriber.syncErrorValue = err;
                      _parentSubscriber.syncErrorThrown = true;
                  }
                  else {
                      hostReportError(err);
                  }
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.complete = function () {
          var _this = this;
          if (!this.isStopped) {
              var _parentSubscriber = this._parentSubscriber;
              if (this._complete) {
                  var wrappedComplete = function () { return _this._complete.call(_this._context); };
                  if (!config$1.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                      this.__tryOrUnsub(wrappedComplete);
                      this.unsubscribe();
                  }
                  else {
                      this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                      this.unsubscribe();
                  }
              }
              else {
                  this.unsubscribe();
              }
          }
      };
      SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              this.unsubscribe();
              if (config$1.useDeprecatedSynchronousErrorHandling) {
                  throw err;
              }
              else {
                  hostReportError(err);
              }
          }
      };
      SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
          if (!config$1.useDeprecatedSynchronousErrorHandling) {
              throw new Error('bad call');
          }
          try {
              fn.call(this._context, value);
          }
          catch (err) {
              if (config$1.useDeprecatedSynchronousErrorHandling) {
                  parent.syncErrorValue = err;
                  parent.syncErrorThrown = true;
                  return true;
              }
              else {
                  hostReportError(err);
                  return true;
              }
          }
          return false;
      };
      SafeSubscriber.prototype._unsubscribe = function () {
          var _parentSubscriber = this._parentSubscriber;
          this._context = null;
          this._parentSubscriber = null;
          _parentSubscriber.unsubscribe();
      };
      return SafeSubscriber;
  }(Subscriber));
  //# sourceMappingURL=Subscriber.js.map

  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
  function canReportError(observer) {
      while (observer) {
          var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
          if (closed_1 || isStopped) {
              return false;
          }
          else if (destination && destination instanceof Subscriber) {
              observer = destination;
          }
          else {
              observer = null;
          }
      }
      return true;
  }
  //# sourceMappingURL=canReportError.js.map

  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
  function toSubscriber(nextOrObserver, error, complete) {
      if (nextOrObserver) {
          if (nextOrObserver instanceof Subscriber) {
              return nextOrObserver;
          }
          if (nextOrObserver[rxSubscriber]) {
              return nextOrObserver[rxSubscriber]();
          }
      }
      if (!nextOrObserver && !error && !complete) {
          return new Subscriber(empty);
      }
      return new Subscriber(nextOrObserver, error, complete);
  }
  //# sourceMappingURL=toSubscriber.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
  //# sourceMappingURL=observable.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function noop() { }
  //# sourceMappingURL=noop.js.map

  /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
  function pipeFromArray(fns) {
      if (!fns) {
          return noop;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }
  //# sourceMappingURL=pipe.js.map

  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
  var Observable = /*@__PURE__*/ (function () {
      function Observable(subscribe) {
          this._isScalar = false;
          if (subscribe) {
              this._subscribe = subscribe;
          }
      }
      Observable.prototype.lift = function (operator) {
          var observable$$1 = new Observable();
          observable$$1.source = this;
          observable$$1.operator = operator;
          return observable$$1;
      };
      Observable.prototype.subscribe = function (observerOrNext, error, complete) {
          var operator = this.operator;
          var sink = toSubscriber(observerOrNext, error, complete);
          if (operator) {
              operator.call(sink, this.source);
          }
          else {
              sink.add(this.source || (config$1.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                  this._subscribe(sink) :
                  this._trySubscribe(sink));
          }
          if (config$1.useDeprecatedSynchronousErrorHandling) {
              if (sink.syncErrorThrowable) {
                  sink.syncErrorThrowable = false;
                  if (sink.syncErrorThrown) {
                      throw sink.syncErrorValue;
                  }
              }
          }
          return sink;
      };
      Observable.prototype._trySubscribe = function (sink) {
          try {
              return this._subscribe(sink);
          }
          catch (err) {
              if (config$1.useDeprecatedSynchronousErrorHandling) {
                  sink.syncErrorThrown = true;
                  sink.syncErrorValue = err;
              }
              if (canReportError(sink)) {
                  sink.error(err);
              }
              else {
                  console.warn(err);
              }
          }
      };
      Observable.prototype.forEach = function (next, promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var subscription;
              subscription = _this.subscribe(function (value) {
                  try {
                      next(value);
                  }
                  catch (err) {
                      reject(err);
                      if (subscription) {
                          subscription.unsubscribe();
                      }
                  }
              }, reject, resolve);
          });
      };
      Observable.prototype._subscribe = function (subscriber) {
          var source = this.source;
          return source && source.subscribe(subscriber);
      };
      Observable.prototype[observable] = function () {
          return this;
      };
      Observable.prototype.pipe = function () {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              operations[_i] = arguments[_i];
          }
          if (operations.length === 0) {
              return this;
          }
          return pipeFromArray(operations)(this);
      };
      Observable.prototype.toPromise = function (promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function (resolve, reject) {
              var value;
              _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
          });
      };
      Observable.create = function (subscribe) {
          return new Observable(subscribe);
      };
      return Observable;
  }());
  function getPromiseCtor(promiseCtor) {
      if (!promiseCtor) {
          promiseCtor = config$1.Promise || Promise;
      }
      if (!promiseCtor) {
          throw new Error('no Promise impl found');
      }
      return promiseCtor;
  }
  //# sourceMappingURL=Observable.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function ObjectUnsubscribedErrorImpl() {
      Error.call(this);
      this.message = 'object unsubscribed';
      this.name = 'ObjectUnsubscribedError';
      return this;
  }
  ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
  //# sourceMappingURL=ObjectUnsubscribedError.js.map

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
  var SubjectSubscription = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscription, _super);
      function SubjectSubscription(subject, subscriber) {
          var _this = _super.call(this) || this;
          _this.subject = subject;
          _this.subscriber = subscriber;
          _this.closed = false;
          return _this;
      }
      SubjectSubscription.prototype.unsubscribe = function () {
          if (this.closed) {
              return;
          }
          this.closed = true;
          var subject = this.subject;
          var observers = subject.observers;
          this.subject = null;
          if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
              return;
          }
          var subscriberIndex = observers.indexOf(this.subscriber);
          if (subscriberIndex !== -1) {
              observers.splice(subscriberIndex, 1);
          }
      };
      return SubjectSubscription;
  }(Subscription));
  //# sourceMappingURL=SubjectSubscription.js.map

  /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
  var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SubjectSubscriber, _super);
      function SubjectSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          return _this;
      }
      return SubjectSubscriber;
  }(Subscriber));
  var Subject = /*@__PURE__*/ (function (_super) {
      __extends(Subject, _super);
      function Subject() {
          var _this = _super.call(this) || this;
          _this.observers = [];
          _this.closed = false;
          _this.isStopped = false;
          _this.hasError = false;
          _this.thrownError = null;
          return _this;
      }
      Subject.prototype[rxSubscriber] = function () {
          return new SubjectSubscriber(this);
      };
      Subject.prototype.lift = function (operator) {
          var subject = new AnonymousSubject(this, this);
          subject.operator = operator;
          return subject;
      };
      Subject.prototype.next = function (value) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          if (!this.isStopped) {
              var observers = this.observers;
              var len = observers.length;
              var copy = observers.slice();
              for (var i = 0; i < len; i++) {
                  copy[i].next(value);
              }
          }
      };
      Subject.prototype.error = function (err) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.hasError = true;
          this.thrownError = err;
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].error(err);
          }
          this.observers.length = 0;
      };
      Subject.prototype.complete = function () {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          this.isStopped = true;
          var observers = this.observers;
          var len = observers.length;
          var copy = observers.slice();
          for (var i = 0; i < len; i++) {
              copy[i].complete();
          }
          this.observers.length = 0;
      };
      Subject.prototype.unsubscribe = function () {
          this.isStopped = true;
          this.closed = true;
          this.observers = null;
      };
      Subject.prototype._trySubscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else {
              return _super.prototype._trySubscribe.call(this, subscriber);
          }
      };
      Subject.prototype._subscribe = function (subscriber) {
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription.EMPTY;
          }
          else if (this.isStopped) {
              subscriber.complete();
              return Subscription.EMPTY;
          }
          else {
              this.observers.push(subscriber);
              return new SubjectSubscription(this, subscriber);
          }
      };
      Subject.prototype.asObservable = function () {
          var observable = new Observable();
          observable.source = this;
          return observable;
      };
      Subject.create = function (destination, source) {
          return new AnonymousSubject(destination, source);
      };
      return Subject;
  }(Observable));
  var AnonymousSubject = /*@__PURE__*/ (function (_super) {
      __extends(AnonymousSubject, _super);
      function AnonymousSubject(destination, source) {
          var _this = _super.call(this) || this;
          _this.destination = destination;
          _this.source = source;
          return _this;
      }
      AnonymousSubject.prototype.next = function (value) {
          var destination = this.destination;
          if (destination && destination.next) {
              destination.next(value);
          }
      };
      AnonymousSubject.prototype.error = function (err) {
          var destination = this.destination;
          if (destination && destination.error) {
              this.destination.error(err);
          }
      };
      AnonymousSubject.prototype.complete = function () {
          var destination = this.destination;
          if (destination && destination.complete) {
              this.destination.complete();
          }
      };
      AnonymousSubject.prototype._subscribe = function (subscriber) {
          var source = this.source;
          if (source) {
              return this.source.subscribe(subscriber);
          }
          else {
              return Subscription.EMPTY;
          }
      };
      return AnonymousSubject;
  }(Subject));
  //# sourceMappingURL=Subject.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function refCount() {
      return function refCountOperatorFunction(source) {
          return source.lift(new RefCountOperator(source));
      };
  }
  var RefCountOperator = /*@__PURE__*/ (function () {
      function RefCountOperator(connectable) {
          this.connectable = connectable;
      }
      RefCountOperator.prototype.call = function (subscriber, source) {
          var connectable = this.connectable;
          connectable._refCount++;
          var refCounter = new RefCountSubscriber(subscriber, connectable);
          var subscription = source.subscribe(refCounter);
          if (!refCounter.closed) {
              refCounter.connection = connectable.connect();
          }
          return subscription;
      };
      return RefCountOperator;
  }());
  var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (!connectable) {
              this.connection = null;
              return;
          }
          this.connectable = null;
          var refCount = connectable._refCount;
          if (refCount <= 0) {
              this.connection = null;
              return;
          }
          connectable._refCount = refCount - 1;
          if (refCount > 1) {
              this.connection = null;
              return;
          }
          var connection = this.connection;
          var sharedConnection = connectable._connection;
          this.connection = null;
          if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
          }
      };
      return RefCountSubscriber;
  }(Subscriber));
  //# sourceMappingURL=refCount.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
  var ConnectableObservable = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableObservable, _super);
      function ConnectableObservable(source, subjectFactory) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subjectFactory = subjectFactory;
          _this._refCount = 0;
          _this._isComplete = false;
          return _this;
      }
      ConnectableObservable.prototype._subscribe = function (subscriber) {
          return this.getSubject().subscribe(subscriber);
      };
      ConnectableObservable.prototype.getSubject = function () {
          var subject = this._subject;
          if (!subject || subject.isStopped) {
              this._subject = this.subjectFactory();
          }
          return this._subject;
      };
      ConnectableObservable.prototype.connect = function () {
          var connection = this._connection;
          if (!connection) {
              this._isComplete = false;
              connection = this._connection = new Subscription();
              connection.add(this.source
                  .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
              if (connection.closed) {
                  this._connection = null;
                  connection = Subscription.EMPTY;
              }
              else {
                  this._connection = connection;
              }
          }
          return connection;
      };
      ConnectableObservable.prototype.refCount = function () {
          return refCount()(this);
      };
      return ConnectableObservable;
  }(Observable));
  var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ConnectableSubscriber, _super);
      function ConnectableSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      ConnectableSubscriber.prototype._error = function (err) {
          this._unsubscribe();
          _super.prototype._error.call(this, err);
      };
      ConnectableSubscriber.prototype._complete = function () {
          this.connectable._isComplete = true;
          this._unsubscribe();
          _super.prototype._complete.call(this);
      };
      ConnectableSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (connectable) {
              this.connectable = null;
              var connection = connectable._connection;
              connectable._refCount = 0;
              connectable._subject = null;
              connectable._connection = null;
              if (connection) {
                  connection.unsubscribe();
              }
          }
      };
      return ConnectableSubscriber;
  }(SubjectSubscriber));
  var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
      __extends(RefCountSubscriber, _super);
      function RefCountSubscriber(destination, connectable) {
          var _this = _super.call(this, destination) || this;
          _this.connectable = connectable;
          return _this;
      }
      RefCountSubscriber.prototype._unsubscribe = function () {
          var connectable = this.connectable;
          if (!connectable) {
              this.connection = null;
              return;
          }
          this.connectable = null;
          var refCount$$1 = connectable._refCount;
          if (refCount$$1 <= 0) {
              this.connection = null;
              return;
          }
          connectable._refCount = refCount$$1 - 1;
          if (refCount$$1 > 1) {
              this.connection = null;
              return;
          }
          var connection = this.connection;
          var sharedConnection = connectable._connection;
          this.connection = null;
          if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
          }
      };
      return RefCountSubscriber;
  }(Subscriber));
  //# sourceMappingURL=ConnectableObservable.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
  var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(GroupBySubscriber, _super);
      function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.elementSelector = elementSelector;
          _this.durationSelector = durationSelector;
          _this.subjectSelector = subjectSelector;
          _this.groups = null;
          _this.attemptedToUnsubscribe = false;
          _this.count = 0;
          return _this;
      }
      GroupBySubscriber.prototype._next = function (value) {
          var key;
          try {
              key = this.keySelector(value);
          }
          catch (err) {
              this.error(err);
              return;
          }
          this._group(value, key);
      };
      GroupBySubscriber.prototype._group = function (value, key) {
          var groups = this.groups;
          if (!groups) {
              groups = this.groups = new Map();
          }
          var group = groups.get(key);
          var element;
          if (this.elementSelector) {
              try {
                  element = this.elementSelector(value);
              }
              catch (err) {
                  this.error(err);
              }
          }
          else {
              element = value;
          }
          if (!group) {
              group = (this.subjectSelector ? this.subjectSelector() : new Subject());
              groups.set(key, group);
              var groupedObservable = new GroupedObservable(key, group, this);
              this.destination.next(groupedObservable);
              if (this.durationSelector) {
                  var duration = void 0;
                  try {
                      duration = this.durationSelector(new GroupedObservable(key, group));
                  }
                  catch (err) {
                      this.error(err);
                      return;
                  }
                  this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
              }
          }
          if (!group.closed) {
              group.next(element);
          }
      };
      GroupBySubscriber.prototype._error = function (err) {
          var groups = this.groups;
          if (groups) {
              groups.forEach(function (group, key) {
                  group.error(err);
              });
              groups.clear();
          }
          this.destination.error(err);
      };
      GroupBySubscriber.prototype._complete = function () {
          var groups = this.groups;
          if (groups) {
              groups.forEach(function (group, key) {
                  group.complete();
              });
              groups.clear();
          }
          this.destination.complete();
      };
      GroupBySubscriber.prototype.removeGroup = function (key) {
          this.groups.delete(key);
      };
      GroupBySubscriber.prototype.unsubscribe = function () {
          if (!this.closed) {
              this.attemptedToUnsubscribe = true;
              if (this.count === 0) {
                  _super.prototype.unsubscribe.call(this);
              }
          }
      };
      return GroupBySubscriber;
  }(Subscriber));
  var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(GroupDurationSubscriber, _super);
      function GroupDurationSubscriber(key, group, parent) {
          var _this = _super.call(this, group) || this;
          _this.key = key;
          _this.group = group;
          _this.parent = parent;
          return _this;
      }
      GroupDurationSubscriber.prototype._next = function (value) {
          this.complete();
      };
      GroupDurationSubscriber.prototype._unsubscribe = function () {
          var _a = this, parent = _a.parent, key = _a.key;
          this.key = this.parent = null;
          if (parent) {
              parent.removeGroup(key);
          }
      };
      return GroupDurationSubscriber;
  }(Subscriber));
  var GroupedObservable = /*@__PURE__*/ (function (_super) {
      __extends(GroupedObservable, _super);
      function GroupedObservable(key, groupSubject, refCountSubscription) {
          var _this = _super.call(this) || this;
          _this.key = key;
          _this.groupSubject = groupSubject;
          _this.refCountSubscription = refCountSubscription;
          return _this;
      }
      GroupedObservable.prototype._subscribe = function (subscriber) {
          var subscription = new Subscription();
          var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
          if (refCountSubscription && !refCountSubscription.closed) {
              subscription.add(new InnerRefCountSubscription(refCountSubscription));
          }
          subscription.add(groupSubject.subscribe(subscriber));
          return subscription;
      };
      return GroupedObservable;
  }(Observable));
  var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
      __extends(InnerRefCountSubscription, _super);
      function InnerRefCountSubscription(parent) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          parent.count++;
          return _this;
      }
      InnerRefCountSubscription.prototype.unsubscribe = function () {
          var parent = this.parent;
          if (!parent.closed && !this.closed) {
              _super.prototype.unsubscribe.call(this);
              parent.count -= 1;
              if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                  parent.unsubscribe();
              }
          }
      };
      return InnerRefCountSubscription;
  }(Subscription));
  //# sourceMappingURL=groupBy.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
  var BehaviorSubject = /*@__PURE__*/ (function (_super) {
      __extends(BehaviorSubject, _super);
      function BehaviorSubject(_value) {
          var _this = _super.call(this) || this;
          _this._value = _value;
          return _this;
      }
      Object.defineProperty(BehaviorSubject.prototype, "value", {
          get: function () {
              return this.getValue();
          },
          enumerable: true,
          configurable: true
      });
      BehaviorSubject.prototype._subscribe = function (subscriber) {
          var subscription = _super.prototype._subscribe.call(this, subscriber);
          if (subscription && !subscription.closed) {
              subscriber.next(this._value);
          }
          return subscription;
      };
      BehaviorSubject.prototype.getValue = function () {
          if (this.hasError) {
              throw this.thrownError;
          }
          else if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else {
              return this._value;
          }
      };
      BehaviorSubject.prototype.next = function (value) {
          _super.prototype.next.call(this, this._value = value);
      };
      return BehaviorSubject;
  }(Subject));
  //# sourceMappingURL=BehaviorSubject.js.map

  /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
  var Action = /*@__PURE__*/ (function (_super) {
      __extends(Action, _super);
      function Action(scheduler, work) {
          return _super.call(this) || this;
      }
      Action.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return this;
      };
      return Action;
  }(Subscription));
  //# sourceMappingURL=Action.js.map

  /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
  var AsyncAction = /*@__PURE__*/ (function (_super) {
      __extends(AsyncAction, _super);
      function AsyncAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.pending = false;
          return _this;
      }
      AsyncAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (this.closed) {
              return this;
          }
          this.state = state;
          var id = this.id;
          var scheduler = this.scheduler;
          if (id != null) {
              this.id = this.recycleAsyncId(scheduler, id, delay);
          }
          this.pending = true;
          this.delay = delay;
          this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
          return this;
      };
      AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return setInterval(scheduler.flush.bind(scheduler, this), delay);
      };
      AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && this.delay === delay && this.pending === false) {
              return id;
          }
          clearInterval(id);
      };
      AsyncAction.prototype.execute = function (state, delay) {
          if (this.closed) {
              return new Error('executing a cancelled action');
          }
          this.pending = false;
          var error = this._execute(state, delay);
          if (error) {
              return error;
          }
          else if (this.pending === false && this.id != null) {
              this.id = this.recycleAsyncId(this.scheduler, this.id, null);
          }
      };
      AsyncAction.prototype._execute = function (state, delay) {
          var errored = false;
          var errorValue = undefined;
          try {
              this.work(state);
          }
          catch (e) {
              errored = true;
              errorValue = !!e && e || new Error(e);
          }
          if (errored) {
              this.unsubscribe();
              return errorValue;
          }
      };
      AsyncAction.prototype._unsubscribe = function () {
          var id = this.id;
          var scheduler = this.scheduler;
          var actions = scheduler.actions;
          var index = actions.indexOf(this);
          this.work = null;
          this.state = null;
          this.pending = false;
          this.scheduler = null;
          if (index !== -1) {
              actions.splice(index, 1);
          }
          if (id != null) {
              this.id = this.recycleAsyncId(scheduler, id, null);
          }
          this.delay = null;
      };
      return AsyncAction;
  }(Action));
  //# sourceMappingURL=AsyncAction.js.map

  /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
  var QueueAction = /*@__PURE__*/ (function (_super) {
      __extends(QueueAction, _super);
      function QueueAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      QueueAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay > 0) {
              return _super.prototype.schedule.call(this, state, delay);
          }
          this.delay = delay;
          this.state = state;
          this.scheduler.flush(this);
          return this;
      };
      QueueAction.prototype.execute = function (state, delay) {
          return (delay > 0 || this.closed) ?
              _super.prototype.execute.call(this, state, delay) :
              this._execute(state, delay);
      };
      QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          return scheduler.flush(this);
      };
      return QueueAction;
  }(AsyncAction));
  //# sourceMappingURL=QueueAction.js.map

  var Scheduler = /*@__PURE__*/ (function () {
      function Scheduler(SchedulerAction, now) {
          if (now === void 0) {
              now = Scheduler.now;
          }
          this.SchedulerAction = SchedulerAction;
          this.now = now;
      }
      Scheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
              delay = 0;
          }
          return new this.SchedulerAction(this, work).schedule(state, delay);
      };
      Scheduler.now = function () { return Date.now(); };
      return Scheduler;
  }());
  //# sourceMappingURL=Scheduler.js.map

  /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
  var AsyncScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AsyncScheduler, _super);
      function AsyncScheduler(SchedulerAction, now) {
          if (now === void 0) {
              now = Scheduler.now;
          }
          var _this = _super.call(this, SchedulerAction, function () {
              if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                  return AsyncScheduler.delegate.now();
              }
              else {
                  return now();
              }
          }) || this;
          _this.actions = [];
          _this.active = false;
          _this.scheduled = undefined;
          return _this;
      }
      AsyncScheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
              delay = 0;
          }
          if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
              return AsyncScheduler.delegate.schedule(work, delay, state);
          }
          else {
              return _super.prototype.schedule.call(this, work, delay, state);
          }
      };
      AsyncScheduler.prototype.flush = function (action) {
          var actions = this.actions;
          if (this.active) {
              actions.push(action);
              return;
          }
          var error;
          this.active = true;
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (action = actions.shift());
          this.active = false;
          if (error) {
              while (action = actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsyncScheduler;
  }(Scheduler));
  //# sourceMappingURL=AsyncScheduler.js.map

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var QueueScheduler = /*@__PURE__*/ (function (_super) {
      __extends(QueueScheduler, _super);
      function QueueScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return QueueScheduler;
  }(AsyncScheduler));
  //# sourceMappingURL=QueueScheduler.js.map

  /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
  var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);
  //# sourceMappingURL=queue.js.map

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
  function empty$1(scheduler) {
      return scheduler ? emptyScheduled(scheduler) : EMPTY;
  }
  function emptyScheduled(scheduler) {
      return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
  }
  //# sourceMappingURL=empty.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isScheduler(value) {
      return value && typeof value.schedule === 'function';
  }
  //# sourceMappingURL=isScheduler.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var subscribeToArray = function (array) {
      return function (subscriber) {
          for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
              subscriber.next(array[i]);
          }
          if (!subscriber.closed) {
              subscriber.complete();
          }
      };
  };
  //# sourceMappingURL=subscribeToArray.js.map

  /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
  function fromArray(input, scheduler) {
      if (!scheduler) {
          return new Observable(subscribeToArray(input));
      }
      else {
          return new Observable(function (subscriber) {
              var sub = new Subscription();
              var i = 0;
              sub.add(scheduler.schedule(function () {
                  if (i === input.length) {
                      subscriber.complete();
                      return;
                  }
                  subscriber.next(input[i++]);
                  if (!subscriber.closed) {
                      sub.add(this.schedule());
                  }
              }));
              return sub;
          });
      }
  }
  //# sourceMappingURL=fromArray.js.map

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  function scalar(value) {
      var result = new Observable(function (subscriber) {
          subscriber.next(value);
          subscriber.complete();
      });
      result._isScalar = true;
      result.value = value;
      return result;
  }
  //# sourceMappingURL=scalar.js.map

  /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
  function of() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var scheduler = args[args.length - 1];
      if (isScheduler(scheduler)) {
          args.pop();
      }
      else {
          scheduler = undefined;
      }
      switch (args.length) {
          case 0:
              return empty$1(scheduler);
          case 1:
              return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
          default:
              return fromArray(args, scheduler);
      }
  }
  //# sourceMappingURL=of.js.map

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  function throwError(error, scheduler) {
      if (!scheduler) {
          return new Observable(function (subscriber) { return subscriber.error(error); });
      }
      else {
          return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
      }
  }
  function dispatch(_a) {
      var error = _a.error, subscriber = _a.subscriber;
      subscriber.error(error);
  }
  //# sourceMappingURL=throwError.js.map

  /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
  var Notification = /*@__PURE__*/ (function () {
      function Notification(kind, value, error) {
          this.kind = kind;
          this.value = value;
          this.error = error;
          this.hasValue = kind === 'N';
      }
      Notification.prototype.observe = function (observer) {
          switch (this.kind) {
              case 'N':
                  return observer.next && observer.next(this.value);
              case 'E':
                  return observer.error && observer.error(this.error);
              case 'C':
                  return observer.complete && observer.complete();
          }
      };
      Notification.prototype.do = function (next, error, complete) {
          var kind = this.kind;
          switch (kind) {
              case 'N':
                  return next && next(this.value);
              case 'E':
                  return error && error(this.error);
              case 'C':
                  return complete && complete();
          }
      };
      Notification.prototype.accept = function (nextOrObserver, error, complete) {
          if (nextOrObserver && typeof nextOrObserver.next === 'function') {
              return this.observe(nextOrObserver);
          }
          else {
              return this.do(nextOrObserver, error, complete);
          }
      };
      Notification.prototype.toObservable = function () {
          var kind = this.kind;
          switch (kind) {
              case 'N':
                  return of(this.value);
              case 'E':
                  return throwError(this.error);
              case 'C':
                  return empty$1();
          }
          throw new Error('unexpected notification kind value');
      };
      Notification.createNext = function (value) {
          if (typeof value !== 'undefined') {
              return new Notification('N', value);
          }
          return Notification.undefinedValueNotification;
      };
      Notification.createError = function (err) {
          return new Notification('E', undefined, err);
      };
      Notification.createComplete = function () {
          return Notification.completeNotification;
      };
      Notification.completeNotification = new Notification('C');
      Notification.undefinedValueNotification = new Notification('N', undefined);
      return Notification;
  }());
  //# sourceMappingURL=Notification.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
  var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ObserveOnSubscriber, _super);
      function ObserveOnSubscriber(destination, scheduler, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          var _this = _super.call(this, destination) || this;
          _this.scheduler = scheduler;
          _this.delay = delay;
          return _this;
      }
      ObserveOnSubscriber.dispatch = function (arg) {
          var notification = arg.notification, destination = arg.destination;
          notification.observe(destination);
          this.unsubscribe();
      };
      ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
          var destination = this.destination;
          destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
      };
      ObserveOnSubscriber.prototype._next = function (value) {
          this.scheduleMessage(Notification.createNext(value));
      };
      ObserveOnSubscriber.prototype._error = function (err) {
          this.scheduleMessage(Notification.createError(err));
          this.unsubscribe();
      };
      ObserveOnSubscriber.prototype._complete = function () {
          this.scheduleMessage(Notification.createComplete());
          this.unsubscribe();
      };
      return ObserveOnSubscriber;
  }(Subscriber));
  var ObserveOnMessage = /*@__PURE__*/ (function () {
      function ObserveOnMessage(notification, destination) {
          this.notification = notification;
          this.destination = destination;
      }
      return ObserveOnMessage;
  }());
  //# sourceMappingURL=observeOn.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
  var ReplaySubject = /*@__PURE__*/ (function (_super) {
      __extends(ReplaySubject, _super);
      function ReplaySubject(bufferSize, windowTime, scheduler) {
          if (bufferSize === void 0) {
              bufferSize = Number.POSITIVE_INFINITY;
          }
          if (windowTime === void 0) {
              windowTime = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this) || this;
          _this.scheduler = scheduler;
          _this._events = [];
          _this._infiniteTimeWindow = false;
          _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
          _this._windowTime = windowTime < 1 ? 1 : windowTime;
          if (windowTime === Number.POSITIVE_INFINITY) {
              _this._infiniteTimeWindow = true;
              _this.next = _this.nextInfiniteTimeWindow;
          }
          else {
              _this.next = _this.nextTimeWindow;
          }
          return _this;
      }
      ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
          var _events = this._events;
          _events.push(value);
          if (_events.length > this._bufferSize) {
              _events.shift();
          }
          _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype.nextTimeWindow = function (value) {
          this._events.push(new ReplayEvent(this._getNow(), value));
          this._trimBufferThenGetEvents();
          _super.prototype.next.call(this, value);
      };
      ReplaySubject.prototype._subscribe = function (subscriber) {
          var _infiniteTimeWindow = this._infiniteTimeWindow;
          var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
          var scheduler = this.scheduler;
          var len = _events.length;
          var subscription;
          if (this.closed) {
              throw new ObjectUnsubscribedError();
          }
          else if (this.isStopped || this.hasError) {
              subscription = Subscription.EMPTY;
          }
          else {
              this.observers.push(subscriber);
              subscription = new SubjectSubscription(this, subscriber);
          }
          if (scheduler) {
              subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
          }
          if (_infiniteTimeWindow) {
              for (var i = 0; i < len && !subscriber.closed; i++) {
                  subscriber.next(_events[i]);
              }
          }
          else {
              for (var i = 0; i < len && !subscriber.closed; i++) {
                  subscriber.next(_events[i].value);
              }
          }
          if (this.hasError) {
              subscriber.error(this.thrownError);
          }
          else if (this.isStopped) {
              subscriber.complete();
          }
          return subscription;
      };
      ReplaySubject.prototype._getNow = function () {
          return (this.scheduler || queue).now();
      };
      ReplaySubject.prototype._trimBufferThenGetEvents = function () {
          var now = this._getNow();
          var _bufferSize = this._bufferSize;
          var _windowTime = this._windowTime;
          var _events = this._events;
          var eventsCount = _events.length;
          var spliceCount = 0;
          while (spliceCount < eventsCount) {
              if ((now - _events[spliceCount].time) < _windowTime) {
                  break;
              }
              spliceCount++;
          }
          if (eventsCount > _bufferSize) {
              spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
          }
          if (spliceCount > 0) {
              _events.splice(0, spliceCount);
          }
          return _events;
      };
      return ReplaySubject;
  }(Subject));
  var ReplayEvent = /*@__PURE__*/ (function () {
      function ReplayEvent(time, value) {
          this.time = time;
          this.value = value;
      }
      return ReplayEvent;
  }());
  //# sourceMappingURL=ReplaySubject.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
  var AsyncSubject = /*@__PURE__*/ (function (_super) {
      __extends(AsyncSubject, _super);
      function AsyncSubject() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.value = null;
          _this.hasNext = false;
          _this.hasCompleted = false;
          return _this;
      }
      AsyncSubject.prototype._subscribe = function (subscriber) {
          if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription.EMPTY;
          }
          else if (this.hasCompleted && this.hasNext) {
              subscriber.next(this.value);
              subscriber.complete();
              return Subscription.EMPTY;
          }
          return _super.prototype._subscribe.call(this, subscriber);
      };
      AsyncSubject.prototype.next = function (value) {
          if (!this.hasCompleted) {
              this.value = value;
              this.hasNext = true;
          }
      };
      AsyncSubject.prototype.error = function (error) {
          if (!this.hasCompleted) {
              _super.prototype.error.call(this, error);
          }
      };
      AsyncSubject.prototype.complete = function () {
          this.hasCompleted = true;
          if (this.hasNext) {
              _super.prototype.next.call(this, this.value);
          }
          _super.prototype.complete.call(this);
      };
      return AsyncSubject;
  }(Subject));
  //# sourceMappingURL=AsyncSubject.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var nextHandle = 1;
  var tasksByHandle = {};
  function runIfPresent(handle) {
      var cb = tasksByHandle[handle];
      if (cb) {
          cb();
      }
  }
  var Immediate = {
      setImmediate: function (cb) {
          var handle = nextHandle++;
          tasksByHandle[handle] = cb;
          Promise.resolve().then(function () { return runIfPresent(handle); });
          return handle;
      },
      clearImmediate: function (handle) {
          delete tasksByHandle[handle];
      },
  };
  //# sourceMappingURL=Immediate.js.map

  /** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
  var AsapAction = /*@__PURE__*/ (function (_super) {
      __extends(AsapAction, _super);
      function AsapAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
      };
      AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (scheduler.actions.length === 0) {
              Immediate.clearImmediate(id);
              scheduler.scheduled = undefined;
          }
          return undefined;
      };
      return AsapAction;
  }(AsyncAction));
  //# sourceMappingURL=AsapAction.js.map

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var AsapScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AsapScheduler, _super);
      function AsapScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AsapScheduler.prototype.flush = function (action) {
          this.active = true;
          this.scheduled = undefined;
          var actions = this.actions;
          var error;
          var index = -1;
          var count = actions.length;
          action = action || actions.shift();
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (++index < count && (action = actions.shift()));
          this.active = false;
          if (error) {
              while (++index < count && (action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AsapScheduler;
  }(AsyncScheduler));
  //# sourceMappingURL=AsapScheduler.js.map

  /** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
  var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);
  //# sourceMappingURL=asap.js.map

  /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
  var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);
  //# sourceMappingURL=async.js.map

  /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
  var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
      __extends(AnimationFrameAction, _super);
      function AnimationFrameAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
      }
      AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (delay !== null && delay > 0) {
              return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }
          scheduler.actions.push(this);
          return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
      };
      AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
              return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }
          if (scheduler.actions.length === 0) {
              cancelAnimationFrame(id);
              scheduler.scheduled = undefined;
          }
          return undefined;
      };
      return AnimationFrameAction;
  }(AsyncAction));
  //# sourceMappingURL=AnimationFrameAction.js.map

  /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
  var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
      __extends(AnimationFrameScheduler, _super);
      function AnimationFrameScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      AnimationFrameScheduler.prototype.flush = function (action) {
          this.active = true;
          this.scheduled = undefined;
          var actions = this.actions;
          var error;
          var index = -1;
          var count = actions.length;
          action = action || actions.shift();
          do {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          } while (++index < count && (action = actions.shift()));
          this.active = false;
          if (error) {
              while (++index < count && (action = actions.shift())) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      return AnimationFrameScheduler;
  }(AsyncScheduler));
  //# sourceMappingURL=AnimationFrameScheduler.js.map

  /** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
  var animationFrame = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);
  //# sourceMappingURL=animationFrame.js.map

  /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
  var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
      __extends(VirtualTimeScheduler, _super);
      function VirtualTimeScheduler(SchedulerAction, maxFrames) {
          if (SchedulerAction === void 0) {
              SchedulerAction = VirtualAction;
          }
          if (maxFrames === void 0) {
              maxFrames = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
          _this.maxFrames = maxFrames;
          _this.frame = 0;
          _this.index = -1;
          return _this;
      }
      VirtualTimeScheduler.prototype.flush = function () {
          var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
          var error, action;
          while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
              if (error = action.execute(action.state, action.delay)) {
                  break;
              }
          }
          if (error) {
              while (action = actions.shift()) {
                  action.unsubscribe();
              }
              throw error;
          }
      };
      VirtualTimeScheduler.frameTimeFactor = 10;
      return VirtualTimeScheduler;
  }(AsyncScheduler));
  var VirtualAction = /*@__PURE__*/ (function (_super) {
      __extends(VirtualAction, _super);
      function VirtualAction(scheduler, work, index) {
          if (index === void 0) {
              index = scheduler.index += 1;
          }
          var _this = _super.call(this, scheduler, work) || this;
          _this.scheduler = scheduler;
          _this.work = work;
          _this.index = index;
          _this.active = true;
          _this.index = scheduler.index = index;
          return _this;
      }
      VirtualAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          if (!this.id) {
              return _super.prototype.schedule.call(this, state, delay);
          }
          this.active = false;
          var action = new VirtualAction(this.scheduler, this.work);
          this.add(action);
          return action.schedule(state, delay);
      };
      VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          this.delay = scheduler.frame + delay;
          var actions = scheduler.actions;
          actions.push(this);
          actions.sort(VirtualAction.sortActions);
          return true;
      };
      VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
              delay = 0;
          }
          return undefined;
      };
      VirtualAction.prototype._execute = function (state, delay) {
          if (this.active === true) {
              return _super.prototype._execute.call(this, state, delay);
          }
      };
      VirtualAction.sortActions = function (a, b) {
          if (a.delay === b.delay) {
              if (a.index === b.index) {
                  return 0;
              }
              else if (a.index > b.index) {
                  return 1;
              }
              else {
                  return -1;
              }
          }
          else if (a.delay > b.delay) {
              return 1;
          }
          else {
              return -1;
          }
      };
      return VirtualAction;
  }(AsyncAction));
  //# sourceMappingURL=VirtualTimeScheduler.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=identity.js.map

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  //# sourceMappingURL=isObservable.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=ArgumentOutOfRangeError.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function EmptyErrorImpl() {
      Error.call(this);
      this.message = 'no elements in sequence';
      this.name = 'EmptyError';
      return this;
  }
  EmptyErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  var EmptyError = EmptyErrorImpl;
  //# sourceMappingURL=EmptyError.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=TimeoutError.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function map(project, thisArg) {
      return function mapOperation(source) {
          if (typeof project !== 'function') {
              throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
          }
          return source.lift(new MapOperator(project, thisArg));
      };
  }
  var MapOperator = /*@__PURE__*/ (function () {
      function MapOperator(project, thisArg) {
          this.project = project;
          this.thisArg = thisArg;
      }
      MapOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
      };
      return MapOperator;
  }());
  var MapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapSubscriber, _super);
      function MapSubscriber(destination, project, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.count = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      MapSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.project.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return MapSubscriber;
  }(Subscriber));
  //# sourceMappingURL=map.js.map

  /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */
  //# sourceMappingURL=bindCallback.js.map

  /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */
  //# sourceMappingURL=bindNodeCallback.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var OuterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(OuterSubscriber, _super);
      function OuterSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      OuterSubscriber.prototype.notifyError = function (error, innerSub) {
          this.destination.error(error);
      };
      OuterSubscriber.prototype.notifyComplete = function (innerSub) {
          this.destination.complete();
      };
      return OuterSubscriber;
  }(Subscriber));
  //# sourceMappingURL=OuterSubscriber.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var InnerSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(InnerSubscriber, _super);
      function InnerSubscriber(parent, outerValue, outerIndex) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          _this.outerValue = outerValue;
          _this.outerIndex = outerIndex;
          _this.index = 0;
          return _this;
      }
      InnerSubscriber.prototype._next = function (value) {
          this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
      };
      InnerSubscriber.prototype._error = function (error) {
          this.parent.notifyError(error, this);
          this.unsubscribe();
      };
      InnerSubscriber.prototype._complete = function () {
          this.parent.notifyComplete(this);
          this.unsubscribe();
      };
      return InnerSubscriber;
  }(Subscriber));
  //# sourceMappingURL=InnerSubscriber.js.map

  /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
  var subscribeToPromise = function (promise) {
      return function (subscriber) {
          promise.then(function (value) {
              if (!subscriber.closed) {
                  subscriber.next(value);
                  subscriber.complete();
              }
          }, function (err) { return subscriber.error(err); })
              .then(null, hostReportError);
          return subscriber;
      };
  };
  //# sourceMappingURL=subscribeToPromise.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function getSymbolIterator() {
      if (typeof Symbol !== 'function' || !Symbol.iterator) {
          return '@@iterator';
      }
      return Symbol.iterator;
  }
  var iterator = /*@__PURE__*/ getSymbolIterator();
  //# sourceMappingURL=iterator.js.map

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
  var subscribeToIterable = function (iterable) {
      return function (subscriber) {
          var iterator$$1 = iterable[iterator]();
          do {
              var item = iterator$$1.next();
              if (item.done) {
                  subscriber.complete();
                  break;
              }
              subscriber.next(item.value);
              if (subscriber.closed) {
                  break;
              }
          } while (true);
          if (typeof iterator$$1.return === 'function') {
              subscriber.add(function () {
                  if (iterator$$1.return) {
                      iterator$$1.return();
                  }
              });
          }
          return subscriber;
      };
  };
  //# sourceMappingURL=subscribeToIterable.js.map

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
  var subscribeToObservable = function (obj) {
      return function (subscriber) {
          var obs = obj[observable]();
          if (typeof obs.subscribe !== 'function') {
              throw new TypeError('Provided object does not correctly implement Symbol.observable');
          }
          else {
              return obs.subscribe(subscriber);
          }
      };
  };
  //# sourceMappingURL=subscribeToObservable.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
  //# sourceMappingURL=isArrayLike.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  function isPromise(value) {
      return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
  }
  //# sourceMappingURL=isPromise.js.map

  /** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
  var subscribeTo = function (result) {
      if (result instanceof Observable) {
          return function (subscriber) {
              if (result._isScalar) {
                  subscriber.next(result.value);
                  subscriber.complete();
                  return undefined;
              }
              else {
                  return result.subscribe(subscriber);
              }
          };
      }
      else if (result && typeof result[observable] === 'function') {
          return subscribeToObservable(result);
      }
      else if (isArrayLike(result)) {
          return subscribeToArray(result);
      }
      else if (isPromise(result)) {
          return subscribeToPromise(result);
      }
      else if (result && typeof result[iterator] === 'function') {
          return subscribeToIterable(result);
      }
      else {
          var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
          var msg = "You provided " + value + " where a stream was expected."
              + ' You can provide an Observable, Promise, Array, or Iterable.';
          throw new TypeError(msg);
      }
  };
  //# sourceMappingURL=subscribeTo.js.map

  /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
  function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
      if (destination === void 0) {
          destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
      }
      if (destination.closed) {
          return;
      }
      return subscribeTo(result)(destination);
  }
  //# sourceMappingURL=subscribeToResult.js.map

  /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
  var NONE = {};
  var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CombineLatestSubscriber, _super);
      function CombineLatestSubscriber(destination, resultSelector) {
          var _this = _super.call(this, destination) || this;
          _this.resultSelector = resultSelector;
          _this.active = 0;
          _this.values = [];
          _this.observables = [];
          return _this;
      }
      CombineLatestSubscriber.prototype._next = function (observable) {
          this.values.push(NONE);
          this.observables.push(observable);
      };
      CombineLatestSubscriber.prototype._complete = function () {
          var observables = this.observables;
          var len = observables.length;
          if (len === 0) {
              this.destination.complete();
          }
          else {
              this.active = len;
              this.toRespond = len;
              for (var i = 0; i < len; i++) {
                  var observable = observables[i];
                  this.add(subscribeToResult(this, observable, observable, i));
              }
          }
      };
      CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
          if ((this.active -= 1) === 0) {
              this.destination.complete();
          }
      };
      CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var values = this.values;
          var oldVal = values[outerIndex];
          var toRespond = !this.toRespond
              ? 0
              : oldVal === NONE ? --this.toRespond : this.toRespond;
          values[outerIndex] = innerValue;
          if (toRespond === 0) {
              if (this.resultSelector) {
                  this._tryResultSelector(values);
              }
              else {
                  this.destination.next(values.slice());
              }
          }
      };
      CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
          var result;
          try {
              result = this.resultSelector.apply(this, values);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return CombineLatestSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=combineLatest.js.map

  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
  function isInteropObservable(input) {
      return input && typeof input[observable] === 'function';
  }
  //# sourceMappingURL=isInteropObservable.js.map

  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
  function isIterable(input) {
      return input && typeof input[iterator] === 'function';
  }
  //# sourceMappingURL=isIterable.js.map

  /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */
  function fromPromise(input, scheduler) {
      if (!scheduler) {
          return new Observable(subscribeToPromise(input));
      }
      else {
          return new Observable(function (subscriber) {
              var sub = new Subscription();
              sub.add(scheduler.schedule(function () {
                  return input.then(function (value) {
                      sub.add(scheduler.schedule(function () {
                          subscriber.next(value);
                          sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                      }));
                  }, function (err) {
                      sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
                  });
              }));
              return sub;
          });
      }
  }
  //# sourceMappingURL=fromPromise.js.map

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */
  function fromIterable(input, scheduler) {
      if (!input) {
          throw new Error('Iterable cannot be null');
      }
      if (!scheduler) {
          return new Observable(subscribeToIterable(input));
      }
      else {
          return new Observable(function (subscriber) {
              var sub = new Subscription();
              var iterator$$1;
              sub.add(function () {
                  if (iterator$$1 && typeof iterator$$1.return === 'function') {
                      iterator$$1.return();
                  }
              });
              sub.add(scheduler.schedule(function () {
                  iterator$$1 = input[iterator]();
                  sub.add(scheduler.schedule(function () {
                      if (subscriber.closed) {
                          return;
                      }
                      var value;
                      var done;
                      try {
                          var result = iterator$$1.next();
                          value = result.value;
                          done = result.done;
                      }
                      catch (err) {
                          subscriber.error(err);
                          return;
                      }
                      if (done) {
                          subscriber.complete();
                      }
                      else {
                          subscriber.next(value);
                          this.schedule();
                      }
                  }));
              }));
              return sub;
          });
      }
  }
  //# sourceMappingURL=fromIterable.js.map

  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */
  function fromObservable(input, scheduler) {
      if (!scheduler) {
          return new Observable(subscribeToObservable(input));
      }
      else {
          return new Observable(function (subscriber) {
              var sub = new Subscription();
              sub.add(scheduler.schedule(function () {
                  var observable$$1 = input[observable]();
                  sub.add(observable$$1.subscribe({
                      next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                      error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                      complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
                  }));
              }));
              return sub;
          });
      }
  }
  //# sourceMappingURL=fromObservable.js.map

  /** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */
  function from(input, scheduler) {
      if (!scheduler) {
          if (input instanceof Observable) {
              return input;
          }
          return new Observable(subscribeTo(input));
      }
      if (input != null) {
          if (isInteropObservable(input)) {
              return fromObservable(input, scheduler);
          }
          else if (isPromise(input)) {
              return fromPromise(input, scheduler);
          }
          else if (isArrayLike(input)) {
              return fromArray(input, scheduler);
          }
          else if (isIterable(input) || typeof input === 'string') {
              return fromIterable(input, scheduler);
          }
      }
      throw new TypeError((input !== null && typeof input || input) + ' is not observable');
  }
  //# sourceMappingURL=from.js.map

  /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
  var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MergeMapSubscriber, _super);
      function MergeMapSubscriber(destination, project, concurrent) {
          if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
          }
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.concurrent = concurrent;
          _this.hasCompleted = false;
          _this.buffer = [];
          _this.active = 0;
          _this.index = 0;
          return _this;
      }
      MergeMapSubscriber.prototype._next = function (value) {
          if (this.active < this.concurrent) {
              this._tryNext(value);
          }
          else {
              this.buffer.push(value);
          }
      };
      MergeMapSubscriber.prototype._tryNext = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.active++;
          this._innerSub(result, value, index);
      };
      MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, ish, value, index, innerSubscriber);
      };
      MergeMapSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          this.remove(innerSub);
          this.active--;
          if (buffer.length > 0) {
              this._next(buffer.shift());
          }
          else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
          }
      };
      return MergeMapSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=mergeMap.js.map

  /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
  //# sourceMappingURL=mergeAll.js.map

  /** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */
  //# sourceMappingURL=concatAll.js.map

  /** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */
  //# sourceMappingURL=concat.js.map

  /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
  //# sourceMappingURL=defer.js.map

  /** PURE_IMPORTS_START tslib,_Observable,_util_isArray,_empty,_util_subscribeToResult,_OuterSubscriber,_operators_map PURE_IMPORTS_END */
  var ForkJoinSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ForkJoinSubscriber, _super);
      function ForkJoinSubscriber(destination, sources) {
          var _this = _super.call(this, destination) || this;
          _this.sources = sources;
          _this.completed = 0;
          _this.haveValues = 0;
          var len = sources.length;
          _this.values = new Array(len);
          for (var i = 0; i < len; i++) {
              var source = sources[i];
              var innerSubscription = subscribeToResult(_this, source, null, i);
              if (innerSubscription) {
                  _this.add(innerSubscription);
              }
          }
          return _this;
      }
      ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values[outerIndex] = innerValue;
          if (!innerSub._hasValue) {
              innerSub._hasValue = true;
              this.haveValues++;
          }
      };
      ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
          var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
          var len = values.length;
          if (!innerSub._hasValue) {
              destination.complete();
              return;
          }
          this.completed++;
          if (this.completed !== len) {
              return;
          }
          if (haveValues === len) {
              destination.next(values);
          }
          destination.complete();
      };
      return ForkJoinSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=forkJoin.js.map

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
  //# sourceMappingURL=fromEvent.js.map

  /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
  //# sourceMappingURL=fromEventPattern.js.map

  /** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */
  //# sourceMappingURL=generate.js.map

  /** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */
  //# sourceMappingURL=iif.js.map

  /** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
  function isNumeric(val) {
      return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }
  //# sourceMappingURL=isNumeric.js.map

  /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */
  //# sourceMappingURL=interval.js.map

  /** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
  //# sourceMappingURL=merge.js.map

  /** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
  //# sourceMappingURL=never.js.map

  /** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */
  //# sourceMappingURL=onErrorResumeNext.js.map

  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
  //# sourceMappingURL=pairs.js.map

  /** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RaceSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RaceSubscriber, _super);
      function RaceSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasFirst = false;
          _this.observables = [];
          _this.subscriptions = [];
          return _this;
      }
      RaceSubscriber.prototype._next = function (observable) {
          this.observables.push(observable);
      };
      RaceSubscriber.prototype._complete = function () {
          var observables = this.observables;
          var len = observables.length;
          if (len === 0) {
              this.destination.complete();
          }
          else {
              for (var i = 0; i < len && !this.hasFirst; i++) {
                  var observable = observables[i];
                  var subscription = subscribeToResult(this, observable, observable, i);
                  if (this.subscriptions) {
                      this.subscriptions.push(subscription);
                  }
                  this.add(subscription);
              }
              this.observables = null;
          }
      };
      RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          if (!this.hasFirst) {
              this.hasFirst = true;
              for (var i = 0; i < this.subscriptions.length; i++) {
                  if (i !== outerIndex) {
                      var subscription = this.subscriptions[i];
                      subscription.unsubscribe();
                      this.remove(subscription);
                  }
              }
              this.subscriptions = null;
          }
          this.destination.next(innerValue);
      };
      return RaceSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=race.js.map

  /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
  //# sourceMappingURL=range.js.map

  /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
  //# sourceMappingURL=timer.js.map

  /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
  //# sourceMappingURL=using.js.map

  /** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
  var ZipSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ZipSubscriber, _super);
      function ZipSubscriber(destination, resultSelector, values) {
          if (values === void 0) {
              values = Object.create(null);
          }
          var _this = _super.call(this, destination) || this;
          _this.iterators = [];
          _this.active = 0;
          _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
          _this.values = values;
          return _this;
      }
      ZipSubscriber.prototype._next = function (value) {
          var iterators = this.iterators;
          if (isArray(value)) {
              iterators.push(new StaticArrayIterator(value));
          }
          else if (typeof value[iterator] === 'function') {
              iterators.push(new StaticIterator(value[iterator]()));
          }
          else {
              iterators.push(new ZipBufferIterator(this.destination, this, value));
          }
      };
      ZipSubscriber.prototype._complete = function () {
          var iterators = this.iterators;
          var len = iterators.length;
          this.unsubscribe();
          if (len === 0) {
              this.destination.complete();
              return;
          }
          this.active = len;
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              if (iterator$$1.stillUnsubscribed) {
                  var destination = this.destination;
                  destination.add(iterator$$1.subscribe(iterator$$1, i));
              }
              else {
                  this.active--;
              }
          }
      };
      ZipSubscriber.prototype.notifyInactive = function () {
          this.active--;
          if (this.active === 0) {
              this.destination.complete();
          }
      };
      ZipSubscriber.prototype.checkIterators = function () {
          var iterators = this.iterators;
          var len = iterators.length;
          var destination = this.destination;
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                  return;
              }
          }
          var shouldComplete = false;
          var args = [];
          for (var i = 0; i < len; i++) {
              var iterator$$1 = iterators[i];
              var result = iterator$$1.next();
              if (iterator$$1.hasCompleted()) {
                  shouldComplete = true;
              }
              if (result.done) {
                  destination.complete();
                  return;
              }
              args.push(result.value);
          }
          if (this.resultSelector) {
              this._tryresultSelector(args);
          }
          else {
              destination.next(args);
          }
          if (shouldComplete) {
              destination.complete();
          }
      };
      ZipSubscriber.prototype._tryresultSelector = function (args) {
          var result;
          try {
              result = this.resultSelector.apply(this, args);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return ZipSubscriber;
  }(Subscriber));
  var StaticIterator = /*@__PURE__*/ (function () {
      function StaticIterator(iterator$$1) {
          this.iterator = iterator$$1;
          this.nextResult = iterator$$1.next();
      }
      StaticIterator.prototype.hasValue = function () {
          return true;
      };
      StaticIterator.prototype.next = function () {
          var result = this.nextResult;
          this.nextResult = this.iterator.next();
          return result;
      };
      StaticIterator.prototype.hasCompleted = function () {
          var nextResult = this.nextResult;
          return nextResult && nextResult.done;
      };
      return StaticIterator;
  }());
  var StaticArrayIterator = /*@__PURE__*/ (function () {
      function StaticArrayIterator(array) {
          this.array = array;
          this.index = 0;
          this.length = 0;
          this.length = array.length;
      }
      StaticArrayIterator.prototype[iterator] = function () {
          return this;
      };
      StaticArrayIterator.prototype.next = function (value) {
          var i = this.index++;
          var array = this.array;
          return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
      };
      StaticArrayIterator.prototype.hasValue = function () {
          return this.array.length > this.index;
      };
      StaticArrayIterator.prototype.hasCompleted = function () {
          return this.array.length === this.index;
      };
      return StaticArrayIterator;
  }());
  var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
      __extends(ZipBufferIterator, _super);
      function ZipBufferIterator(destination, parent, observable) {
          var _this = _super.call(this, destination) || this;
          _this.parent = parent;
          _this.observable = observable;
          _this.stillUnsubscribed = true;
          _this.buffer = [];
          _this.isComplete = false;
          return _this;
      }
      ZipBufferIterator.prototype[iterator] = function () {
          return this;
      };
      ZipBufferIterator.prototype.next = function () {
          var buffer = this.buffer;
          if (buffer.length === 0 && this.isComplete) {
              return { value: null, done: true };
          }
          else {
              return { value: buffer.shift(), done: false };
          }
      };
      ZipBufferIterator.prototype.hasValue = function () {
          return this.buffer.length > 0;
      };
      ZipBufferIterator.prototype.hasCompleted = function () {
          return this.buffer.length === 0 && this.isComplete;
      };
      ZipBufferIterator.prototype.notifyComplete = function () {
          if (this.buffer.length > 0) {
              this.isComplete = true;
              this.parent.notifyInactive();
          }
          else {
              this.destination.complete();
          }
      };
      ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.buffer.push(innerValue);
          this.parent.checkIterators();
      };
      ZipBufferIterator.prototype.subscribe = function (value, index) {
          return subscribeToResult(this, this.observable, this, index);
      };
      return ZipBufferIterator;
  }(OuterSubscriber));
  //# sourceMappingURL=zip.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=index.js.map

  function _isCorrectVal(variable, notBezero) {
    var result = true;
    if (typeof variable === "string") {
      if (variable === "" || variable === "undefined" || variable === "null" || variable === "NaN" || variable === "Infinity") {
        result = false;
      }
    } else if (typeof variable === "number") {
      if (isNaN(variable) || !isFinite(variable)) {
        result = false;
      }
      if (notBezero) return variable > 0;
    } else if (variable === null) {
      result = false;
    } else if (typeof variable === "undefined") {
      result = false;
    } else if (_isObject(variable)) {
      if (_isEmptyObject(variable)) {
        result = false;
      }
    } else if (Array.isArray(variable)) {
      if (variable.length === 0) {
        result = false;
      }
    }
    return result;
  }
  var isCorrectVal = _isCorrectVal;

  function _isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  var isObject$1 = _isObject;

  function _isEmptyObject(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }

  var eventBus$ = new Subject();

  /**
   * 全局事件触发器
  */

  var distributor$ = {
    /**
     * 推送事件
     * @param {string|object|objectArray} events - 事件集合
     * @example
     * import { distributor$ } from "rx-samsara";
     * distributor$.next("eventName");
     * @example
     * import { distributor$ } from "rx-samsara";
     * distributor$.next({
     *   type: "eventName"
     * });
     * @example
     * import { distributor$ } from "rx-samsara";
     * distributor$.next([
     *   {
     *     type: "eventName"
     *   }
     * ]);
    */
    next: function next(events) {
      if (!Array.isArray(events)) {
        events = [events];
      }
      var map = {};
      events.forEach(function (event) {
        if (typeof event === "string") {
          var type = event;
          event = { type: type };
        }
        if (!isCorrectVal(event.payload)) event.payload = {};
        if (!isCorrectVal(event.options)) event.options = {};
        map[event.type] = event;
      });
      eventBus$.next(map);
    }
  };

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var AuditSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(AuditSubscriber, _super);
      function AuditSubscriber(destination, durationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.durationSelector = durationSelector;
          _this.hasValue = false;
          return _this;
      }
      AuditSubscriber.prototype._next = function (value) {
          this.value = value;
          this.hasValue = true;
          if (!this.throttled) {
              var duration = tryCatch(this.durationSelector)(value);
              if (duration === errorObject) {
                  this.destination.error(errorObject.e);
              }
              else {
                  var innerSubscription = subscribeToResult(this, duration);
                  if (!innerSubscription || innerSubscription.closed) {
                      this.clearThrottle();
                  }
                  else {
                      this.add(this.throttled = innerSubscription);
                  }
              }
          }
      };
      AuditSubscriber.prototype.clearThrottle = function () {
          var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
          if (throttled) {
              this.remove(throttled);
              this.throttled = null;
              throttled.unsubscribe();
          }
          if (hasValue) {
              this.value = null;
              this.hasValue = false;
              this.destination.next(value);
          }
      };
      AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
          this.clearThrottle();
      };
      AuditSubscriber.prototype.notifyComplete = function () {
          this.clearThrottle();
      };
      return AuditSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=audit.js.map

  /** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */
  //# sourceMappingURL=auditTime.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var BufferSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferSubscriber, _super);
      function BufferSubscriber(destination, closingNotifier) {
          var _this = _super.call(this, destination) || this;
          _this.buffer = [];
          _this.add(subscribeToResult(_this, closingNotifier));
          return _this;
      }
      BufferSubscriber.prototype._next = function (value) {
          this.buffer.push(value);
      };
      BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var buffer = this.buffer;
          this.buffer = [];
          this.destination.next(buffer);
      };
      return BufferSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=buffer.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var BufferCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferCountSubscriber, _super);
      function BufferCountSubscriber(destination, bufferSize) {
          var _this = _super.call(this, destination) || this;
          _this.bufferSize = bufferSize;
          _this.buffer = [];
          return _this;
      }
      BufferCountSubscriber.prototype._next = function (value) {
          var buffer = this.buffer;
          buffer.push(value);
          if (buffer.length == this.bufferSize) {
              this.destination.next(buffer);
              this.buffer = [];
          }
      };
      BufferCountSubscriber.prototype._complete = function () {
          var buffer = this.buffer;
          if (buffer.length > 0) {
              this.destination.next(buffer);
          }
          _super.prototype._complete.call(this);
      };
      return BufferCountSubscriber;
  }(Subscriber));
  var BufferSkipCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferSkipCountSubscriber, _super);
      function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
          var _this = _super.call(this, destination) || this;
          _this.bufferSize = bufferSize;
          _this.startBufferEvery = startBufferEvery;
          _this.buffers = [];
          _this.count = 0;
          return _this;
      }
      BufferSkipCountSubscriber.prototype._next = function (value) {
          var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
          this.count++;
          if (count % startBufferEvery === 0) {
              buffers.push([]);
          }
          for (var i = buffers.length; i--;) {
              var buffer = buffers[i];
              buffer.push(value);
              if (buffer.length === bufferSize) {
                  buffers.splice(i, 1);
                  this.destination.next(buffer);
              }
          }
      };
      BufferSkipCountSubscriber.prototype._complete = function () {
          var _a = this, buffers = _a.buffers, destination = _a.destination;
          while (buffers.length > 0) {
              var buffer = buffers.shift();
              if (buffer.length > 0) {
                  destination.next(buffer);
              }
          }
          _super.prototype._complete.call(this);
      };
      return BufferSkipCountSubscriber;
  }(Subscriber));
  //# sourceMappingURL=bufferCount.js.map

  /** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */
  var Context = /*@__PURE__*/ (function () {
      function Context() {
          this.buffer = [];
      }
      return Context;
  }());
  var BufferTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferTimeSubscriber, _super);
      function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.bufferTimeSpan = bufferTimeSpan;
          _this.bufferCreationInterval = bufferCreationInterval;
          _this.maxBufferSize = maxBufferSize;
          _this.scheduler = scheduler;
          _this.contexts = [];
          var context = _this.openContext();
          _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
          if (_this.timespanOnly) {
              var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
              _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
          }
          else {
              var closeState = { subscriber: _this, context: context };
              var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
              _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
              _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
          }
          return _this;
      }
      BufferTimeSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          var len = contexts.length;
          var filledBufferContext;
          for (var i = 0; i < len; i++) {
              var context_1 = contexts[i];
              var buffer = context_1.buffer;
              buffer.push(value);
              if (buffer.length == this.maxBufferSize) {
                  filledBufferContext = context_1;
              }
          }
          if (filledBufferContext) {
              this.onBufferFull(filledBufferContext);
          }
      };
      BufferTimeSubscriber.prototype._error = function (err) {
          this.contexts.length = 0;
          _super.prototype._error.call(this, err);
      };
      BufferTimeSubscriber.prototype._complete = function () {
          var _a = this, contexts = _a.contexts, destination = _a.destination;
          while (contexts.length > 0) {
              var context_2 = contexts.shift();
              destination.next(context_2.buffer);
          }
          _super.prototype._complete.call(this);
      };
      BufferTimeSubscriber.prototype._unsubscribe = function () {
          this.contexts = null;
      };
      BufferTimeSubscriber.prototype.onBufferFull = function (context) {
          this.closeContext(context);
          var closeAction = context.closeAction;
          closeAction.unsubscribe();
          this.remove(closeAction);
          if (!this.closed && this.timespanOnly) {
              context = this.openContext();
              var bufferTimeSpan = this.bufferTimeSpan;
              var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
              this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
          }
      };
      BufferTimeSubscriber.prototype.openContext = function () {
          var context = new Context();
          this.contexts.push(context);
          return context;
      };
      BufferTimeSubscriber.prototype.closeContext = function (context) {
          this.destination.next(context.buffer);
          var contexts = this.contexts;
          var spliceIndex = contexts ? contexts.indexOf(context) : -1;
          if (spliceIndex >= 0) {
              contexts.splice(contexts.indexOf(context), 1);
          }
      };
      return BufferTimeSubscriber;
  }(Subscriber));
  function dispatchBufferTimeSpanOnly(state) {
      var subscriber = state.subscriber;
      var prevContext = state.context;
      if (prevContext) {
          subscriber.closeContext(prevContext);
      }
      if (!subscriber.closed) {
          state.context = subscriber.openContext();
          state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
      }
  }
  function dispatchBufferCreation(state) {
      var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
      var context = subscriber.openContext();
      var action = this;
      if (!subscriber.closed) {
          subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
          action.schedule(state, bufferCreationInterval);
      }
  }
  function dispatchBufferClose(arg) {
      var subscriber = arg.subscriber, context = arg.context;
      subscriber.closeContext(context);
  }
  //# sourceMappingURL=bufferTime.js.map

  /** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */
  var BufferToggleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferToggleSubscriber, _super);
      function BufferToggleSubscriber(destination, openings, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.openings = openings;
          _this.closingSelector = closingSelector;
          _this.contexts = [];
          _this.add(subscribeToResult(_this, openings));
          return _this;
      }
      BufferToggleSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          var len = contexts.length;
          for (var i = 0; i < len; i++) {
              contexts[i].buffer.push(value);
          }
      };
      BufferToggleSubscriber.prototype._error = function (err) {
          var contexts = this.contexts;
          while (contexts.length > 0) {
              var context_1 = contexts.shift();
              context_1.subscription.unsubscribe();
              context_1.buffer = null;
              context_1.subscription = null;
          }
          this.contexts = null;
          _super.prototype._error.call(this, err);
      };
      BufferToggleSubscriber.prototype._complete = function () {
          var contexts = this.contexts;
          while (contexts.length > 0) {
              var context_2 = contexts.shift();
              this.destination.next(context_2.buffer);
              context_2.subscription.unsubscribe();
              context_2.buffer = null;
              context_2.subscription = null;
          }
          this.contexts = null;
          _super.prototype._complete.call(this);
      };
      BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
      };
      BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
          this.closeBuffer(innerSub.context);
      };
      BufferToggleSubscriber.prototype.openBuffer = function (value) {
          try {
              var closingSelector = this.closingSelector;
              var closingNotifier = closingSelector.call(this, value);
              if (closingNotifier) {
                  this.trySubscribe(closingNotifier);
              }
          }
          catch (err) {
              this._error(err);
          }
      };
      BufferToggleSubscriber.prototype.closeBuffer = function (context) {
          var contexts = this.contexts;
          if (contexts && context) {
              var buffer = context.buffer, subscription = context.subscription;
              this.destination.next(buffer);
              contexts.splice(contexts.indexOf(context), 1);
              this.remove(subscription);
              subscription.unsubscribe();
          }
      };
      BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
          var contexts = this.contexts;
          var buffer = [];
          var subscription = new Subscription();
          var context = { buffer: buffer, subscription: subscription };
          contexts.push(context);
          var innerSubscription = subscribeToResult(this, closingNotifier, context);
          if (!innerSubscription || innerSubscription.closed) {
              this.closeBuffer(context);
          }
          else {
              innerSubscription.context = context;
              this.add(innerSubscription);
              subscription.add(innerSubscription);
          }
      };
      return BufferToggleSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=bufferToggle.js.map

  /** PURE_IMPORTS_START tslib,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var BufferWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(BufferWhenSubscriber, _super);
      function BufferWhenSubscriber(destination, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.closingSelector = closingSelector;
          _this.subscribing = false;
          _this.openBuffer();
          return _this;
      }
      BufferWhenSubscriber.prototype._next = function (value) {
          this.buffer.push(value);
      };
      BufferWhenSubscriber.prototype._complete = function () {
          var buffer = this.buffer;
          if (buffer) {
              this.destination.next(buffer);
          }
          _super.prototype._complete.call(this);
      };
      BufferWhenSubscriber.prototype._unsubscribe = function () {
          this.buffer = null;
          this.subscribing = false;
      };
      BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openBuffer();
      };
      BufferWhenSubscriber.prototype.notifyComplete = function () {
          if (this.subscribing) {
              this.complete();
          }
          else {
              this.openBuffer();
          }
      };
      BufferWhenSubscriber.prototype.openBuffer = function () {
          var closingSubscription = this.closingSubscription;
          if (closingSubscription) {
              this.remove(closingSubscription);
              closingSubscription.unsubscribe();
          }
          var buffer = this.buffer;
          if (this.buffer) {
              this.destination.next(buffer);
          }
          this.buffer = [];
          var closingNotifier = tryCatch(this.closingSelector)();
          if (closingNotifier === errorObject) {
              this.error(errorObject.e);
          }
          else {
              closingSubscription = new Subscription();
              this.closingSubscription = closingSubscription;
              this.add(closingSubscription);
              this.subscribing = true;
              closingSubscription.add(subscribeToResult(this, closingNotifier));
              this.subscribing = false;
          }
      };
      return BufferWhenSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=bufferWhen.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var CatchSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CatchSubscriber, _super);
      function CatchSubscriber(destination, selector, caught) {
          var _this = _super.call(this, destination) || this;
          _this.selector = selector;
          _this.caught = caught;
          return _this;
      }
      CatchSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var result = void 0;
              try {
                  result = this.selector(err, this.caught);
              }
              catch (err2) {
                  _super.prototype.error.call(this, err2);
                  return;
              }
              this._unsubscribeAndRecycle();
              var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
              this.add(innerSubscriber);
              subscribeToResult(this, result, undefined, undefined, innerSubscriber);
          }
      };
      return CatchSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=catchError.js.map

  /** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */
  //# sourceMappingURL=combineAll.js.map

  /** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */
  //# sourceMappingURL=combineLatest.js.map

  /** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */
  //# sourceMappingURL=concat.js.map

  /** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */
  //# sourceMappingURL=concatMap.js.map

  /** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */
  //# sourceMappingURL=concatMapTo.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var CountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(CountSubscriber, _super);
      function CountSubscriber(destination, predicate, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.count = 0;
          _this.index = 0;
          return _this;
      }
      CountSubscriber.prototype._next = function (value) {
          if (this.predicate) {
              this._tryPredicate(value);
          }
          else {
              this.count++;
          }
      };
      CountSubscriber.prototype._tryPredicate = function (value) {
          var result;
          try {
              result = this.predicate(value, this.index++, this.source);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (result) {
              this.count++;
          }
      };
      CountSubscriber.prototype._complete = function () {
          this.destination.next(this.count);
          this.destination.complete();
      };
      return CountSubscriber;
  }(Subscriber));
  //# sourceMappingURL=count.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DebounceSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DebounceSubscriber, _super);
      function DebounceSubscriber(destination, durationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.durationSelector = durationSelector;
          _this.hasValue = false;
          _this.durationSubscription = null;
          return _this;
      }
      DebounceSubscriber.prototype._next = function (value) {
          try {
              var result = this.durationSelector.call(this, value);
              if (result) {
                  this._tryNext(value, result);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      DebounceSubscriber.prototype._complete = function () {
          this.emitValue();
          this.destination.complete();
      };
      DebounceSubscriber.prototype._tryNext = function (value, duration) {
          var subscription = this.durationSubscription;
          this.value = value;
          this.hasValue = true;
          if (subscription) {
              subscription.unsubscribe();
              this.remove(subscription);
          }
          subscription = subscribeToResult(this, duration);
          if (subscription && !subscription.closed) {
              this.add(this.durationSubscription = subscription);
          }
      };
      DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.emitValue();
      };
      DebounceSubscriber.prototype.notifyComplete = function () {
          this.emitValue();
      };
      DebounceSubscriber.prototype.emitValue = function () {
          if (this.hasValue) {
              var value = this.value;
              var subscription = this.durationSubscription;
              if (subscription) {
                  this.durationSubscription = null;
                  subscription.unsubscribe();
                  this.remove(subscription);
              }
              this.value = null;
              this.hasValue = false;
              _super.prototype._next.call(this, value);
          }
      };
      return DebounceSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=debounce.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
  var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DebounceTimeSubscriber, _super);
      function DebounceTimeSubscriber(destination, dueTime, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.dueTime = dueTime;
          _this.scheduler = scheduler;
          _this.debouncedSubscription = null;
          _this.lastValue = null;
          _this.hasValue = false;
          return _this;
      }
      DebounceTimeSubscriber.prototype._next = function (value) {
          this.clearDebounce();
          this.lastValue = value;
          this.hasValue = true;
          this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$2, this.dueTime, this));
      };
      DebounceTimeSubscriber.prototype._complete = function () {
          this.debouncedNext();
          this.destination.complete();
      };
      DebounceTimeSubscriber.prototype.debouncedNext = function () {
          this.clearDebounce();
          if (this.hasValue) {
              var lastValue = this.lastValue;
              this.lastValue = null;
              this.hasValue = false;
              this.destination.next(lastValue);
          }
      };
      DebounceTimeSubscriber.prototype.clearDebounce = function () {
          var debouncedSubscription = this.debouncedSubscription;
          if (debouncedSubscription !== null) {
              this.remove(debouncedSubscription);
              debouncedSubscription.unsubscribe();
              this.debouncedSubscription = null;
          }
      };
      return DebounceTimeSubscriber;
  }(Subscriber));
  function dispatchNext$2(subscriber) {
      subscriber.debouncedNext();
  }
  //# sourceMappingURL=debounceTime.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var DefaultIfEmptySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DefaultIfEmptySubscriber, _super);
      function DefaultIfEmptySubscriber(destination, defaultValue) {
          var _this = _super.call(this, destination) || this;
          _this.defaultValue = defaultValue;
          _this.isEmpty = true;
          return _this;
      }
      DefaultIfEmptySubscriber.prototype._next = function (value) {
          this.isEmpty = false;
          this.destination.next(value);
      };
      DefaultIfEmptySubscriber.prototype._complete = function () {
          if (this.isEmpty) {
              this.destination.next(this.defaultValue);
          }
          this.destination.complete();
      };
      return DefaultIfEmptySubscriber;
  }(Subscriber));
  //# sourceMappingURL=defaultIfEmpty.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=isDate.js.map

  /** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */
  var DelaySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DelaySubscriber, _super);
      function DelaySubscriber(destination, delay, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.delay = delay;
          _this.scheduler = scheduler;
          _this.queue = [];
          _this.active = false;
          _this.errored = false;
          return _this;
      }
      DelaySubscriber.dispatch = function (state) {
          var source = state.source;
          var queue = source.queue;
          var scheduler = state.scheduler;
          var destination = state.destination;
          while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
              queue.shift().notification.observe(destination);
          }
          if (queue.length > 0) {
              var delay_1 = Math.max(0, queue[0].time - scheduler.now());
              this.schedule(state, delay_1);
          }
          else {
              this.unsubscribe();
              source.active = false;
          }
      };
      DelaySubscriber.prototype._schedule = function (scheduler) {
          this.active = true;
          var destination = this.destination;
          destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
              source: this, destination: this.destination, scheduler: scheduler
          }));
      };
      DelaySubscriber.prototype.scheduleNotification = function (notification) {
          if (this.errored === true) {
              return;
          }
          var scheduler = this.scheduler;
          var message = new DelayMessage(scheduler.now() + this.delay, notification);
          this.queue.push(message);
          if (this.active === false) {
              this._schedule(scheduler);
          }
      };
      DelaySubscriber.prototype._next = function (value) {
          this.scheduleNotification(Notification.createNext(value));
      };
      DelaySubscriber.prototype._error = function (err) {
          this.errored = true;
          this.queue = [];
          this.destination.error(err);
          this.unsubscribe();
      };
      DelaySubscriber.prototype._complete = function () {
          this.scheduleNotification(Notification.createComplete());
          this.unsubscribe();
      };
      return DelaySubscriber;
  }(Subscriber));
  var DelayMessage = /*@__PURE__*/ (function () {
      function DelayMessage(time, notification) {
          this.time = time;
          this.notification = notification;
      }
      return DelayMessage;
  }());
  //# sourceMappingURL=delay.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DelayWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DelayWhenSubscriber, _super);
      function DelayWhenSubscriber(destination, delayDurationSelector) {
          var _this = _super.call(this, destination) || this;
          _this.delayDurationSelector = delayDurationSelector;
          _this.completed = false;
          _this.delayNotifierSubscriptions = [];
          _this.index = 0;
          return _this;
      }
      DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(outerValue);
          this.removeSubscription(innerSub);
          this.tryComplete();
      };
      DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
          var value = this.removeSubscription(innerSub);
          if (value) {
              this.destination.next(value);
          }
          this.tryComplete();
      };
      DelayWhenSubscriber.prototype._next = function (value) {
          var index = this.index++;
          try {
              var delayNotifier = this.delayDurationSelector(value, index);
              if (delayNotifier) {
                  this.tryDelay(delayNotifier, value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      DelayWhenSubscriber.prototype._complete = function () {
          this.completed = true;
          this.tryComplete();
          this.unsubscribe();
      };
      DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
          subscription.unsubscribe();
          var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
          if (subscriptionIdx !== -1) {
              this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
          }
          return subscription.outerValue;
      };
      DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
          var notifierSubscription = subscribeToResult(this, delayNotifier, value);
          if (notifierSubscription && !notifierSubscription.closed) {
              var destination = this.destination;
              destination.add(notifierSubscription);
              this.delayNotifierSubscriptions.push(notifierSubscription);
          }
      };
      DelayWhenSubscriber.prototype.tryComplete = function () {
          if (this.completed && this.delayNotifierSubscriptions.length === 0) {
              this.destination.complete();
          }
      };
      return DelayWhenSubscriber;
  }(OuterSubscriber));
  var SubscriptionDelayObservable = /*@__PURE__*/ (function (_super) {
      __extends(SubscriptionDelayObservable, _super);
      function SubscriptionDelayObservable(source, subscriptionDelay) {
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.subscriptionDelay = subscriptionDelay;
          return _this;
      }
      SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
          this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
      };
      return SubscriptionDelayObservable;
  }(Observable));
  var SubscriptionDelaySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SubscriptionDelaySubscriber, _super);
      function SubscriptionDelaySubscriber(parent, source) {
          var _this = _super.call(this) || this;
          _this.parent = parent;
          _this.source = source;
          _this.sourceSubscribed = false;
          return _this;
      }
      SubscriptionDelaySubscriber.prototype._next = function (unused) {
          this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype._error = function (err) {
          this.unsubscribe();
          this.parent.error(err);
      };
      SubscriptionDelaySubscriber.prototype._complete = function () {
          this.unsubscribe();
          this.subscribeToSource();
      };
      SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
          if (!this.sourceSubscribed) {
              this.sourceSubscribed = true;
              this.unsubscribe();
              this.source.subscribe(this.parent);
          }
      };
      return SubscriptionDelaySubscriber;
  }(Subscriber));
  //# sourceMappingURL=delayWhen.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var DeMaterializeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DeMaterializeSubscriber, _super);
      function DeMaterializeSubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      DeMaterializeSubscriber.prototype._next = function (value) {
          value.observe(this.destination);
      };
      return DeMaterializeSubscriber;
  }(Subscriber));
  //# sourceMappingURL=dematerialize.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var DistinctSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DistinctSubscriber, _super);
      function DistinctSubscriber(destination, keySelector, flushes) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.values = new Set();
          if (flushes) {
              _this.add(subscribeToResult(_this, flushes));
          }
          return _this;
      }
      DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values.clear();
      };
      DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      DistinctSubscriber.prototype._next = function (value) {
          if (this.keySelector) {
              this._useKeySelector(value);
          }
          else {
              this._finalizeNext(value, value);
          }
      };
      DistinctSubscriber.prototype._useKeySelector = function (value) {
          var key;
          var destination = this.destination;
          try {
              key = this.keySelector(value);
          }
          catch (err) {
              destination.error(err);
              return;
          }
          this._finalizeNext(key, value);
      };
      DistinctSubscriber.prototype._finalizeNext = function (key, value) {
          var values = this.values;
          if (!values.has(key)) {
              values.add(key);
              this.destination.next(value);
          }
      };
      return DistinctSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=distinct.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
  var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(DistinctUntilChangedSubscriber, _super);
      function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
          var _this = _super.call(this, destination) || this;
          _this.keySelector = keySelector;
          _this.hasKey = false;
          if (typeof compare === 'function') {
              _this.compare = compare;
          }
          return _this;
      }
      DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
          return x === y;
      };
      DistinctUntilChangedSubscriber.prototype._next = function (value) {
          var keySelector = this.keySelector;
          var key = value;
          if (keySelector) {
              key = tryCatch(this.keySelector)(value);
              if (key === errorObject) {
                  return this.destination.error(errorObject.e);
              }
          }
          var result = false;
          if (this.hasKey) {
              result = tryCatch(this.compare)(this.key, key);
              if (result === errorObject) {
                  return this.destination.error(errorObject.e);
              }
          }
          else {
              this.hasKey = true;
          }
          if (Boolean(result) === false) {
              this.key = key;
              this.destination.next(value);
          }
      };
      return DistinctUntilChangedSubscriber;
  }(Subscriber));
  //# sourceMappingURL=distinctUntilChanged.js.map

  /** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */
  //# sourceMappingURL=distinctUntilKeyChanged.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  function filter(predicate, thisArg) {
      return function filterOperatorFunction(source) {
          return source.lift(new FilterOperator(predicate, thisArg));
      };
  }
  var FilterOperator = /*@__PURE__*/ (function () {
      function FilterOperator(predicate, thisArg) {
          this.predicate = predicate;
          this.thisArg = thisArg;
      }
      FilterOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
      };
      return FilterOperator;
  }());
  var FilterSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FilterSubscriber, _super);
      function FilterSubscriber(destination, predicate, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.thisArg = thisArg;
          _this.count = 0;
          return _this;
      }
      FilterSubscriber.prototype._next = function (value) {
          var result;
          try {
              result = this.predicate.call(this.thisArg, value, this.count++);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (result) {
              this.destination.next(value);
          }
      };
      return FilterSubscriber;
  }(Subscriber));
  //# sourceMappingURL=filter.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
  var TapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TapSubscriber, _super);
      function TapSubscriber(destination, observerOrNext, error, complete) {
          var _this = _super.call(this, destination) || this;
          _this._tapNext = noop;
          _this._tapError = noop;
          _this._tapComplete = noop;
          _this._tapError = error || noop;
          _this._tapComplete = complete || noop;
          if (isFunction(observerOrNext)) {
              _this._context = _this;
              _this._tapNext = observerOrNext;
          }
          else if (observerOrNext) {
              _this._context = observerOrNext;
              _this._tapNext = observerOrNext.next || noop;
              _this._tapError = observerOrNext.error || noop;
              _this._tapComplete = observerOrNext.complete || noop;
          }
          return _this;
      }
      TapSubscriber.prototype._next = function (value) {
          try {
              this._tapNext.call(this._context, value);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(value);
      };
      TapSubscriber.prototype._error = function (err) {
          try {
              this._tapError.call(this._context, err);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.error(err);
      };
      TapSubscriber.prototype._complete = function () {
          try {
              this._tapComplete.call(this._context);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          return this.destination.complete();
      };
      return TapSubscriber;
  }(Subscriber));
  //# sourceMappingURL=tap.js.map

  /** PURE_IMPORTS_START _tap,_util_EmptyError PURE_IMPORTS_END */
  //# sourceMappingURL=throwIfEmpty.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
  var TakeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeSubscriber, _super);
      function TakeSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.count = 0;
          return _this;
      }
      TakeSubscriber.prototype._next = function (value) {
          var total = this.total;
          var count = ++this.count;
          if (count <= total) {
              this.destination.next(value);
              if (count === total) {
                  this.destination.complete();
                  this.unsubscribe();
              }
          }
      };
      return TakeSubscriber;
  }(Subscriber));
  //# sourceMappingURL=take.js.map

  /** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */
  //# sourceMappingURL=elementAt.js.map

  /** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */
  //# sourceMappingURL=endWith.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var EverySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(EverySubscriber, _super);
      function EverySubscriber(destination, predicate, thisArg, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.thisArg = thisArg;
          _this.source = source;
          _this.index = 0;
          _this.thisArg = thisArg || _this;
          return _this;
      }
      EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
          this.destination.next(everyValueMatch);
          this.destination.complete();
      };
      EverySubscriber.prototype._next = function (value) {
          var result = false;
          try {
              result = this.predicate.call(this.thisArg, value, this.index++, this.source);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          if (!result) {
              this.notifyComplete(false);
          }
      };
      EverySubscriber.prototype._complete = function () {
          this.notifyComplete(true);
      };
      return EverySubscriber;
  }(Subscriber));
  //# sourceMappingURL=every.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SwitchFirstSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SwitchFirstSubscriber, _super);
      function SwitchFirstSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasCompleted = false;
          _this.hasSubscription = false;
          return _this;
      }
      SwitchFirstSubscriber.prototype._next = function (value) {
          if (!this.hasSubscription) {
              this.hasSubscription = true;
              this.add(subscribeToResult(this, value));
          }
      };
      SwitchFirstSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (!this.hasSubscription) {
              this.destination.complete();
          }
      };
      SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
          this.remove(innerSub);
          this.hasSubscription = false;
          if (this.hasCompleted) {
              this.destination.complete();
          }
      };
      return SwitchFirstSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=exhaust.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
  var ExhaustMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ExhaustMapSubscriber, _super);
      function ExhaustMapSubscriber(destination, project) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.hasSubscription = false;
          _this.hasCompleted = false;
          _this.index = 0;
          return _this;
      }
      ExhaustMapSubscriber.prototype._next = function (value) {
          if (!this.hasSubscription) {
              this.tryNext(value);
          }
      };
      ExhaustMapSubscriber.prototype.tryNext = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.hasSubscription = true;
          this._innerSub(result, value, index);
      };
      ExhaustMapSubscriber.prototype._innerSub = function (result, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, result, value, index, innerSubscriber);
      };
      ExhaustMapSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (!this.hasSubscription) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      ExhaustMapSubscriber.prototype.notifyError = function (err) {
          this.destination.error(err);
      };
      ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var destination = this.destination;
          destination.remove(innerSub);
          this.hasSubscription = false;
          if (this.hasCompleted) {
              this.destination.complete();
          }
      };
      return ExhaustMapSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=exhaustMap.js.map

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var ExpandSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ExpandSubscriber, _super);
      function ExpandSubscriber(destination, project, concurrent, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.concurrent = concurrent;
          _this.scheduler = scheduler;
          _this.index = 0;
          _this.active = 0;
          _this.hasCompleted = false;
          if (concurrent < Number.POSITIVE_INFINITY) {
              _this.buffer = [];
          }
          return _this;
      }
      ExpandSubscriber.dispatch = function (arg) {
          var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
          subscriber.subscribeToProjection(result, value, index);
      };
      ExpandSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          if (destination.closed) {
              this._complete();
              return;
          }
          var index = this.index++;
          if (this.active < this.concurrent) {
              destination.next(value);
              var result = tryCatch(this.project)(value, index);
              if (result === errorObject) {
                  destination.error(errorObject.e);
              }
              else if (!this.scheduler) {
                  this.subscribeToProjection(result, value, index);
              }
              else {
                  var state = { subscriber: this, result: result, value: value, index: index };
                  var destination_1 = this.destination;
                  destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
              }
          }
          else {
              this.buffer.push(value);
          }
      };
      ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
          this.active++;
          var destination = this.destination;
          destination.add(subscribeToResult(this, result, value, index));
      };
      ExpandSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
          }
          this.unsubscribe();
      };
      ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this._next(innerValue);
      };
      ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          var destination = this.destination;
          destination.remove(innerSub);
          this.active--;
          if (buffer && buffer.length > 0) {
              this._next(buffer.shift());
          }
          if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
          }
      };
      return ExpandSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=expand.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */
  var FinallySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FinallySubscriber, _super);
      function FinallySubscriber(destination, callback) {
          var _this = _super.call(this, destination) || this;
          _this.add(new Subscription(callback));
          return _this;
      }
      return FinallySubscriber;
  }(Subscriber));
  //# sourceMappingURL=finalize.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var FindValueSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(FindValueSubscriber, _super);
      function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.yieldIndex = yieldIndex;
          _this.thisArg = thisArg;
          _this.index = 0;
          return _this;
      }
      FindValueSubscriber.prototype.notifyComplete = function (value) {
          var destination = this.destination;
          destination.next(value);
          destination.complete();
          this.unsubscribe();
      };
      FindValueSubscriber.prototype._next = function (value) {
          var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
          var index = this.index++;
          try {
              var result = predicate.call(thisArg || this, value, index, this.source);
              if (result) {
                  this.notifyComplete(this.yieldIndex ? index : value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      FindValueSubscriber.prototype._complete = function () {
          this.notifyComplete(this.yieldIndex ? -1 : undefined);
      };
      return FindValueSubscriber;
  }(Subscriber));
  //# sourceMappingURL=find.js.map

  /** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */
  //# sourceMappingURL=findIndex.js.map

  /** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */
  //# sourceMappingURL=first.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var IgnoreElementsSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(IgnoreElementsSubscriber, _super);
      function IgnoreElementsSubscriber() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      IgnoreElementsSubscriber.prototype._next = function (unused) {
      };
      return IgnoreElementsSubscriber;
  }(Subscriber));
  //# sourceMappingURL=ignoreElements.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var IsEmptySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(IsEmptySubscriber, _super);
      function IsEmptySubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
          var destination = this.destination;
          destination.next(isEmpty);
          destination.complete();
      };
      IsEmptySubscriber.prototype._next = function (value) {
          this.notifyComplete(false);
      };
      IsEmptySubscriber.prototype._complete = function () {
          this.notifyComplete(true);
      };
      return IsEmptySubscriber;
  }(Subscriber));
  //# sourceMappingURL=isEmpty.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
  var TakeLastSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeLastSubscriber, _super);
      function TakeLastSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.ring = new Array();
          _this.count = 0;
          return _this;
      }
      TakeLastSubscriber.prototype._next = function (value) {
          var ring = this.ring;
          var total = this.total;
          var count = this.count++;
          if (ring.length < total) {
              ring.push(value);
          }
          else {
              var index = count % total;
              ring[index] = value;
          }
      };
      TakeLastSubscriber.prototype._complete = function () {
          var destination = this.destination;
          var count = this.count;
          if (count > 0) {
              var total = this.count >= this.total ? this.total : this.count;
              var ring = this.ring;
              for (var i = 0; i < total; i++) {
                  var idx = (count++) % total;
                  destination.next(ring[idx]);
              }
          }
          destination.complete();
      };
      return TakeLastSubscriber;
  }(Subscriber));
  //# sourceMappingURL=takeLast.js.map

  /** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */
  //# sourceMappingURL=last.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var MapToSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MapToSubscriber, _super);
      function MapToSubscriber(destination, value) {
          var _this = _super.call(this, destination) || this;
          _this.value = value;
          return _this;
      }
      MapToSubscriber.prototype._next = function (x) {
          this.destination.next(this.value);
      };
      return MapToSubscriber;
  }(Subscriber));
  //# sourceMappingURL=mapTo.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
  var MaterializeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MaterializeSubscriber, _super);
      function MaterializeSubscriber(destination) {
          return _super.call(this, destination) || this;
      }
      MaterializeSubscriber.prototype._next = function (value) {
          this.destination.next(Notification.createNext(value));
      };
      MaterializeSubscriber.prototype._error = function (err) {
          var destination = this.destination;
          destination.next(Notification.createError(err));
          destination.complete();
      };
      MaterializeSubscriber.prototype._complete = function () {
          var destination = this.destination;
          destination.next(Notification.createComplete());
          destination.complete();
      };
      return MaterializeSubscriber;
  }(Subscriber));
  //# sourceMappingURL=materialize.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var ScanSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ScanSubscriber, _super);
      function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
          var _this = _super.call(this, destination) || this;
          _this.accumulator = accumulator;
          _this._seed = _seed;
          _this.hasSeed = hasSeed;
          _this.index = 0;
          return _this;
      }
      Object.defineProperty(ScanSubscriber.prototype, "seed", {
          get: function () {
              return this._seed;
          },
          set: function (value) {
              this.hasSeed = true;
              this._seed = value;
          },
          enumerable: true,
          configurable: true
      });
      ScanSubscriber.prototype._next = function (value) {
          if (!this.hasSeed) {
              this.seed = value;
              this.destination.next(value);
          }
          else {
              return this._tryNext(value);
          }
      };
      ScanSubscriber.prototype._tryNext = function (value) {
          var index = this.index++;
          var result;
          try {
              result = this.accumulator(this.seed, value, index);
          }
          catch (err) {
              this.destination.error(err);
          }
          this.seed = result;
          this.destination.next(result);
      };
      return ScanSubscriber;
  }(Subscriber));
  //# sourceMappingURL=scan.js.map

  /** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */
  //# sourceMappingURL=reduce.js.map

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
  //# sourceMappingURL=max.js.map

  /** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */
  //# sourceMappingURL=merge.js.map

  /** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */
  //# sourceMappingURL=mergeMapTo.js.map

  /** PURE_IMPORTS_START tslib,_util_tryCatch,_util_errorObject,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber PURE_IMPORTS_END */
  var MergeScanSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(MergeScanSubscriber, _super);
      function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
          var _this = _super.call(this, destination) || this;
          _this.accumulator = accumulator;
          _this.acc = acc;
          _this.concurrent = concurrent;
          _this.hasValue = false;
          _this.hasCompleted = false;
          _this.buffer = [];
          _this.active = 0;
          _this.index = 0;
          return _this;
      }
      MergeScanSubscriber.prototype._next = function (value) {
          if (this.active < this.concurrent) {
              var index = this.index++;
              var ish = tryCatch(this.accumulator)(this.acc, value);
              var destination = this.destination;
              if (ish === errorObject) {
                  destination.error(errorObject.e);
              }
              else {
                  this.active++;
                  this._innerSub(ish, value, index);
              }
          }
          else {
              this.buffer.push(value);
          }
      };
      MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          subscribeToResult(this, ish, value, index, innerSubscriber);
      };
      MergeScanSubscriber.prototype._complete = function () {
          this.hasCompleted = true;
          if (this.active === 0 && this.buffer.length === 0) {
              if (this.hasValue === false) {
                  this.destination.next(this.acc);
              }
              this.destination.complete();
          }
          this.unsubscribe();
      };
      MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var destination = this.destination;
          this.acc = innerValue;
          this.hasValue = true;
          destination.next(innerValue);
      };
      MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
          var buffer = this.buffer;
          var destination = this.destination;
          destination.remove(innerSub);
          this.active--;
          if (buffer.length > 0) {
              this._next(buffer.shift());
          }
          else if (this.active === 0 && this.hasCompleted) {
              if (this.hasValue === false) {
                  this.destination.next(this.acc);
              }
              this.destination.complete();
          }
      };
      return MergeScanSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=mergeScan.js.map

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
  //# sourceMappingURL=min.js.map

  /** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */
  //# sourceMappingURL=multicast.js.map

  /** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var OnErrorResumeNextSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(OnErrorResumeNextSubscriber, _super);
      function OnErrorResumeNextSubscriber(destination, nextSources) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.nextSources = nextSources;
          return _this;
      }
      OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
          this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
          this.subscribeToNextSource();
      };
      OnErrorResumeNextSubscriber.prototype._error = function (err) {
          this.subscribeToNextSource();
          this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype._complete = function () {
          this.subscribeToNextSource();
          this.unsubscribe();
      };
      OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
          var next = this.nextSources.shift();
          if (next) {
              var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
              var destination = this.destination;
              destination.add(innerSubscriber);
              subscribeToResult(this, next, undefined, undefined, innerSubscriber);
          }
          else {
              this.destination.complete();
          }
      };
      return OnErrorResumeNextSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=onErrorResumeNext.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(PairwiseSubscriber, _super);
      function PairwiseSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.hasPrev = false;
          return _this;
      }
      PairwiseSubscriber.prototype._next = function (value) {
          if (this.hasPrev) {
              this.destination.next([this.prev, value]);
          }
          else {
              this.hasPrev = true;
          }
          this.prev = value;
      };
      return PairwiseSubscriber;
  }(Subscriber));
  //# sourceMappingURL=pairwise.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=not.js.map

  /** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */
  //# sourceMappingURL=partition.js.map

  /** PURE_IMPORTS_START _map PURE_IMPORTS_END */
  function pluck() {
      var properties = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          properties[_i] = arguments[_i];
      }
      var length = properties.length;
      if (length === 0) {
          throw new Error('list of properties cannot be empty.');
      }
      return function (source) { return map(plucker(properties, length))(source); };
  }
  function plucker(props, length) {
      var mapper = function (x) {
          var currentProp = x;
          for (var i = 0; i < length; i++) {
              var p = currentProp[props[i]];
              if (typeof p !== 'undefined') {
                  currentProp = p;
              }
              else {
                  return undefined;
              }
          }
          return currentProp;
      };
      return mapper;
  }
  //# sourceMappingURL=pluck.js.map

  /** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */
  //# sourceMappingURL=publish.js.map

  /** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */
  //# sourceMappingURL=publishBehavior.js.map

  /** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */
  //# sourceMappingURL=publishLast.js.map

  /** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */
  //# sourceMappingURL=publishReplay.js.map

  /** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */
  //# sourceMappingURL=race.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */
  var RepeatSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RepeatSubscriber, _super);
      function RepeatSubscriber(destination, count, source) {
          var _this = _super.call(this, destination) || this;
          _this.count = count;
          _this.source = source;
          return _this;
      }
      RepeatSubscriber.prototype.complete = function () {
          if (!this.isStopped) {
              var _a = this, source = _a.source, count = _a.count;
              if (count === 0) {
                  return _super.prototype.complete.call(this);
              }
              else if (count > -1) {
                  this.count = count - 1;
              }
              source.subscribe(this._unsubscribeAndRecycle());
          }
      };
      return RepeatSubscriber;
  }(Subscriber));
  //# sourceMappingURL=repeat.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RepeatWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RepeatWhenSubscriber, _super);
      function RepeatWhenSubscriber(destination, notifier, source) {
          var _this = _super.call(this, destination) || this;
          _this.notifier = notifier;
          _this.source = source;
          _this.sourceIsBeingSubscribedTo = true;
          return _this;
      }
      RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.sourceIsBeingSubscribedTo = true;
          this.source.subscribe(this);
      };
      RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
          if (this.sourceIsBeingSubscribedTo === false) {
              return _super.prototype.complete.call(this);
          }
      };
      RepeatWhenSubscriber.prototype.complete = function () {
          this.sourceIsBeingSubscribedTo = false;
          if (!this.isStopped) {
              if (!this.retries) {
                  this.subscribeToRetries();
              }
              if (!this.retriesSubscription || this.retriesSubscription.closed) {
                  return _super.prototype.complete.call(this);
              }
              this._unsubscribeAndRecycle();
              this.notifications.next();
          }
      };
      RepeatWhenSubscriber.prototype._unsubscribe = function () {
          var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
          if (notifications) {
              notifications.unsubscribe();
              this.notifications = null;
          }
          if (retriesSubscription) {
              retriesSubscription.unsubscribe();
              this.retriesSubscription = null;
          }
          this.retries = null;
      };
      RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
          var _unsubscribe = this._unsubscribe;
          this._unsubscribe = null;
          _super.prototype._unsubscribeAndRecycle.call(this);
          this._unsubscribe = _unsubscribe;
          return this;
      };
      RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
          this.notifications = new Subject();
          var retries = tryCatch(this.notifier)(this.notifications);
          if (retries === errorObject) {
              return _super.prototype.complete.call(this);
          }
          this.retries = retries;
          this.retriesSubscription = subscribeToResult(this, retries);
      };
      return RepeatWhenSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=repeatWhen.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var RetrySubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RetrySubscriber, _super);
      function RetrySubscriber(destination, count, source) {
          var _this = _super.call(this, destination) || this;
          _this.count = count;
          _this.source = source;
          return _this;
      }
      RetrySubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var _a = this, source = _a.source, count = _a.count;
              if (count === 0) {
                  return _super.prototype.error.call(this, err);
              }
              else if (count > -1) {
                  this.count = count - 1;
              }
              source.subscribe(this._unsubscribeAndRecycle());
          }
      };
      return RetrySubscriber;
  }(Subscriber));
  //# sourceMappingURL=retry.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var RetryWhenSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(RetryWhenSubscriber, _super);
      function RetryWhenSubscriber(destination, notifier, source) {
          var _this = _super.call(this, destination) || this;
          _this.notifier = notifier;
          _this.source = source;
          return _this;
      }
      RetryWhenSubscriber.prototype.error = function (err) {
          if (!this.isStopped) {
              var errors = this.errors;
              var retries = this.retries;
              var retriesSubscription = this.retriesSubscription;
              if (!retries) {
                  errors = new Subject();
                  retries = tryCatch(this.notifier)(errors);
                  if (retries === errorObject) {
                      return _super.prototype.error.call(this, errorObject.e);
                  }
                  retriesSubscription = subscribeToResult(this, retries);
              }
              else {
                  this.errors = null;
                  this.retriesSubscription = null;
              }
              this._unsubscribeAndRecycle();
              this.errors = errors;
              this.retries = retries;
              this.retriesSubscription = retriesSubscription;
              errors.next(err);
          }
      };
      RetryWhenSubscriber.prototype._unsubscribe = function () {
          var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
          if (errors) {
              errors.unsubscribe();
              this.errors = null;
          }
          if (retriesSubscription) {
              retriesSubscription.unsubscribe();
              this.retriesSubscription = null;
          }
          this.retries = null;
      };
      RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          var _unsubscribe = this._unsubscribe;
          this._unsubscribe = null;
          this._unsubscribeAndRecycle();
          this._unsubscribe = _unsubscribe;
          this.source.subscribe(this);
      };
      return RetryWhenSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=retryWhen.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SampleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SampleSubscriber, _super);
      function SampleSubscriber() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.hasValue = false;
          return _this;
      }
      SampleSubscriber.prototype._next = function (value) {
          this.value = value;
          this.hasValue = true;
      };
      SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.emitValue();
      };
      SampleSubscriber.prototype.notifyComplete = function () {
          this.emitValue();
      };
      SampleSubscriber.prototype.emitValue = function () {
          if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.value);
          }
      };
      return SampleSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=sample.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
  var SampleTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SampleTimeSubscriber, _super);
      function SampleTimeSubscriber(destination, period, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.period = period;
          _this.scheduler = scheduler;
          _this.hasValue = false;
          _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
          return _this;
      }
      SampleTimeSubscriber.prototype._next = function (value) {
          this.lastValue = value;
          this.hasValue = true;
      };
      SampleTimeSubscriber.prototype.notifyNext = function () {
          if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.lastValue);
          }
      };
      return SampleTimeSubscriber;
  }(Subscriber));
  function dispatchNotification(state) {
      var subscriber = state.subscriber, period = state.period;
      subscriber.notifyNext();
      this.schedule(state, period);
  }
  //# sourceMappingURL=sampleTime.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_tryCatch,_util_errorObject PURE_IMPORTS_END */
  var SequenceEqualSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SequenceEqualSubscriber, _super);
      function SequenceEqualSubscriber(destination, compareTo, comparor) {
          var _this = _super.call(this, destination) || this;
          _this.compareTo = compareTo;
          _this.comparor = comparor;
          _this._a = [];
          _this._b = [];
          _this._oneComplete = false;
          _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
          return _this;
      }
      SequenceEqualSubscriber.prototype._next = function (value) {
          if (this._oneComplete && this._b.length === 0) {
              this.emit(false);
          }
          else {
              this._a.push(value);
              this.checkValues();
          }
      };
      SequenceEqualSubscriber.prototype._complete = function () {
          if (this._oneComplete) {
              this.emit(this._a.length === 0 && this._b.length === 0);
          }
          else {
              this._oneComplete = true;
          }
          this.unsubscribe();
      };
      SequenceEqualSubscriber.prototype.checkValues = function () {
          var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
          while (_a.length > 0 && _b.length > 0) {
              var a = _a.shift();
              var b = _b.shift();
              var areEqual = false;
              if (comparor) {
                  areEqual = tryCatch(comparor)(a, b);
                  if (areEqual === errorObject) {
                      this.destination.error(errorObject.e);
                  }
              }
              else {
                  areEqual = a === b;
              }
              if (!areEqual) {
                  this.emit(false);
              }
          }
      };
      SequenceEqualSubscriber.prototype.emit = function (value) {
          var destination = this.destination;
          destination.next(value);
          destination.complete();
      };
      SequenceEqualSubscriber.prototype.nextB = function (value) {
          if (this._oneComplete && this._a.length === 0) {
              this.emit(false);
          }
          else {
              this._b.push(value);
              this.checkValues();
          }
      };
      SequenceEqualSubscriber.prototype.completeB = function () {
          if (this._oneComplete) {
              this.emit(this._a.length === 0 && this._b.length === 0);
          }
          else {
              this._oneComplete = true;
          }
      };
      return SequenceEqualSubscriber;
  }(Subscriber));
  var SequenceEqualCompareToSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SequenceEqualCompareToSubscriber, _super);
      function SequenceEqualCompareToSubscriber(destination, parent) {
          var _this = _super.call(this, destination) || this;
          _this.parent = parent;
          return _this;
      }
      SequenceEqualCompareToSubscriber.prototype._next = function (value) {
          this.parent.nextB(value);
      };
      SequenceEqualCompareToSubscriber.prototype._error = function (err) {
          this.parent.error(err);
          this.unsubscribe();
      };
      SequenceEqualCompareToSubscriber.prototype._complete = function () {
          this.parent.completeB();
          this.unsubscribe();
      };
      return SequenceEqualCompareToSubscriber;
  }(Subscriber));
  //# sourceMappingURL=sequenceEqual.js.map

  /** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */
  //# sourceMappingURL=share.js.map

  /** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */
  //# sourceMappingURL=shareReplay.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */
  var SingleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SingleSubscriber, _super);
      function SingleSubscriber(destination, predicate, source) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.source = source;
          _this.seenValue = false;
          _this.index = 0;
          return _this;
      }
      SingleSubscriber.prototype.applySingleValue = function (value) {
          if (this.seenValue) {
              this.destination.error('Sequence contains more than one element');
          }
          else {
              this.seenValue = true;
              this.singleValue = value;
          }
      };
      SingleSubscriber.prototype._next = function (value) {
          var index = this.index++;
          if (this.predicate) {
              this.tryNext(value, index);
          }
          else {
              this.applySingleValue(value);
          }
      };
      SingleSubscriber.prototype.tryNext = function (value, index) {
          try {
              if (this.predicate(value, index, this.source)) {
                  this.applySingleValue(value);
              }
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      SingleSubscriber.prototype._complete = function () {
          var destination = this.destination;
          if (this.index > 0) {
              destination.next(this.seenValue ? this.singleValue : undefined);
              destination.complete();
          }
          else {
              destination.error(new EmptyError);
          }
      };
      return SingleSubscriber;
  }(Subscriber));
  //# sourceMappingURL=single.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var SkipSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipSubscriber, _super);
      function SkipSubscriber(destination, total) {
          var _this = _super.call(this, destination) || this;
          _this.total = total;
          _this.count = 0;
          return _this;
      }
      SkipSubscriber.prototype._next = function (x) {
          if (++this.count > this.total) {
              this.destination.next(x);
          }
      };
      return SkipSubscriber;
  }(Subscriber));
  //# sourceMappingURL=skip.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */
  var SkipLastSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipLastSubscriber, _super);
      function SkipLastSubscriber(destination, _skipCount) {
          var _this = _super.call(this, destination) || this;
          _this._skipCount = _skipCount;
          _this._count = 0;
          _this._ring = new Array(_skipCount);
          return _this;
      }
      SkipLastSubscriber.prototype._next = function (value) {
          var skipCount = this._skipCount;
          var count = this._count++;
          if (count < skipCount) {
              this._ring[count] = value;
          }
          else {
              var currentIndex = count % skipCount;
              var ring = this._ring;
              var oldValue = ring[currentIndex];
              ring[currentIndex] = value;
              this.destination.next(oldValue);
          }
      };
      return SkipLastSubscriber;
  }(Subscriber));
  //# sourceMappingURL=skipLast.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var SkipUntilSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipUntilSubscriber, _super);
      function SkipUntilSubscriber(destination, notifier) {
          var _this = _super.call(this, destination) || this;
          _this.hasValue = false;
          var innerSubscriber = new InnerSubscriber(_this, undefined, undefined);
          _this.add(innerSubscriber);
          _this.innerSubscription = innerSubscriber;
          subscribeToResult(_this, notifier, undefined, undefined, innerSubscriber);
          return _this;
      }
      SkipUntilSubscriber.prototype._next = function (value) {
          if (this.hasValue) {
              _super.prototype._next.call(this, value);
          }
      };
      SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.hasValue = true;
          if (this.innerSubscription) {
              this.innerSubscription.unsubscribe();
          }
      };
      SkipUntilSubscriber.prototype.notifyComplete = function () {
      };
      return SkipUntilSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=skipUntil.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var SkipWhileSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SkipWhileSubscriber, _super);
      function SkipWhileSubscriber(destination, predicate) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.skipping = true;
          _this.index = 0;
          return _this;
      }
      SkipWhileSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          if (this.skipping) {
              this.tryCallPredicate(value);
          }
          if (!this.skipping) {
              destination.next(value);
          }
      };
      SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
          try {
              var result = this.predicate(value, this.index++);
              this.skipping = Boolean(result);
          }
          catch (err) {
              this.destination.error(err);
          }
      };
      return SkipWhileSubscriber;
  }(Subscriber));
  //# sourceMappingURL=skipWhile.js.map

  /** PURE_IMPORTS_START _observable_fromArray,_observable_scalar,_observable_empty,_observable_concat,_util_isScheduler PURE_IMPORTS_END */
  //# sourceMappingURL=startWith.js.map

  /** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */
  var SubscribeOnObservable = /*@__PURE__*/ (function (_super) {
      __extends(SubscribeOnObservable, _super);
      function SubscribeOnObservable(source, delayTime, scheduler) {
          if (delayTime === void 0) {
              delayTime = 0;
          }
          if (scheduler === void 0) {
              scheduler = asap;
          }
          var _this = _super.call(this) || this;
          _this.source = source;
          _this.delayTime = delayTime;
          _this.scheduler = scheduler;
          if (!isNumeric(delayTime) || delayTime < 0) {
              _this.delayTime = 0;
          }
          if (!scheduler || typeof scheduler.schedule !== 'function') {
              _this.scheduler = asap;
          }
          return _this;
      }
      SubscribeOnObservable.create = function (source, delay, scheduler) {
          if (delay === void 0) {
              delay = 0;
          }
          if (scheduler === void 0) {
              scheduler = asap;
          }
          return new SubscribeOnObservable(source, delay, scheduler);
      };
      SubscribeOnObservable.dispatch = function (arg) {
          var source = arg.source, subscriber = arg.subscriber;
          return this.add(source.subscribe(subscriber));
      };
      SubscribeOnObservable.prototype._subscribe = function (subscriber) {
          var delay = this.delayTime;
          var source = this.source;
          var scheduler = this.scheduler;
          return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
              source: source, subscriber: subscriber
          });
      };
      return SubscribeOnObservable;
  }(Observable));
  //# sourceMappingURL=SubscribeOnObservable.js.map

  /** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */
  //# sourceMappingURL=subscribeOn.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
  function switchMap(project, resultSelector) {
      if (typeof resultSelector === 'function') {
          return function (source) { return source.pipe(switchMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
      }
      return function (source) { return source.lift(new SwitchMapOperator(project)); };
  }
  var SwitchMapOperator = /*@__PURE__*/ (function () {
      function SwitchMapOperator(project) {
          this.project = project;
      }
      SwitchMapOperator.prototype.call = function (subscriber, source) {
          return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
      };
      return SwitchMapOperator;
  }());
  var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(SwitchMapSubscriber, _super);
      function SwitchMapSubscriber(destination, project) {
          var _this = _super.call(this, destination) || this;
          _this.project = project;
          _this.index = 0;
          return _this;
      }
      SwitchMapSubscriber.prototype._next = function (value) {
          var result;
          var index = this.index++;
          try {
              result = this.project(value, index);
          }
          catch (error) {
              this.destination.error(error);
              return;
          }
          this._innerSub(result, value, index);
      };
      SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
          var innerSubscription = this.innerSubscription;
          if (innerSubscription) {
              innerSubscription.unsubscribe();
          }
          var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
          var destination = this.destination;
          destination.add(innerSubscriber);
          this.innerSubscription = subscribeToResult(this, result, value, index, innerSubscriber);
      };
      SwitchMapSubscriber.prototype._complete = function () {
          var innerSubscription = this.innerSubscription;
          if (!innerSubscription || innerSubscription.closed) {
              _super.prototype._complete.call(this);
          }
          this.unsubscribe();
      };
      SwitchMapSubscriber.prototype._unsubscribe = function () {
          this.innerSubscription = null;
      };
      SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
          var destination = this.destination;
          destination.remove(innerSub);
          this.innerSubscription = null;
          if (this.isStopped) {
              _super.prototype._complete.call(this);
          }
      };
      SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.destination.next(innerValue);
      };
      return SwitchMapSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=switchMap.js.map

  /** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */
  //# sourceMappingURL=switchAll.js.map

  /** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */
  //# sourceMappingURL=switchMapTo.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeUntilSubscriber, _super);
      function TakeUntilSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.seenValue = false;
          return _this;
      }
      TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.seenValue = true;
          this.complete();
      };
      TakeUntilSubscriber.prototype.notifyComplete = function () {
      };
      return TakeUntilSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=takeUntil.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
  var TakeWhileSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TakeWhileSubscriber, _super);
      function TakeWhileSubscriber(destination, predicate) {
          var _this = _super.call(this, destination) || this;
          _this.predicate = predicate;
          _this.index = 0;
          return _this;
      }
      TakeWhileSubscriber.prototype._next = function (value) {
          var destination = this.destination;
          var result;
          try {
              result = this.predicate(value, this.index++);
          }
          catch (err) {
              destination.error(err);
              return;
          }
          this.nextOrComplete(value, result);
      };
      TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
          var destination = this.destination;
          if (Boolean(predicateResult)) {
              destination.next(value);
          }
          else {
              destination.complete();
          }
      };
      return TakeWhileSubscriber;
  }(Subscriber));
  //# sourceMappingURL=takeWhile.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var ThrottleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ThrottleSubscriber, _super);
      function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.durationSelector = durationSelector;
          _this._leading = _leading;
          _this._trailing = _trailing;
          _this._hasValue = false;
          return _this;
      }
      ThrottleSubscriber.prototype._next = function (value) {
          this._hasValue = true;
          this._sendValue = value;
          if (!this._throttled) {
              if (this._leading) {
                  this.send();
              }
              else {
                  this.throttle(value);
              }
          }
      };
      ThrottleSubscriber.prototype.send = function () {
          var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
          if (_hasValue) {
              this.destination.next(_sendValue);
              this.throttle(_sendValue);
          }
          this._hasValue = false;
          this._sendValue = null;
      };
      ThrottleSubscriber.prototype.throttle = function (value) {
          var duration = this.tryDurationSelector(value);
          if (duration) {
              this.add(this._throttled = subscribeToResult(this, duration));
          }
      };
      ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
          try {
              return this.durationSelector(value);
          }
          catch (err) {
              this.destination.error(err);
              return null;
          }
      };
      ThrottleSubscriber.prototype.throttlingDone = function () {
          var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
          if (_throttled) {
              _throttled.unsubscribe();
          }
          this._throttled = null;
          if (_trailing) {
              this.send();
          }
      };
      ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.throttlingDone();
      };
      ThrottleSubscriber.prototype.notifyComplete = function () {
          this.throttlingDone();
      };
      return ThrottleSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=throttle.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */
  var ThrottleTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(ThrottleTimeSubscriber, _super);
      function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
          var _this = _super.call(this, destination) || this;
          _this.duration = duration;
          _this.scheduler = scheduler;
          _this.leading = leading;
          _this.trailing = trailing;
          _this._hasTrailingValue = false;
          _this._trailingValue = null;
          return _this;
      }
      ThrottleTimeSubscriber.prototype._next = function (value) {
          if (this.throttled) {
              if (this.trailing) {
                  this._trailingValue = value;
                  this._hasTrailingValue = true;
              }
          }
          else {
              this.add(this.throttled = this.scheduler.schedule(dispatchNext$3, this.duration, { subscriber: this }));
              if (this.leading) {
                  this.destination.next(value);
              }
          }
      };
      ThrottleTimeSubscriber.prototype._complete = function () {
          if (this._hasTrailingValue) {
              this.destination.next(this._trailingValue);
              this.destination.complete();
          }
          else {
              this.destination.complete();
          }
      };
      ThrottleTimeSubscriber.prototype.clearThrottle = function () {
          var throttled = this.throttled;
          if (throttled) {
              if (this.trailing && this._hasTrailingValue) {
                  this.destination.next(this._trailingValue);
                  this._trailingValue = null;
                  this._hasTrailingValue = false;
              }
              throttled.unsubscribe();
              this.remove(throttled);
              this.throttled = null;
          }
      };
      return ThrottleTimeSubscriber;
  }(Subscriber));
  function dispatchNext$3(arg) {
      var subscriber = arg.subscriber;
      subscriber.clearThrottle();
  }
  //# sourceMappingURL=throttleTime.js.map

  /** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */
  //# sourceMappingURL=timeInterval.js.map

  /** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var TimeoutWithSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(TimeoutWithSubscriber, _super);
      function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.absoluteTimeout = absoluteTimeout;
          _this.waitFor = waitFor;
          _this.withObservable = withObservable;
          _this.scheduler = scheduler;
          _this.action = null;
          _this.scheduleTimeout();
          return _this;
      }
      TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
          var withObservable = subscriber.withObservable;
          subscriber._unsubscribeAndRecycle();
          subscriber.add(subscribeToResult(subscriber, withObservable));
      };
      TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
          var action = this.action;
          if (action) {
              this.action = action.schedule(this, this.waitFor);
          }
          else {
              this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
          }
      };
      TimeoutWithSubscriber.prototype._next = function (value) {
          if (!this.absoluteTimeout) {
              this.scheduleTimeout();
          }
          _super.prototype._next.call(this, value);
      };
      TimeoutWithSubscriber.prototype._unsubscribe = function () {
          this.action = null;
          this.scheduler = null;
          this.withObservable = null;
      };
      return TimeoutWithSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=timeoutWith.js.map

  /** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */
  //# sourceMappingURL=timeout.js.map

  /** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */
  //# sourceMappingURL=timestamp.js.map

  /** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
  //# sourceMappingURL=toArray.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowSubscriber, _super);
      function WindowSubscriber(destination) {
          var _this = _super.call(this, destination) || this;
          _this.window = new Subject();
          destination.next(_this.window);
          return _this;
      }
      WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openWindow();
      };
      WindowSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      WindowSubscriber.prototype.notifyComplete = function (innerSub) {
          this._complete();
      };
      WindowSubscriber.prototype._next = function (value) {
          this.window.next(value);
      };
      WindowSubscriber.prototype._error = function (err) {
          this.window.error(err);
          this.destination.error(err);
      };
      WindowSubscriber.prototype._complete = function () {
          this.window.complete();
          this.destination.complete();
      };
      WindowSubscriber.prototype._unsubscribe = function () {
          this.window = null;
      };
      WindowSubscriber.prototype.openWindow = function () {
          var prevWindow = this.window;
          if (prevWindow) {
              prevWindow.complete();
          }
          var destination = this.destination;
          var newWindow = this.window = new Subject();
          destination.next(newWindow);
      };
      return WindowSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=window.js.map

  /** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */
  var WindowCountSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowCountSubscriber, _super);
      function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.windowSize = windowSize;
          _this.startWindowEvery = startWindowEvery;
          _this.windows = [new Subject()];
          _this.count = 0;
          destination.next(_this.windows[0]);
          return _this;
      }
      WindowCountSubscriber.prototype._next = function (value) {
          var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
          var destination = this.destination;
          var windowSize = this.windowSize;
          var windows = this.windows;
          var len = windows.length;
          for (var i = 0; i < len && !this.closed; i++) {
              windows[i].next(value);
          }
          var c = this.count - windowSize + 1;
          if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
              windows.shift().complete();
          }
          if (++this.count % startWindowEvery === 0 && !this.closed) {
              var window_1 = new Subject();
              windows.push(window_1);
              destination.next(window_1);
          }
      };
      WindowCountSubscriber.prototype._error = function (err) {
          var windows = this.windows;
          if (windows) {
              while (windows.length > 0 && !this.closed) {
                  windows.shift().error(err);
              }
          }
          this.destination.error(err);
      };
      WindowCountSubscriber.prototype._complete = function () {
          var windows = this.windows;
          if (windows) {
              while (windows.length > 0 && !this.closed) {
                  windows.shift().complete();
              }
          }
          this.destination.complete();
      };
      WindowCountSubscriber.prototype._unsubscribe = function () {
          this.count = 0;
          this.windows = null;
      };
      return WindowCountSubscriber;
  }(Subscriber));
  //# sourceMappingURL=windowCount.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
  var CountedSubject = /*@__PURE__*/ (function (_super) {
      __extends(CountedSubject, _super);
      function CountedSubject() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._numberOfNextedValues = 0;
          return _this;
      }
      CountedSubject.prototype.next = function (value) {
          this._numberOfNextedValues++;
          _super.prototype.next.call(this, value);
      };
      Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
          get: function () {
              return this._numberOfNextedValues;
          },
          enumerable: true,
          configurable: true
      });
      return CountedSubject;
  }(Subject));
  var WindowTimeSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowTimeSubscriber, _super);
      function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.windowTimeSpan = windowTimeSpan;
          _this.windowCreationInterval = windowCreationInterval;
          _this.maxWindowSize = maxWindowSize;
          _this.scheduler = scheduler;
          _this.windows = [];
          var window = _this.openWindow();
          if (windowCreationInterval !== null && windowCreationInterval >= 0) {
              var closeState = { subscriber: _this, window: window, context: null };
              var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
              _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
              _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
          }
          else {
              var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
              _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
          }
          return _this;
      }
      WindowTimeSubscriber.prototype._next = function (value) {
          var windows = this.windows;
          var len = windows.length;
          for (var i = 0; i < len; i++) {
              var window_1 = windows[i];
              if (!window_1.closed) {
                  window_1.next(value);
                  if (window_1.numberOfNextedValues >= this.maxWindowSize) {
                      this.closeWindow(window_1);
                  }
              }
          }
      };
      WindowTimeSubscriber.prototype._error = function (err) {
          var windows = this.windows;
          while (windows.length > 0) {
              windows.shift().error(err);
          }
          this.destination.error(err);
      };
      WindowTimeSubscriber.prototype._complete = function () {
          var windows = this.windows;
          while (windows.length > 0) {
              var window_2 = windows.shift();
              if (!window_2.closed) {
                  window_2.complete();
              }
          }
          this.destination.complete();
      };
      WindowTimeSubscriber.prototype.openWindow = function () {
          var window = new CountedSubject();
          this.windows.push(window);
          var destination = this.destination;
          destination.next(window);
          return window;
      };
      WindowTimeSubscriber.prototype.closeWindow = function (window) {
          window.complete();
          var windows = this.windows;
          windows.splice(windows.indexOf(window), 1);
      };
      return WindowTimeSubscriber;
  }(Subscriber));
  function dispatchWindowTimeSpanOnly(state) {
      var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
      if (window) {
          subscriber.closeWindow(window);
      }
      state.window = subscriber.openWindow();
      this.schedule(state, windowTimeSpan);
  }
  function dispatchWindowCreation(state) {
      var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
      var window = subscriber.openWindow();
      var action = this;
      var context = { action: action, subscription: null };
      var timeSpanState = { subscriber: subscriber, window: window, context: context };
      context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
      action.add(context.subscription);
      action.schedule(state, windowCreationInterval);
  }
  function dispatchWindowClose(state) {
      var subscriber = state.subscriber, window = state.window, context = state.context;
      if (context && context.action && context.subscription) {
          context.action.remove(context.subscription);
      }
      subscriber.closeWindow(window);
  }
  //# sourceMappingURL=windowTime.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_Subscription,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowToggleSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WindowToggleSubscriber, _super);
      function WindowToggleSubscriber(destination, openings, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.openings = openings;
          _this.closingSelector = closingSelector;
          _this.contexts = [];
          _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
          return _this;
      }
      WindowToggleSubscriber.prototype._next = function (value) {
          var contexts = this.contexts;
          if (contexts) {
              var len = contexts.length;
              for (var i = 0; i < len; i++) {
                  contexts[i].window.next(value);
              }
          }
      };
      WindowToggleSubscriber.prototype._error = function (err) {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_1 = contexts[index];
                  context_1.window.error(err);
                  context_1.subscription.unsubscribe();
              }
          }
          _super.prototype._error.call(this, err);
      };
      WindowToggleSubscriber.prototype._complete = function () {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_2 = contexts[index];
                  context_2.window.complete();
                  context_2.subscription.unsubscribe();
              }
          }
          _super.prototype._complete.call(this);
      };
      WindowToggleSubscriber.prototype._unsubscribe = function () {
          var contexts = this.contexts;
          this.contexts = null;
          if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                  var context_3 = contexts[index];
                  context_3.window.unsubscribe();
                  context_3.subscription.unsubscribe();
              }
          }
      };
      WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          if (outerValue === this.openings) {
              var closingSelector = this.closingSelector;
              var closingNotifier = tryCatch(closingSelector)(innerValue);
              if (closingNotifier === errorObject) {
                  return this.error(errorObject.e);
              }
              else {
                  var window_1 = new Subject();
                  var subscription = new Subscription();
                  var context_4 = { window: window_1, subscription: subscription };
                  this.contexts.push(context_4);
                  var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
                  if (innerSubscription.closed) {
                      this.closeWindow(this.contexts.length - 1);
                  }
                  else {
                      innerSubscription.context = context_4;
                      subscription.add(innerSubscription);
                  }
                  this.destination.next(window_1);
              }
          }
          else {
              this.closeWindow(this.contexts.indexOf(outerValue));
          }
      };
      WindowToggleSubscriber.prototype.notifyError = function (err) {
          this.error(err);
      };
      WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
          if (inner !== this.openSubscription) {
              this.closeWindow(this.contexts.indexOf(inner.context));
          }
      };
      WindowToggleSubscriber.prototype.closeWindow = function (index) {
          if (index === -1) {
              return;
          }
          var contexts = this.contexts;
          var context = contexts[index];
          var window = context.window, subscription = context.subscription;
          contexts.splice(index, 1);
          window.complete();
          subscription.unsubscribe();
      };
      return WindowToggleSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=windowToggle.js.map

  /** PURE_IMPORTS_START tslib,_Subject,_util_tryCatch,_util_errorObject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WindowSubscriber$1 = /*@__PURE__*/ (function (_super) {
      __extends(WindowSubscriber, _super);
      function WindowSubscriber(destination, closingSelector) {
          var _this = _super.call(this, destination) || this;
          _this.destination = destination;
          _this.closingSelector = closingSelector;
          _this.openWindow();
          return _this;
      }
      WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.openWindow(innerSub);
      };
      WindowSubscriber.prototype.notifyError = function (error, innerSub) {
          this._error(error);
      };
      WindowSubscriber.prototype.notifyComplete = function (innerSub) {
          this.openWindow(innerSub);
      };
      WindowSubscriber.prototype._next = function (value) {
          this.window.next(value);
      };
      WindowSubscriber.prototype._error = function (err) {
          this.window.error(err);
          this.destination.error(err);
          this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype._complete = function () {
          this.window.complete();
          this.destination.complete();
          this.unsubscribeClosingNotification();
      };
      WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
          if (this.closingNotification) {
              this.closingNotification.unsubscribe();
          }
      };
      WindowSubscriber.prototype.openWindow = function (innerSub) {
          if (innerSub === void 0) {
              innerSub = null;
          }
          if (innerSub) {
              this.remove(innerSub);
              innerSub.unsubscribe();
          }
          var prevWindow = this.window;
          if (prevWindow) {
              prevWindow.complete();
          }
          var window = this.window = new Subject();
          this.destination.next(window);
          var closingNotifier = tryCatch(this.closingSelector)();
          if (closingNotifier === errorObject) {
              var err = errorObject.e;
              this.destination.error(err);
              this.window.error(err);
          }
          else {
              this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
          }
      };
      return WindowSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=windowWhen.js.map

  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
  var WithLatestFromSubscriber = /*@__PURE__*/ (function (_super) {
      __extends(WithLatestFromSubscriber, _super);
      function WithLatestFromSubscriber(destination, observables, project) {
          var _this = _super.call(this, destination) || this;
          _this.observables = observables;
          _this.project = project;
          _this.toRespond = [];
          var len = observables.length;
          _this.values = new Array(len);
          for (var i = 0; i < len; i++) {
              _this.toRespond.push(i);
          }
          for (var i = 0; i < len; i++) {
              var observable = observables[i];
              _this.add(subscribeToResult(_this, observable, observable, i));
          }
          return _this;
      }
      WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
          this.values[outerIndex] = innerValue;
          var toRespond = this.toRespond;
          if (toRespond.length > 0) {
              var found = toRespond.indexOf(outerIndex);
              if (found !== -1) {
                  toRespond.splice(found, 1);
              }
          }
      };
      WithLatestFromSubscriber.prototype.notifyComplete = function () {
      };
      WithLatestFromSubscriber.prototype._next = function (value) {
          if (this.toRespond.length === 0) {
              var args = [value].concat(this.values);
              if (this.project) {
                  this._tryProject(args);
              }
              else {
                  this.destination.next(args);
              }
          }
      };
      WithLatestFromSubscriber.prototype._tryProject = function (args) {
          var result;
          try {
              result = this.project.apply(this, args);
          }
          catch (err) {
              this.destination.error(err);
              return;
          }
          this.destination.next(result);
      };
      return WithLatestFromSubscriber;
  }(OuterSubscriber));
  //# sourceMappingURL=withLatestFrom.js.map

  /** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */
  //# sourceMappingURL=zip.js.map

  /** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */
  //# sourceMappingURL=zipAll.js.map

  /** PURE_IMPORTS_START  PURE_IMPORTS_END */
  //# sourceMappingURL=index.js.map

  var rxStore$1 = {
    dataMap: {},
    pushHeadersMap: {}
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var noop_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  function noop() { }
  exports.noop = noop;
  //# sourceMappingURL=noop.js.map
  });

  unwrapExports(noop_1);
  var noop_2 = noop_1.noop;

  var pipe_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });

  function pipe() {
      var fns = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          fns[_i] = arguments[_i];
      }
      return pipeFromArray(fns);
  }
  exports.pipe = pipe;
  function pipeFromArray(fns) {
      if (!fns) {
          return noop_1.noop;
      }
      if (fns.length === 1) {
          return fns[0];
      }
      return function piped(input) {
          return fns.reduce(function (prev, fn) { return fn(prev); }, input);
      };
  }
  exports.pipeFromArray = pipeFromArray;
  //# sourceMappingURL=pipe.js.map
  });

  unwrapExports(pipe_1);
  var pipe_2 = pipe_1.pipe;
  var pipe_3 = pipe_1.pipeFromArray;

  var md5 = createCommonjsModule(function (module) {
  /**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.7.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2017
   * @license MIT
   */
  (function () {

    var ERROR = 'input is invalid type';
    var WINDOW = typeof window === 'object';
    var root = WINDOW ? window : {};
    if (root.JS_MD5_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
      root = commonjsGlobal;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && 'object' === 'object' && module.exports;
    var AMD = typeof undefined === 'function' && undefined.amd;
    var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [128, 32768, 8388608, -2147483648];
    var SHIFT = [0, 8, 16, 24];
    var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

    var blocks = [], buffer8;
    if (ARRAY_BUFFER) {
      var buffer = new ArrayBuffer(68);
      buffer8 = new Uint8Array(buffer);
      blocks = new Uint32Array(buffer);
    }

    if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }

    if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }

    /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method digest
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.digest('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method array
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.array('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method arrayBuffer
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.buffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method base64
     * @memberof md5
     * @description Output hash as base64 string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} base64 string
     * @example
     * md5.base64('The quick brown fox jumps over the lazy dog');
     */
    var createOutputMethod = function (outputType) {
      return function (message) {
        return new Md5(true).update(message)[outputType]();
      };
    };

    /**
     * @method create
     * @memberof md5
     * @description Create Md5 object
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.create();
     */
    /**
     * @method update
     * @memberof md5
     * @description Create and update Md5 object
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.update('The quick brown fox jumps over the lazy dog');
     * // equal to
     * var hash = md5.create();
     * hash.update('The quick brown fox jumps over the lazy dog');
     */
    var createMethod = function () {
      var method = createOutputMethod('hex');
      if (NODE_JS) {
        method = nodeWrap(method);
      }
      method.create = function () {
        return new Md5();
      };
      method.update = function (message) {
        return method.create().update(message);
      };
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createOutputMethod(type);
      }
      return method;
    };

    var nodeWrap = function (method) {
      var crypto = eval("require('crypto')");
      var Buffer = eval("require('buffer').Buffer");
      var nodeMethod = function (message) {
        if (typeof message === 'string') {
          return crypto.createHash('md5').update(message, 'utf8').digest('hex');
        } else {
          if (message === null || message === undefined) {
            throw ERROR;
          } else if (message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          }
        }
        if (Array.isArray(message) || ArrayBuffer.isView(message) ||
          message.constructor === Buffer) {
          return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
        } else {
          return method(message);
        }
      };
      return nodeMethod;
    };

    /**
     * Md5 class
     * @class Md5
     * @description This is internal class.
     * @see {@link md5.create}
     */
    function Md5(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          var buffer = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer);
          this.blocks = new Uint32Array(buffer);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
      this.first = true;
    }

    /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
    Md5.prototype.update = function (message) {
      if (this.finalized) {
        return;
      }

      var notString, type = typeof message;
      if (type !== 'string') {
        if (type === 'object') {
          if (message === null) {
            throw ERROR;
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw ERROR;
            }
          }
        } else {
          throw ERROR;
        }
        notString = true;
      }
      var code, index = 0, i, length = message.length, blocks = this.blocks;
      var buffer8 = this.buffer8;

      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks[0] = blocks[16];
          blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }

        if (notString) {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              buffer8[i++] = message[index];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                buffer8[i++] = code;
              } else if (code < 0x800) {
                buffer8[i++] = 0xc0 | (code >> 6);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else if (code < 0xd800 || code >= 0xe000) {
                buffer8[i++] = 0xe0 | (code >> 12);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                buffer8[i++] = 0xf0 | (code >> 18);
                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              }
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                blocks[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 0x800) {
                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else if (code < 0xd800 || code >= 0xe000) {
                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              }
            }
          }
        }
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 64) {
          this.start = i - 64;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };

    Md5.prototype.finalize = function () {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i = this.lastByteIndex;
      blocks[i >> 2] |= EXTRA[i & 3];
      if (i >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }
      blocks[14] = this.bytes << 3;
      blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    };

    Md5.prototype.hash = function () {
      var a, b, c, d, bc, da, blocks = this.blocks;

      if (this.first) {
        a = blocks[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = this.h0;
        b = this.h1;
        c = this.h2;
        d = this.h3;
        a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }

      a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[9] - 343485551;
      b = (b << 21 | b >>> 11) + c << 0;

      if (this.first) {
        this.h0 = a + 1732584193 << 0;
        this.h1 = b - 271733879 << 0;
        this.h2 = c - 1732584194 << 0;
        this.h3 = d + 271733878 << 0;
        this.first = false;
      } else {
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
      }
    };

    /**
     * @method hex
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.hex();
     */
    Md5.prototype.hex = function () {
      this.finalize();

      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;

      return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
        HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
        HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
        HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
        HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
        HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
        HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
        HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
        HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
        HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
        HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
        HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
        HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
        HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
        HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
        HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
    };

    /**
     * @method toString
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.toString();
     */
    Md5.prototype.toString = Md5.prototype.hex;

    /**
     * @method digest
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.digest}
     * @example
     * hash.digest();
     */
    Md5.prototype.digest = function () {
      this.finalize();

      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
        h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
        h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
        h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
      ];
    };

    /**
     * @method array
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.array}
     * @example
     * hash.array();
     */
    Md5.prototype.array = Md5.prototype.digest;

    /**
     * @method arrayBuffer
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.arrayBuffer}
     * @example
     * hash.arrayBuffer();
     */
    Md5.prototype.arrayBuffer = function () {
      this.finalize();

      var buffer = new ArrayBuffer(16);
      var blocks = new Uint32Array(buffer);
      blocks[0] = this.h0;
      blocks[1] = this.h1;
      blocks[2] = this.h2;
      blocks[3] = this.h3;
      return buffer;
    };

    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.buffer}
     * @example
     * hash.buffer();
     */
    Md5.prototype.buffer = Md5.prototype.arrayBuffer;

    /**
     * @method base64
     * @memberof Md5
     * @instance
     * @description Output hash as base64 string
     * @returns {String} base64 string
     * @see {@link md5.base64}
     * @example
     * hash.base64();
     */
    Md5.prototype.base64 = function () {
      var v1, v2, v3, base64Str = '', bytes = this.array();
      for (var i = 0; i < 15;) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
          BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
          BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
          BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
        BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
        '==';
      return base64Str;
    };

    var exports = createMethod();

    if (COMMON_JS) {
      module.exports = exports;
    } else {
      /**
       * @method md5
       * @description Md5 hash function, export to global in browsers.
       * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
       * @returns {String} md5 hashes
       * @example
       * md5(''); // d41d8cd98f00b204e9800998ecf8427e
       * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
       * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
       *
       * // It also supports UTF-8 encoding
       * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
       *
       * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
       * md5([]); // d41d8cd98f00b204e9800998ecf8427e
       * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
       */
      root.md5 = exports;
      if (AMD) {
        undefined(function () {
          return exports;
        });
      }
    }
  })();
  });

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.1' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var _isObject$1 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject$1(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document$1 = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject$1(document$1) && _isObject$1(document$1.createElement);
  var _domCreate = function (it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject$1(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject$1(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject$1(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject$1(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var IS_WRAP = type & $export.W;
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE];
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
    var key, own, out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      if (own && _has(exports, key)) continue;
      // export native or passed
      out = own ? target[key] : source[key];
      // prevent global pollution for namespaces
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
      // bind timers to global for call from export context
      : IS_BIND && own ? _ctx(out, _global)
      // wrap global constructors for prevent change them in library
      : IS_WRAP && target[key] == out ? (function (C) {
        var F = function (a, b, c) {
          if (this instanceof C) {
            switch (arguments.length) {
              case 0: return new C();
              case 1: return new C(a);
              case 2: return new C(a, b);
            } return new C(a, b, c);
          } return C.apply(this, arguments);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      // make static versions for prototype methods
      })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
      if (IS_PROTO) {
        (exports.virtual || (exports.virtual = {}))[key] = out;
        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
        if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
      }
    }
  };
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  var toString$1 = {}.toString;

  var _cof = function (it) {
    return toString$1.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.1.15 ToLength

  var min$1 = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min$1(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max$1 = Math.max;
  var min$2 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max$1(index + length, 0) : min$2(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var _library = true;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: _library ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var f$1 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$1
  };

  var f$2 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$2
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  // 19.1.2.1 Object.assign(target, source, ...)





  var $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  var _objectAssign = !$assign || _fails(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) { B[k] = k; });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
    var T = _toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = _objectGops.f;
    var isEnum = _objectPie.f;
    while (aLen > index) {
      var S = _iobject(arguments[index++]);
      var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    } return T;
  } : $assign;

  // 19.1.3.1 Object.assign(target, source)


  _export(_export.S + _export.F, 'Object', { assign: _objectAssign });

  var assign = _core.Object.assign;

  var assign$1 = createCommonjsModule(function (module) {
  module.exports = { "default": assign, __esModule: true };
  });

  unwrapExports(assign$1);

  var _extends = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _assign2 = _interopRequireDefault(assign$1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = _assign2.default || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  });

  var _extends$1 = unwrapExports(_extends);

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var _redefine = _hide;

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var document$2 = _global.document;
  var _html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  var def = _objectDp.f;

  var TAG = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine(proto, key, methods[key]);
      } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  var $at = _stringAt(true);

  // 21.1.3.27 String.prototype[@@iterator]()
  _iterDefine(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0;                // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') return _iterStep(0, index);
    if (kind == 'values') return _iterStep(0, O[index]);
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  var TO_STRING_TAG = _wks('toStringTag');

  var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
    'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
    'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
    'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
    'TextTrackList,TouchList').split(',');

  for (var i = 0; i < DOMIterables.length; i++) {
    var NAME = DOMIterables[i];
    var Collection = _global[NAME];
    var proto = Collection && Collection.prototype;
    if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  }

  var f$3 = _wks;

  var _wksExt = {
  	f: f$3
  };

  var iterator$1 = _wksExt.f('iterator');

  var iterator$2 = createCommonjsModule(function (module) {
  module.exports = { "default": iterator$1, __esModule: true };
  });

  unwrapExports(iterator$2);

  var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');


  var setDesc = _objectDp.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var defineProperty = _objectDp.f;
  var _wksDefine = function (name) {
    var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
  };

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = _objectKeys(it);
    var getSymbols = _objectGops.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = _objectPie.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return _cof(arg) == 'Array';
  };

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

  var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return _objectKeysInternal(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$4
  };

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN = _objectGopn.f;
  var toString$2 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$5 = function getOwnPropertyNames(it) {
    return windowNames && toString$2.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
  };

  var _objectGopnExt = {
  	f: f$5
  };

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = _toIobject(O);
    P = _toPrimitive(P, true);
    if (_ie8DomDefine) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$6
  };

  // ECMAScript 6 symbols shim





  var META = _meta.KEY;



















  var gOPD$1 = _objectGopd.f;
  var dP$1 = _objectDp.f;
  var gOPN$1 = _objectGopnExt.f;
  var $Symbol = _global.Symbol;
  var $JSON = _global.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = _wks('_hidden');
  var TO_PRIMITIVE = _wks('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = _shared('symbol-registry');
  var AllSymbols = _shared('symbols');
  var OPSymbols = _shared('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function';
  var QObject = _global.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = _descriptors && _fails(function () {
    return _objectCreate(dP$1({}, 'a', {
      get: function () { return dP$1(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$1(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
  } : dP$1;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    _anObject(it);
    key = _toPrimitive(key, true);
    _anObject(D);
    if (_has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$1(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    _anObject(it);
    var keys = _enumKeys(P = _toIobject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create(it, P) {
    return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = _toPrimitive(key, true));
    if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
    return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = _toIobject(it);
    key = _toPrimitive(key, true);
    if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$1(_toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, _propertyDesc(1, value));
      };
      if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    _objectGopd.f = $getOwnPropertyDescriptor;
    _objectDp.f = $defineProperty;
    _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
    _objectPie.f = $propertyIsEnumerable;
    _objectGops.f = $getOwnPropertySymbols;

    if (_descriptors && !_library) {
      _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    _wksExt.f = function (name) {
      return wrap(_wks(name));
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

  for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

  _export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return _has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  _export(_export.S + _export.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!_isObject$1(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!_isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  _setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  _setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  _setToStringTag(_global.JSON, 'JSON', true);

  _wksDefine('asyncIterator');

  _wksDefine('observable');

  var symbol = _core.Symbol;

  var symbol$1 = createCommonjsModule(function (module) {
  module.exports = { "default": symbol, __esModule: true };
  });

  unwrapExports(symbol$1);

  var _typeof_1 = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _iterator2 = _interopRequireDefault(iterator$2);



  var _symbol2 = _interopRequireDefault(symbol$1);

  var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof(obj);
  } : function (obj) {
    return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
  };
  });

  var _typeof = unwrapExports(_typeof_1);

  var formatRegExp = /%[sdj%]/g;

  var warning = function warning() {};

  // don't print warning message when in production env or node runtime
  if ("development" !== 'production' && typeof window !== 'undefined' && typeof document !== 'undefined') {
    warning = function warning(type, errors) {
      if (typeof console !== 'undefined' && console.warn) {
        if (errors.every(function (e) {
          return typeof e === 'string';
        })) {
          console.warn(type, errors);
        }
      }
    };
  }

  function format() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var i = 1;
    var f = args[0];
    var len = args.length;
    if (typeof f === 'function') {
      return f.apply(null, args.slice(1));
    }
    if (typeof f === 'string') {
      var str = String(f).replace(formatRegExp, function (x) {
        if (x === '%%') {
          return '%';
        }
        if (i >= len) {
          return x;
        }
        switch (x) {
          case '%s':
            return String(args[i++]);
          case '%d':
            return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
            break;
          default:
            return x;
        }
      });
      for (var arg = args[i]; i < len; arg = args[++i]) {
        str += ' ' + arg;
      }
      return str;
    }
    return f;
  }

  function isNativeStringType(type) {
    return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern';
  }

  function isEmptyValue(value, type) {
    if (value === undefined || value === null) {
      return true;
    }
    if (type === 'array' && Array.isArray(value) && !value.length) {
      return true;
    }
    if (isNativeStringType(type) && typeof value === 'string' && !value) {
      return true;
    }
    return false;
  }

  function asyncParallelArray(arr, func, callback) {
    var results = [];
    var total = 0;
    var arrLength = arr.length;

    function count(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === arrLength) {
        callback(results);
      }
    }

    arr.forEach(function (a) {
      func(a, count);
    });
  }

  function asyncSerialArray(arr, func, callback) {
    var index = 0;
    var arrLength = arr.length;

    function next(errors) {
      if (errors && errors.length) {
        callback(errors);
        return;
      }
      var original = index;
      index = index + 1;
      if (original < arrLength) {
        func(arr[original], next);
      } else {
        callback([]);
      }
    }

    next([]);
  }

  function flattenObjArr(objArr) {
    var ret = [];
    Object.keys(objArr).forEach(function (k) {
      ret.push.apply(ret, objArr[k]);
    });
    return ret;
  }

  function asyncMap(objArr, option, func, callback) {
    if (option.first) {
      var flattenArr = flattenObjArr(objArr);
      return asyncSerialArray(flattenArr, func, callback);
    }
    var firstFields = option.firstFields || [];
    if (firstFields === true) {
      firstFields = Object.keys(objArr);
    }
    var objArrKeys = Object.keys(objArr);
    var objArrLength = objArrKeys.length;
    var total = 0;
    var results = [];
    var next = function next(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
      }
    };
    objArrKeys.forEach(function (key) {
      var arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  }

  function complementError(rule) {
    return function (oe) {
      if (oe && oe.message) {
        oe.field = oe.field || rule.fullField;
        return oe;
      }
      return {
        message: oe,
        field: oe.field || rule.fullField
      };
    };
  }

  function deepMerge(target, source) {
    if (source) {
      for (var s in source) {
        if (source.hasOwnProperty(s)) {
          var value = source[s];
          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _typeof(target[s]) === 'object') {
            target[s] = _extends$1({}, target[s], value);
          } else {
            target[s] = value;
          }
        }
      }
    }
    return target;
  }

  /**
   *  Rule for validating required fields.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function required(rule, value, source, errors, options, type) {
    if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) {
      errors.push(format(options.messages.required, rule.fullField));
    }
  }

  /**
   *  Rule for validating whitespace.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function whitespace(rule, value, source, errors, options) {
    if (/^\s+$/.test(value) || value === '') {
      errors.push(format(options.messages.whitespace, rule.fullField));
    }
  }

  /* eslint max-len:0 */

  var pattern = {
    // http://emailregex.com/
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
    hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
  };

  var types = {
    integer: function integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    float: function float(value) {
      return types.number(value) && !types.integer(value);
    },
    array: function array(value) {
      return Array.isArray(value);
    },
    regexp: function regexp(value) {
      if (value instanceof RegExp) {
        return true;
      }
      try {
        return !!new RegExp(value);
      } catch (e) {
        return false;
      }
    },
    date: function date(value) {
      return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
    },
    number: function number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === 'number';
    },
    object: function object(value) {
      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !types.array(value);
    },
    method: function method(value) {
      return typeof value === 'function';
    },
    email: function email(value) {
      return typeof value === 'string' && !!value.match(pattern.email) && value.length < 255;
    },
    url: function url(value) {
      return typeof value === 'string' && !!value.match(pattern.url);
    },
    hex: function hex(value) {
      return typeof value === 'string' && !!value.match(pattern.hex);
    }
  };

  /**
   *  Rule for validating the type of a value.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function type(rule, value, source, errors, options) {
    if (rule.required && value === undefined) {
      required(rule, value, source, errors, options);
      return;
    }
    var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) > -1) {
      if (!types[ruleType](value)) {
        errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
      }
      // straight typeof check
    } else if (ruleType && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== rule.type) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
  }

  /**
   *  Rule for validating minimum and maximum allowed values.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function range$1(rule, value, source, errors, options) {
    var len = typeof rule.len === 'number';
    var min = typeof rule.min === 'number';
    var max = typeof rule.max === 'number';
    // 正则匹配码点范围从U+010000一直到U+10FFFF的文字（补充平面Supplementary Plane）
    var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var val = value;
    var key = null;
    var num = typeof value === 'number';
    var str = typeof value === 'string';
    var arr = Array.isArray(value);
    if (num) {
      key = 'number';
    } else if (str) {
      key = 'string';
    } else if (arr) {
      key = 'array';
    }
    // if the value is not of a supported type for range validation
    // the validation rule rule should use the
    // type property to also test for a particular type
    if (!key) {
      return false;
    }
    if (arr) {
      val = value.length;
    }
    if (str) {
      // 处理码点大于U+010000的文字length属性不准确的bug，如"𠮷𠮷𠮷".lenght !== 3
      val = value.replace(spRegexp, '_').length;
    }
    if (len) {
      if (val !== rule.len) {
        errors.push(format(options.messages[key].len, rule.fullField, rule.len));
      }
    } else if (min && !max && val < rule.min) {
      errors.push(format(options.messages[key].min, rule.fullField, rule.min));
    } else if (max && !min && val > rule.max) {
      errors.push(format(options.messages[key].max, rule.fullField, rule.max));
    } else if (min && max && (val < rule.min || val > rule.max)) {
      errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
    }
  }

  var ENUM = 'enum';

  /**
   *  Rule for validating a value exists in an enumerable list.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function enumerable(rule, value, source, errors, options) {
    rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
    if (rule[ENUM].indexOf(value) === -1) {
      errors.push(format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
    }
  }

  /**
   *  Rule for validating a regular expression pattern.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param source The source object being validated.
   *  @param errors An array of errors that this rule may add
   *  validation errors to.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function pattern$1(rule, value, source, errors, options) {
    if (rule.pattern) {
      if (rule.pattern instanceof RegExp) {
        // if a RegExp instance is passed, reset `lastIndex` in case its `global`
        // flag is accidentally set to `true`, which in a validation scenario
        // is not necessary and the result might be misleading
        rule.pattern.lastIndex = 0;
        if (!rule.pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      } else if (typeof rule.pattern === 'string') {
        var _pattern = new RegExp(rule.pattern);
        if (!_pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      }
    }
  }

  var rules = {
    required: required,
    whitespace: whitespace,
    type: type,
    range: range$1,
    'enum': enumerable,
    pattern: pattern$1
  };

  /**
   *  Performs validation for string types.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function string(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'string');
      if (!isEmptyValue(value, 'string')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
        rules.pattern(rule, value, source, errors, options);
        if (rule.whitespace === true) {
          rules.whitespace(rule, value, source, errors, options);
        }
      }
    }
    callback(errors);
  }

  /**
   *  Validates a function.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function method(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates a number.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function number(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates a boolean.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function boolean(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates the regular expression type.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function regexp(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates a number is an integer.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function integer(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates a number is a floating point number.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function floatFn(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates an array.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function array(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, 'array') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, 'array');
      if (!isEmptyValue(value, 'array')) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates an object.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function object(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== undefined) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  var ENUM$1 = 'enum';

  /**
   *  Validates an enumerable list.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function enumerable$1(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value) {
        rules[ENUM$1](rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  /**
   *  Validates a regular expression pattern.
   *
   *  Performs validation when a rule only contains
   *  a pattern property but is not declared as a string type.
   *
   *  @param rule The validation rule.
   *  @param value The value of the field on the source object.
   *  @param callback The callback function.
   *  @param source The source object being validated.
   *  @param options The validation options.
   *  @param options.messages The validation messages.
   */
  function pattern$2(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, 'string') && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, 'string')) {
        rules.pattern(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  function date(rule, value, callback, source, options) {
    // console.log('integer rule called %j', rule);
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    // console.log('validate on %s value', value);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        var dateObject = void 0;

        if (typeof value === 'number') {
          dateObject = new Date(value);
        } else {
          dateObject = value;
        }

        rules.type(rule, dateObject, source, errors, options);
        if (dateObject) {
          rules.range(rule, dateObject.getTime(), source, errors, options);
        }
      }
    }
    callback(errors);
  }

  function required$1(rule, value, callback, source, options) {
    var errors = [];
    var type = Array.isArray(value) ? 'array' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
    rules.required(rule, value, source, errors, options, type);
    callback(errors);
  }

  function type$1(rule, value, callback, source, options) {
    var ruleType = rule.type;
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, ruleType) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, ruleType);
      if (!isEmptyValue(value, ruleType)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  }

  var validators = {
    string: string,
    method: method,
    number: number,
    boolean: boolean,
    regexp: regexp,
    integer: integer,
    float: floatFn,
    array: array,
    object: object,
    'enum': enumerable$1,
    pattern: pattern$2,
    date: date,
    url: type$1,
    hex: type$1,
    email: type$1,
    required: required$1
  };

  function newMessages() {
    return {
      'default': 'Validation error on field %s',
      required: '%s is required',
      'enum': '%s must be one of %s',
      whitespace: '%s cannot be empty',
      date: {
        format: '%s date %s is invalid for format %s',
        parse: '%s date could not be parsed, %s is invalid ',
        invalid: '%s date %s is invalid'
      },
      types: {
        string: '%s is not a %s',
        method: '%s is not a %s (function)',
        array: '%s is not an %s',
        object: '%s is not an %s',
        number: '%s is not a %s',
        date: '%s is not a %s',
        boolean: '%s is not a %s',
        integer: '%s is not an %s',
        float: '%s is not a %s',
        regexp: '%s is not a valid %s',
        email: '%s is not a valid %s',
        url: '%s is not a valid %s',
        hex: '%s is not a valid %s'
      },
      string: {
        len: '%s must be exactly %s characters',
        min: '%s must be at least %s characters',
        max: '%s cannot be longer than %s characters',
        range: '%s must be between %s and %s characters'
      },
      number: {
        len: '%s must equal %s',
        min: '%s cannot be less than %s',
        max: '%s cannot be greater than %s',
        range: '%s must be between %s and %s'
      },
      array: {
        len: '%s must be exactly %s in length',
        min: '%s cannot be less than %s in length',
        max: '%s cannot be greater than %s in length',
        range: '%s must be between %s and %s in length'
      },
      pattern: {
        mismatch: '%s value %s does not match pattern %s'
      },
      clone: function clone() {
        var cloned = JSON.parse(JSON.stringify(this));
        cloned.clone = this.clone;
        return cloned;
      }
    };
  }

  var messages = newMessages();

  /**
   *  Encapsulates a validation schema.
   *
   *  @param descriptor An object declaring validation rules
   *  for this schema.
   */
  function Schema(descriptor) {
    this.rules = null;
    this._messages = messages;
    this.define(descriptor);
  }

  Schema.prototype = {
    messages: function messages$$1(_messages) {
      if (_messages) {
        this._messages = deepMerge(newMessages(), _messages);
      }
      return this._messages;
    },
    define: function define(rules) {
      if (!rules) {
        throw new Error('Cannot configure a schema with no rules');
      }
      if ((typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) !== 'object' || Array.isArray(rules)) {
        throw new Error('Rules must be an object');
      }
      this.rules = {};
      var z = void 0;
      var item = void 0;
      for (z in rules) {
        if (rules.hasOwnProperty(z)) {
          item = rules[z];
          this.rules[z] = Array.isArray(item) ? item : [item];
        }
      }
    },
    validate: function validate(source_) {
      var _this = this;

      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oc = arguments[2];

      var source = source_;
      var options = o;
      var callback = oc;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      function complete(results) {
        var i = void 0;
        var field = void 0;
        var errors = [];
        var fields = {};

        function add(e) {
          if (Array.isArray(e)) {
            errors = errors.concat.apply(errors, e);
          } else {
            errors.push(e);
          }
        }

        for (i = 0; i < results.length; i++) {
          add(results[i]);
        }
        if (!errors.length) {
          errors = null;
          fields = null;
        } else {
          for (i = 0; i < errors.length; i++) {
            field = errors[i].field;
            fields[field] = fields[field] || [];
            fields[field].push(errors[i]);
          }
        }
        callback(errors, fields);
      }

      if (options.messages) {
        var messages$$1 = this.messages();
        if (messages$$1 === messages) {
          messages$$1 = newMessages();
        }
        deepMerge(messages$$1, options.messages);
        options.messages = messages$$1;
      } else {
        options.messages = this.messages();
      }
      var arr = void 0;
      var value = void 0;
      var series = {};
      var keys = options.keys || Object.keys(this.rules);
      keys.forEach(function (z) {
        arr = _this.rules[z];
        value = source[z];
        arr.forEach(function (r) {
          var rule = r;
          if (typeof rule.transform === 'function') {
            if (source === source_) {
              source = _extends$1({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (typeof rule === 'function') {
            rule = {
              validator: rule
            };
          } else {
            rule = _extends$1({}, rule);
          }
          rule.validator = _this.getValidationMethod(rule);
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = _this.getType(rule);
          if (!rule.validator) {
            return;
          }
          series[z] = series[z] || [];
          series[z].push({
            rule: rule,
            value: value,
            source: source,
            field: z
          });
        });
      });
      var errorFields = {};
      asyncMap(series, options, function (data, doIt) {
        var rule = data.rule;
        var deep = (rule.type === 'object' || rule.type === 'array') && (_typeof(rule.fields) === 'object' || _typeof(rule.defaultField) === 'object');
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullfield(key, schema) {
          return _extends$1({}, schema, {
            fullField: rule.fullField + '.' + key
          });
        }

        function cb() {
          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

          var errors = e;
          if (!Array.isArray(errors)) {
            errors = [errors];
          }
          if (errors.length) {
            Schema.warning('async-validator:', errors);
          }
          if (errors.length && rule.message) {
            errors = [].concat(rule.message);
          }

          errors = errors.map(complementError(rule));

          if (options.first && errors.length) {
            errorFields[rule.field] = 1;
            return doIt(errors);
          }
          if (!deep) {
            doIt(errors);
          } else {
            // if rule is required but the target object
            // does not exist fail at the rule level and don't
            // go deeper
            if (rule.required && !data.value) {
              if (rule.message) {
                errors = [].concat(rule.message).map(complementError(rule));
              } else if (options.error) {
                errors = [options.error(rule, format(options.messages.required, rule.field))];
              } else {
                errors = [];
              }
              return doIt(errors);
            }

            var fieldsSchema = {};
            if (rule.defaultField) {
              for (var k in data.value) {
                if (data.value.hasOwnProperty(k)) {
                  fieldsSchema[k] = rule.defaultField;
                }
              }
            }
            fieldsSchema = _extends$1({}, fieldsSchema, data.rule.fields);
            for (var f in fieldsSchema) {
              if (fieldsSchema.hasOwnProperty(f)) {
                var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
                fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
              }
            }
            var schema = new Schema(fieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function (errs) {
              doIt(errs && errs.length ? errors.concat(errs) : errs);
            });
          }
        }

        var res = rule.validator(rule, data.value, cb, data.source, options);
        if (res && res.then) {
          res.then(function () {
            return cb();
          }, function (e) {
            return cb(e);
          });
        }
      }, function (results) {
        complete(results);
      });
    },
    getType: function getType(rule) {
      if (rule.type === undefined && rule.pattern instanceof RegExp) {
        rule.type = 'pattern';
      }
      if (typeof rule.validator !== 'function' && rule.type && !validators.hasOwnProperty(rule.type)) {
        throw new Error(format('Unknown rule type %s', rule.type));
      }
      return rule.type || 'string';
    },
    getValidationMethod: function getValidationMethod(rule) {
      if (typeof rule.validator === 'function') {
        return rule.validator;
      }
      var keys = Object.keys(rule);
      var messageIndex = keys.indexOf('message');
      if (messageIndex !== -1) {
        keys.splice(messageIndex, 1);
      }
      if (keys.length === 1 && keys[0] === 'required') {
        return validators.required;
      }
      return validators[this.getType(rule)] || false;
    }
  };

  Schema.register = function register(type, validator) {
    if (typeof validator !== 'function') {
      throw new Error('Cannot register a validator by type, validator is not a function');
    }
    validators[type] = validator;
  };

  Schema.warning = warning;

  Schema.messages = messages;

  var classCallCheck = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;

  exports.default = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  });

  var _classCallCheck = unwrapExports(classCallCheck);

  var _isObject$2 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject$1 = function (it) {
    if (!_isObject$2(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _fails$1 = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors$1 = !_fails$1(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var _global$1 = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var document$3 = _global$1.document;
  // typeof document.createElement is 'object' in old IE
  var is$1 = _isObject$2(document$3) && _isObject$2(document$3.createElement);
  var _domCreate$1 = function (it) {
    return is$1 ? document$3.createElement(it) : {};
  };

  var _ie8DomDefine$1 = !_descriptors$1 && !_fails$1(function () {
    return Object.defineProperty(_domCreate$1('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive$1 = function (it, S) {
    if (!_isObject$2(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !_isObject$2(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var dP$2 = Object.defineProperty;

  var f$7 = _descriptors$1 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject$1(O);
    P = _toPrimitive$1(P, true);
    _anObject$1(Attributes);
    if (_ie8DomDefine$1) try {
      return dP$2(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp$1 = {
  	f: f$7
  };

  var dP$3 = _objectDp$1.f;
  var FProto = Function.prototype;
  var nameRE = /^\s*function ([^ (]*)/;
  var NAME$1 = 'name';

  // 19.2.4.2 name
  NAME$1 in FProto || _descriptors$1 && dP$3(FProto, NAME$1, {
    configurable: true,
    get: function () {
      try {
        return ('' + this).match(nameRE)[1];
      } catch (e) {
        return '';
      }
    }
  });

  var core = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory();
  	}
  }(commonjsGlobal, function () {

  	/**
  	 * CryptoJS core components.
  	 */
  	var CryptoJS = CryptoJS || (function (Math, undefined) {
  	    /*
  	     * Local polyfil of Object.create
  	     */
  	    var create = Object.create || (function () {
  	        function F() {}
  	        return function (obj) {
  	            var subtype;

  	            F.prototype = obj;

  	            subtype = new F();

  	            F.prototype = null;

  	            return subtype;
  	        };
  	    }());

  	    /**
  	     * CryptoJS namespace.
  	     */
  	    var C = {};

  	    /**
  	     * Library namespace.
  	     */
  	    var C_lib = C.lib = {};

  	    /**
  	     * Base object for prototypal inheritance.
  	     */
  	    var Base = C_lib.Base = (function () {


  	        return {
  	            /**
  	             * Creates a new object that inherits from this object.
  	             *
  	             * @param {Object} overrides Properties to copy into the new object.
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         field: 'value',
  	             *
  	             *         method: function () {
  	             *         }
  	             *     });
  	             */
  	            extend: function (overrides) {
  	                // Spawn
  	                var subtype = create(this);

  	                // Augment
  	                if (overrides) {
  	                    subtype.mixIn(overrides);
  	                }

  	                // Create default initializer
  	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
  	                    subtype.init = function () {
  	                        subtype.$super.init.apply(this, arguments);
  	                    };
  	                }

  	                // Initializer's prototype is the subtype object
  	                subtype.init.prototype = subtype;

  	                // Reference supertype
  	                subtype.$super = this;

  	                return subtype;
  	            },

  	            /**
  	             * Extends this object and runs the init method.
  	             * Arguments to create() will be passed to init().
  	             *
  	             * @return {Object} The new object.
  	             *
  	             * @static
  	             *
  	             * @example
  	             *
  	             *     var instance = MyType.create();
  	             */
  	            create: function () {
  	                var instance = this.extend();
  	                instance.init.apply(instance, arguments);

  	                return instance;
  	            },

  	            /**
  	             * Initializes a newly created object.
  	             * Override this method to add some logic when your objects are created.
  	             *
  	             * @example
  	             *
  	             *     var MyType = CryptoJS.lib.Base.extend({
  	             *         init: function () {
  	             *             // ...
  	             *         }
  	             *     });
  	             */
  	            init: function () {
  	            },

  	            /**
  	             * Copies properties into this object.
  	             *
  	             * @param {Object} properties The properties to mix in.
  	             *
  	             * @example
  	             *
  	             *     MyType.mixIn({
  	             *         field: 'value'
  	             *     });
  	             */
  	            mixIn: function (properties) {
  	                for (var propertyName in properties) {
  	                    if (properties.hasOwnProperty(propertyName)) {
  	                        this[propertyName] = properties[propertyName];
  	                    }
  	                }

  	                // IE won't copy toString using the loop above
  	                if (properties.hasOwnProperty('toString')) {
  	                    this.toString = properties.toString;
  	                }
  	            },

  	            /**
  	             * Creates a copy of this object.
  	             *
  	             * @return {Object} The clone.
  	             *
  	             * @example
  	             *
  	             *     var clone = instance.clone();
  	             */
  	            clone: function () {
  	                return this.init.prototype.extend(this);
  	            }
  	        };
  	    }());

  	    /**
  	     * An array of 32-bit words.
  	     *
  	     * @property {Array} words The array of 32-bit words.
  	     * @property {number} sigBytes The number of significant bytes in this word array.
  	     */
  	    var WordArray = C_lib.WordArray = Base.extend({
  	        /**
  	         * Initializes a newly created word array.
  	         *
  	         * @param {Array} words (Optional) An array of 32-bit words.
  	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.create();
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
  	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
  	         */
  	        init: function (words, sigBytes) {
  	            words = this.words = words || [];

  	            if (sigBytes != undefined) {
  	                this.sigBytes = sigBytes;
  	            } else {
  	                this.sigBytes = words.length * 4;
  	            }
  	        },

  	        /**
  	         * Converts this word array to a string.
  	         *
  	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
  	         *
  	         * @return {string} The stringified word array.
  	         *
  	         * @example
  	         *
  	         *     var string = wordArray + '';
  	         *     var string = wordArray.toString();
  	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
  	         */
  	        toString: function (encoder) {
  	            return (encoder || Hex).stringify(this);
  	        },

  	        /**
  	         * Concatenates a word array to this word array.
  	         *
  	         * @param {WordArray} wordArray The word array to append.
  	         *
  	         * @return {WordArray} This word array.
  	         *
  	         * @example
  	         *
  	         *     wordArray1.concat(wordArray2);
  	         */
  	        concat: function (wordArray) {
  	            // Shortcuts
  	            var thisWords = this.words;
  	            var thatWords = wordArray.words;
  	            var thisSigBytes = this.sigBytes;
  	            var thatSigBytes = wordArray.sigBytes;

  	            // Clamp excess bits
  	            this.clamp();

  	            // Concat
  	            if (thisSigBytes % 4) {
  	                // Copy one byte at a time
  	                for (var i = 0; i < thatSigBytes; i++) {
  	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
  	                }
  	            } else {
  	                // Copy one word at a time
  	                for (var i = 0; i < thatSigBytes; i += 4) {
  	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
  	                }
  	            }
  	            this.sigBytes += thatSigBytes;

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Removes insignificant bits.
  	         *
  	         * @example
  	         *
  	         *     wordArray.clamp();
  	         */
  	        clamp: function () {
  	            // Shortcuts
  	            var words = this.words;
  	            var sigBytes = this.sigBytes;

  	            // Clamp
  	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
  	            words.length = Math.ceil(sigBytes / 4);
  	        },

  	        /**
  	         * Creates a copy of this word array.
  	         *
  	         * @return {WordArray} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = wordArray.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone.words = this.words.slice(0);

  	            return clone;
  	        },

  	        /**
  	         * Creates a word array filled with random bytes.
  	         *
  	         * @param {number} nBytes The number of random bytes to generate.
  	         *
  	         * @return {WordArray} The random word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
  	         */
  	        random: function (nBytes) {
  	            var words = [];

  	            var r = (function (m_w) {
  	                var m_w = m_w;
  	                var m_z = 0x3ade68b1;
  	                var mask = 0xffffffff;

  	                return function () {
  	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
  	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
  	                    var result = ((m_z << 0x10) + m_w) & mask;
  	                    result /= 0x100000000;
  	                    result += 0.5;
  	                    return result * (Math.random() > .5 ? 1 : -1);
  	                }
  	            });

  	            for (var i = 0, rcache; i < nBytes; i += 4) {
  	                var _r = r((rcache || Math.random()) * 0x100000000);

  	                rcache = _r() * 0x3ade67b7;
  	                words.push((_r() * 0x100000000) | 0);
  	            }

  	            return new WordArray.init(words, nBytes);
  	        }
  	    });

  	    /**
  	     * Encoder namespace.
  	     */
  	    var C_enc = C.enc = {};

  	    /**
  	     * Hex encoding strategy.
  	     */
  	    var Hex = C_enc.Hex = {
  	        /**
  	         * Converts a word array to a hex string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The hex string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var hexChars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                hexChars.push((bite >>> 4).toString(16));
  	                hexChars.push((bite & 0x0f).toString(16));
  	            }

  	            return hexChars.join('');
  	        },

  	        /**
  	         * Converts a hex string to a word array.
  	         *
  	         * @param {string} hexStr The hex string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
  	         */
  	        parse: function (hexStr) {
  	            // Shortcut
  	            var hexStrLength = hexStr.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < hexStrLength; i += 2) {
  	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
  	            }

  	            return new WordArray.init(words, hexStrLength / 2);
  	        }
  	    };

  	    /**
  	     * Latin1 encoding strategy.
  	     */
  	    var Latin1 = C_enc.Latin1 = {
  	        /**
  	         * Converts a word array to a Latin1 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Latin1 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;

  	            // Convert
  	            var latin1Chars = [];
  	            for (var i = 0; i < sigBytes; i++) {
  	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  	                latin1Chars.push(String.fromCharCode(bite));
  	            }

  	            return latin1Chars.join('');
  	        },

  	        /**
  	         * Converts a Latin1 string to a word array.
  	         *
  	         * @param {string} latin1Str The Latin1 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
  	         */
  	        parse: function (latin1Str) {
  	            // Shortcut
  	            var latin1StrLength = latin1Str.length;

  	            // Convert
  	            var words = [];
  	            for (var i = 0; i < latin1StrLength; i++) {
  	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  	            }

  	            return new WordArray.init(words, latin1StrLength);
  	        }
  	    };

  	    /**
  	     * UTF-8 encoding strategy.
  	     */
  	    var Utf8 = C_enc.Utf8 = {
  	        /**
  	         * Converts a word array to a UTF-8 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The UTF-8 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            try {
  	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
  	            } catch (e) {
  	                throw new Error('Malformed UTF-8 data');
  	            }
  	        },

  	        /**
  	         * Converts a UTF-8 string to a word array.
  	         *
  	         * @param {string} utf8Str The UTF-8 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
  	         */
  	        parse: function (utf8Str) {
  	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  	        }
  	    };

  	    /**
  	     * Abstract buffered block algorithm template.
  	     *
  	     * The property blockSize must be implemented in a concrete subtype.
  	     *
  	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
  	     */
  	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
  	        /**
  	         * Resets this block algorithm's data buffer to its initial state.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm.reset();
  	         */
  	        reset: function () {
  	            // Initial values
  	            this._data = new WordArray.init();
  	            this._nDataBytes = 0;
  	        },

  	        /**
  	         * Adds new data to this block algorithm's buffer.
  	         *
  	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
  	         *
  	         * @example
  	         *
  	         *     bufferedBlockAlgorithm._append('data');
  	         *     bufferedBlockAlgorithm._append(wordArray);
  	         */
  	        _append: function (data) {
  	            // Convert string to WordArray, else assume WordArray already
  	            if (typeof data == 'string') {
  	                data = Utf8.parse(data);
  	            }

  	            // Append
  	            this._data.concat(data);
  	            this._nDataBytes += data.sigBytes;
  	        },

  	        /**
  	         * Processes available data blocks.
  	         *
  	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
  	         *
  	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
  	         *
  	         * @return {WordArray} The processed data.
  	         *
  	         * @example
  	         *
  	         *     var processedData = bufferedBlockAlgorithm._process();
  	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
  	         */
  	        _process: function (doFlush) {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;
  	            var dataSigBytes = data.sigBytes;
  	            var blockSize = this.blockSize;
  	            var blockSizeBytes = blockSize * 4;

  	            // Count blocks ready
  	            var nBlocksReady = dataSigBytes / blockSizeBytes;
  	            if (doFlush) {
  	                // Round up to include partial blocks
  	                nBlocksReady = Math.ceil(nBlocksReady);
  	            } else {
  	                // Round down to include only full blocks,
  	                // less the number of blocks that must remain in the buffer
  	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
  	            }

  	            // Count words ready
  	            var nWordsReady = nBlocksReady * blockSize;

  	            // Count bytes ready
  	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

  	            // Process blocks
  	            if (nWordsReady) {
  	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
  	                    // Perform concrete-algorithm logic
  	                    this._doProcessBlock(dataWords, offset);
  	                }

  	                // Remove processed words
  	                var processedWords = dataWords.splice(0, nWordsReady);
  	                data.sigBytes -= nBytesReady;
  	            }

  	            // Return processed words
  	            return new WordArray.init(processedWords, nBytesReady);
  	        },

  	        /**
  	         * Creates a copy of this object.
  	         *
  	         * @return {Object} The clone.
  	         *
  	         * @example
  	         *
  	         *     var clone = bufferedBlockAlgorithm.clone();
  	         */
  	        clone: function () {
  	            var clone = Base.clone.call(this);
  	            clone._data = this._data.clone();

  	            return clone;
  	        },

  	        _minBufferSize: 0
  	    });

  	    /**
  	     * Abstract hasher template.
  	     *
  	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
  	     */
  	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
  	        /**
  	         * Configuration options.
  	         */
  	        cfg: Base.extend(),

  	        /**
  	         * Initializes a newly created hasher.
  	         *
  	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
  	         *
  	         * @example
  	         *
  	         *     var hasher = CryptoJS.algo.SHA256.create();
  	         */
  	        init: function (cfg) {
  	            // Apply config defaults
  	            this.cfg = this.cfg.extend(cfg);

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this hasher to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hasher.reset();
  	         */
  	        reset: function () {
  	            // Reset data buffer
  	            BufferedBlockAlgorithm.reset.call(this);

  	            // Perform concrete-hasher logic
  	            this._doReset();
  	        },

  	        /**
  	         * Updates this hasher with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {Hasher} This hasher.
  	         *
  	         * @example
  	         *
  	         *     hasher.update('message');
  	         *     hasher.update(wordArray);
  	         */
  	        update: function (messageUpdate) {
  	            // Append
  	            this._append(messageUpdate);

  	            // Update the hash
  	            this._process();

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Finalizes the hash computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The hash.
  	         *
  	         * @example
  	         *
  	         *     var hash = hasher.finalize();
  	         *     var hash = hasher.finalize('message');
  	         *     var hash = hasher.finalize(wordArray);
  	         */
  	        finalize: function (messageUpdate) {
  	            // Final message update
  	            if (messageUpdate) {
  	                this._append(messageUpdate);
  	            }

  	            // Perform concrete-hasher logic
  	            var hash = this._doFinalize();

  	            return hash;
  	        },

  	        blockSize: 512/32,

  	        /**
  	         * Creates a shortcut function to a hasher's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to create a helper for.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHelper: function (hasher) {
  	            return function (message, cfg) {
  	                return new hasher.init(cfg).finalize(message);
  	            };
  	        },

  	        /**
  	         * Creates a shortcut function to the HMAC's object interface.
  	         *
  	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
  	         *
  	         * @return {Function} The shortcut function.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
  	         */
  	        _createHmacHelper: function (hasher) {
  	            return function (message, key) {
  	                return new C_algo.HMAC.init(hasher, key).finalize(message);
  	            };
  	        }
  	    });

  	    /**
  	     * Algorithm namespace.
  	     */
  	    var C_algo = C.algo = {};

  	    return C;
  	}(Math));


  	return CryptoJS;

  }));
  });

  var encBase64 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var C_enc = C.enc;

  	    /**
  	     * Base64 encoding strategy.
  	     */
  	    var Base64 = C_enc.Base64 = {
  	        /**
  	         * Converts a word array to a Base64 string.
  	         *
  	         * @param {WordArray} wordArray The word array.
  	         *
  	         * @return {string} The Base64 string.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
  	         */
  	        stringify: function (wordArray) {
  	            // Shortcuts
  	            var words = wordArray.words;
  	            var sigBytes = wordArray.sigBytes;
  	            var map = this._map;

  	            // Clamp excess bits
  	            wordArray.clamp();

  	            // Convert
  	            var base64Chars = [];
  	            for (var i = 0; i < sigBytes; i += 3) {
  	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
  	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
  	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

  	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

  	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
  	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
  	                }
  	            }

  	            // Add padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                while (base64Chars.length % 4) {
  	                    base64Chars.push(paddingChar);
  	                }
  	            }

  	            return base64Chars.join('');
  	        },

  	        /**
  	         * Converts a Base64 string to a word array.
  	         *
  	         * @param {string} base64Str The Base64 string.
  	         *
  	         * @return {WordArray} The word array.
  	         *
  	         * @static
  	         *
  	         * @example
  	         *
  	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
  	         */
  	        parse: function (base64Str) {
  	            // Shortcuts
  	            var base64StrLength = base64Str.length;
  	            var map = this._map;
  	            var reverseMap = this._reverseMap;

  	            if (!reverseMap) {
  	                    reverseMap = this._reverseMap = [];
  	                    for (var j = 0; j < map.length; j++) {
  	                        reverseMap[map.charCodeAt(j)] = j;
  	                    }
  	            }

  	            // Ignore padding
  	            var paddingChar = map.charAt(64);
  	            if (paddingChar) {
  	                var paddingIndex = base64Str.indexOf(paddingChar);
  	                if (paddingIndex !== -1) {
  	                    base64StrLength = paddingIndex;
  	                }
  	            }

  	            // Convert
  	            return parseLoop(base64Str, base64StrLength, reverseMap);

  	        },

  	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  	    };

  	    function parseLoop(base64Str, base64StrLength, reverseMap) {
  	      var words = [];
  	      var nBytes = 0;
  	      for (var i = 0; i < base64StrLength; i++) {
  	          if (i % 4) {
  	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
  	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
  	              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
  	              nBytes++;
  	          }
  	      }
  	      return WordArray.create(words, nBytes);
  	    }
  	}());


  	return CryptoJS.enc.Base64;

  }));
  });

  var md5$1 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function (Math) {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Constants table
  	    var T = [];

  	    // Compute constants
  	    (function () {
  	        for (var i = 0; i < 64; i++) {
  	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
  	        }
  	    }());

  	    /**
  	     * MD5 hash algorithm.
  	     */
  	    var MD5 = C_algo.MD5 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init([
  	                0x67452301, 0xefcdab89,
  	                0x98badcfe, 0x10325476
  	            ]);
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Swap endian
  	            for (var i = 0; i < 16; i++) {
  	                // Shortcuts
  	                var offset_i = offset + i;
  	                var M_offset_i = M[offset_i];

  	                M[offset_i] = (
  	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
  	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
  	                );
  	            }

  	            // Shortcuts
  	            var H = this._hash.words;

  	            var M_offset_0  = M[offset + 0];
  	            var M_offset_1  = M[offset + 1];
  	            var M_offset_2  = M[offset + 2];
  	            var M_offset_3  = M[offset + 3];
  	            var M_offset_4  = M[offset + 4];
  	            var M_offset_5  = M[offset + 5];
  	            var M_offset_6  = M[offset + 6];
  	            var M_offset_7  = M[offset + 7];
  	            var M_offset_8  = M[offset + 8];
  	            var M_offset_9  = M[offset + 9];
  	            var M_offset_10 = M[offset + 10];
  	            var M_offset_11 = M[offset + 11];
  	            var M_offset_12 = M[offset + 12];
  	            var M_offset_13 = M[offset + 13];
  	            var M_offset_14 = M[offset + 14];
  	            var M_offset_15 = M[offset + 15];

  	            // Working varialbes
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];

  	            // Computation
  	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
  	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
  	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
  	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
  	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
  	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
  	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
  	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
  	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
  	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
  	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
  	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
  	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
  	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
  	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
  	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

  	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
  	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
  	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
  	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
  	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
  	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
  	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
  	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
  	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
  	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
  	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
  	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
  	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
  	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
  	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
  	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

  	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
  	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
  	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
  	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
  	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
  	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
  	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
  	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
  	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
  	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
  	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
  	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
  	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
  	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
  	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
  	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

  	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
  	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
  	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
  	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
  	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
  	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
  	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
  	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
  	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
  	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
  	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
  	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
  	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
  	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
  	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
  	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

  	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
  	            var nBitsTotalL = nBitsTotal;
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
  	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
  	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
  	            );
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
  	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
  	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
  	            );

  	            data.sigBytes = (dataWords.length + 1) * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Shortcuts
  	            var hash = this._hash;
  	            var H = hash.words;

  	            // Swap endian
  	            for (var i = 0; i < 4; i++) {
  	                // Shortcut
  	                var H_i = H[i];

  	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
  	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  	            }

  	            // Return final computed hash
  	            return hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    function FF(a, b, c, d, x, s, t) {
  	        var n = a + ((b & c) | (~b & d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function GG(a, b, c, d, x, s, t) {
  	        var n = a + ((b & d) | (c & ~d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function HH(a, b, c, d, x, s, t) {
  	        var n = a + (b ^ c ^ d) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    function II(a, b, c, d, x, s, t) {
  	        var n = a + (c ^ (b | ~d)) + x + t;
  	        return ((n << s) | (n >>> (32 - s))) + b;
  	    }

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.MD5('message');
  	     *     var hash = CryptoJS.MD5(wordArray);
  	     */
  	    C.MD5 = Hasher._createHelper(MD5);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacMD5(message, key);
  	     */
  	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
  	}(Math));


  	return CryptoJS.MD5;

  }));
  });

  var encUtf8 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	return CryptoJS.enc.Utf8;

  }));
  });

  var sha1 = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var WordArray = C_lib.WordArray;
  	    var Hasher = C_lib.Hasher;
  	    var C_algo = C.algo;

  	    // Reusable object
  	    var W = [];

  	    /**
  	     * SHA-1 hash algorithm.
  	     */
  	    var SHA1 = C_algo.SHA1 = Hasher.extend({
  	        _doReset: function () {
  	            this._hash = new WordArray.init([
  	                0x67452301, 0xefcdab89,
  	                0x98badcfe, 0x10325476,
  	                0xc3d2e1f0
  	            ]);
  	        },

  	        _doProcessBlock: function (M, offset) {
  	            // Shortcut
  	            var H = this._hash.words;

  	            // Working variables
  	            var a = H[0];
  	            var b = H[1];
  	            var c = H[2];
  	            var d = H[3];
  	            var e = H[4];

  	            // Computation
  	            for (var i = 0; i < 80; i++) {
  	                if (i < 16) {
  	                    W[i] = M[offset + i] | 0;
  	                } else {
  	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
  	                    W[i] = (n << 1) | (n >>> 31);
  	                }

  	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
  	                if (i < 20) {
  	                    t += ((b & c) | (~b & d)) + 0x5a827999;
  	                } else if (i < 40) {
  	                    t += (b ^ c ^ d) + 0x6ed9eba1;
  	                } else if (i < 60) {
  	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
  	                } else /* if (i < 80) */ {
  	                    t += (b ^ c ^ d) - 0x359d3e2a;
  	                }

  	                e = d;
  	                d = c;
  	                c = (b << 30) | (b >>> 2);
  	                b = a;
  	                a = t;
  	            }

  	            // Intermediate hash value
  	            H[0] = (H[0] + a) | 0;
  	            H[1] = (H[1] + b) | 0;
  	            H[2] = (H[2] + c) | 0;
  	            H[3] = (H[3] + d) | 0;
  	            H[4] = (H[4] + e) | 0;
  	        },

  	        _doFinalize: function () {
  	            // Shortcuts
  	            var data = this._data;
  	            var dataWords = data.words;

  	            var nBitsTotal = this._nDataBytes * 8;
  	            var nBitsLeft = data.sigBytes * 8;

  	            // Add padding
  	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  	            data.sigBytes = dataWords.length * 4;

  	            // Hash final blocks
  	            this._process();

  	            // Return final computed hash
  	            return this._hash;
  	        },

  	        clone: function () {
  	            var clone = Hasher.clone.call(this);
  	            clone._hash = this._hash.clone();

  	            return clone;
  	        }
  	    });

  	    /**
  	     * Shortcut function to the hasher's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     *
  	     * @return {WordArray} The hash.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hash = CryptoJS.SHA1('message');
  	     *     var hash = CryptoJS.SHA1(wordArray);
  	     */
  	    C.SHA1 = Hasher._createHelper(SHA1);

  	    /**
  	     * Shortcut function to the HMAC's object interface.
  	     *
  	     * @param {WordArray|string} message The message to hash.
  	     * @param {WordArray|string} key The secret key.
  	     *
  	     * @return {WordArray} The HMAC.
  	     *
  	     * @static
  	     *
  	     * @example
  	     *
  	     *     var hmac = CryptoJS.HmacSHA1(message, key);
  	     */
  	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
  	}());


  	return CryptoJS.SHA1;

  }));
  });

  var hmac = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	(function () {
  	    // Shortcuts
  	    var C = CryptoJS;
  	    var C_lib = C.lib;
  	    var Base = C_lib.Base;
  	    var C_enc = C.enc;
  	    var Utf8 = C_enc.Utf8;
  	    var C_algo = C.algo;

  	    /**
  	     * HMAC algorithm.
  	     */
  	    var HMAC = C_algo.HMAC = Base.extend({
  	        /**
  	         * Initializes a newly created HMAC.
  	         *
  	         * @param {Hasher} hasher The hash algorithm to use.
  	         * @param {WordArray|string} key The secret key.
  	         *
  	         * @example
  	         *
  	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
  	         */
  	        init: function (hasher, key) {
  	            // Init hasher
  	            hasher = this._hasher = new hasher.init();

  	            // Convert string to WordArray, else assume WordArray already
  	            if (typeof key == 'string') {
  	                key = Utf8.parse(key);
  	            }

  	            // Shortcuts
  	            var hasherBlockSize = hasher.blockSize;
  	            var hasherBlockSizeBytes = hasherBlockSize * 4;

  	            // Allow arbitrary length keys
  	            if (key.sigBytes > hasherBlockSizeBytes) {
  	                key = hasher.finalize(key);
  	            }

  	            // Clamp excess bits
  	            key.clamp();

  	            // Clone key for inner and outer pads
  	            var oKey = this._oKey = key.clone();
  	            var iKey = this._iKey = key.clone();

  	            // Shortcuts
  	            var oKeyWords = oKey.words;
  	            var iKeyWords = iKey.words;

  	            // XOR keys with pad constants
  	            for (var i = 0; i < hasherBlockSize; i++) {
  	                oKeyWords[i] ^= 0x5c5c5c5c;
  	                iKeyWords[i] ^= 0x36363636;
  	            }
  	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

  	            // Set initial values
  	            this.reset();
  	        },

  	        /**
  	         * Resets this HMAC to its initial state.
  	         *
  	         * @example
  	         *
  	         *     hmacHasher.reset();
  	         */
  	        reset: function () {
  	            // Shortcut
  	            var hasher = this._hasher;

  	            // Reset
  	            hasher.reset();
  	            hasher.update(this._iKey);
  	        },

  	        /**
  	         * Updates this HMAC with a message.
  	         *
  	         * @param {WordArray|string} messageUpdate The message to append.
  	         *
  	         * @return {HMAC} This HMAC instance.
  	         *
  	         * @example
  	         *
  	         *     hmacHasher.update('message');
  	         *     hmacHasher.update(wordArray);
  	         */
  	        update: function (messageUpdate) {
  	            this._hasher.update(messageUpdate);

  	            // Chainable
  	            return this;
  	        },

  	        /**
  	         * Finalizes the HMAC computation.
  	         * Note that the finalize operation is effectively a destructive, read-once operation.
  	         *
  	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  	         *
  	         * @return {WordArray} The HMAC.
  	         *
  	         * @example
  	         *
  	         *     var hmac = hmacHasher.finalize();
  	         *     var hmac = hmacHasher.finalize('message');
  	         *     var hmac = hmacHasher.finalize(wordArray);
  	         */
  	        finalize: function (messageUpdate) {
  	            // Shortcut
  	            var hasher = this._hasher;

  	            // Compute HMAC
  	            var innerHash = hasher.finalize(messageUpdate);
  	            hasher.reset();
  	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

  	            return hmac;
  	        }
  	    });
  	}());


  }));
  });

  var hmacSha1 = createCommonjsModule(function (module, exports) {
  (function (root, factory, undef) {
  	{
  		// CommonJS
  		module.exports = exports = factory(core, sha1, hmac);
  	}
  }(commonjsGlobal, function (CryptoJS) {

  	return CryptoJS.HmacSHA1;

  }));
  });

  var _library$1 = false;

  var _aFunction$1 = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  // optional / simple context binding

  var _ctx$1 = function (fn, that, length) {
    _aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var toString$3 = {}.toString;

  var _cof$1 = function (it) {
    return toString$3.call(it).slice(8, -1);
  };

  var _core$1 = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.1' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1$1 = _core$1.version;

  var _shared$1 = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global$1[SHARED] || (_global$1[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core$1.version,
    mode: _library$1 ? 'pure' : 'global',
    copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id$1 = 0;
  var px$1 = Math.random();
  var _uid$1 = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px$1).toString(36));
  };

  var _wks$1 = createCommonjsModule(function (module) {
  var store = _shared$1('wks');

  var Symbol = _global$1.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid$1)('Symbol.' + name));
  };

  $exports.store = store;
  });

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG$1 = _wks$1('toStringTag');
  // ES3 wrong here
  var ARG = _cof$1(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof$1(O)
      // ES3 arguments fallback
      : (B = _cof$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var _propertyDesc$1 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide$1 = _descriptors$1 ? function (object, key, value) {
    return _objectDp$1.f(object, key, _propertyDesc$1(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty$1 = {}.hasOwnProperty;
  var _has$1 = function (it, key) {
    return hasOwnProperty$1.call(it, key);
  };

  var _redefine$1 = createCommonjsModule(function (module) {
  var SRC = _uid$1('src');
  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  _core$1.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has$1(val, 'name') || _hide$1(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has$1(val, SRC) || _hide$1(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global$1) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide$1(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide$1(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
  });

  var PROTOTYPE$3 = 'prototype';

  var $export$1 = function (type, name, source) {
    var IS_FORCED = type & $export$1.F;
    var IS_GLOBAL = type & $export$1.G;
    var IS_STATIC = type & $export$1.S;
    var IS_PROTO = type & $export$1.P;
    var IS_BIND = type & $export$1.B;
    var target = IS_GLOBAL ? _global$1 : IS_STATIC ? _global$1[name] || (_global$1[name] = {}) : (_global$1[name] || {})[PROTOTYPE$3];
    var exports = IS_GLOBAL ? _core$1 : _core$1[name] || (_core$1[name] = {});
    var expProto = exports[PROTOTYPE$3] || (exports[PROTOTYPE$3] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? _ctx$1(out, _global$1) : IS_PROTO && typeof out == 'function' ? _ctx$1(Function.call, out) : out;
      // extend global
      if (target) _redefine$1(target, key, out, type & $export$1.U);
      // export
      if (exports[key] != out) _hide$1(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  _global$1.core = _core$1;
  // type bitmap
  $export$1.F = 1;   // forced
  $export$1.G = 2;   // global
  $export$1.S = 4;   // static
  $export$1.P = 8;   // proto
  $export$1.B = 16;  // bind
  $export$1.W = 32;  // wrap
  $export$1.U = 64;  // safe
  $export$1.R = 128; // real proto method for `library`
  var _export$1 = $export$1;

  var _anInstance = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
      throw TypeError(name + ': incorrect invocation!');
    } return it;
  };

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject$1(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) _anObject$1(ret.call(iterator));
      throw e;
    }
  };

  var _iterators$1 = {};

  // check on default Array iterator

  var ITERATOR$1 = _wks$1('iterator');
  var ArrayProto = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators$1.Array === it || ArrayProto[ITERATOR$1] === it);
  };

  // 7.1.4 ToInteger
  var ceil$1 = Math.ceil;
  var floor$1 = Math.floor;
  var _toInteger$1 = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor$1 : ceil$1)(it);
  };

  // 7.1.15 ToLength

  var min$3 = Math.min;
  var _toLength$1 = function (it) {
    return it > 0 ? min$3(_toInteger$1(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var ITERATOR$2 = _wks$1('iterator');

  var core_getIteratorMethod = _core$1.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$2]
      || it['@@iterator']
      || _iterators$1[_classof(it)];
  };

  var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
    var f = _ctx$1(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) for (length = _toLength$1(iterable.length); length > index; index++) {
      result = entries ? f(_anObject$1(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) return result;
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) return result;
    }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
  });

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES = _wks$1('species');
  var _speciesConstructor = function (O, D) {
    var C = _anObject$1(O).constructor;
    var S;
    return C === undefined || (S = _anObject$1(C)[SPECIES]) == undefined ? D : _aFunction$1(S);
  };

  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  var _invoke = function (fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0: return un ? fn()
                        : fn.call(that);
      case 1: return un ? fn(args[0])
                        : fn.call(that, args[0]);
      case 2: return un ? fn(args[0], args[1])
                        : fn.call(that, args[0], args[1]);
      case 3: return un ? fn(args[0], args[1], args[2])
                        : fn.call(that, args[0], args[1], args[2]);
      case 4: return un ? fn(args[0], args[1], args[2], args[3])
                        : fn.call(that, args[0], args[1], args[2], args[3]);
    } return fn.apply(that, args);
  };

  var document$4 = _global$1.document;
  var _html$1 = document$4 && document$4.documentElement;

  var process$1 = _global$1.process;
  var setTask = _global$1.setImmediate;
  var clearTask = _global$1.clearImmediate;
  var MessageChannel = _global$1.MessageChannel;
  var Dispatch = _global$1.Dispatch;
  var counter = 0;
  var queue$1 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer$1, channel, port;
  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue$1.hasOwnProperty(id)) {
      var fn = queue$1[id];
      delete queue$1[id];
      fn();
    }
  };
  var listener = function (event) {
    run.call(event.data);
  };
  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue$1[++counter] = function () {
        // eslint-disable-next-line no-new-func
        _invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer$1(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue$1[id];
    };
    // Node.js 0.8-
    if (_cof$1(process$1) == 'process') {
      defer$1 = function (id) {
        process$1.nextTick(_ctx$1(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer$1 = function (id) {
        Dispatch.now(_ctx$1(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer$1 = _ctx$1(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (_global$1.addEventListener && typeof postMessage == 'function' && !_global$1.importScripts) {
      defer$1 = function (id) {
        _global$1.postMessage(id + '', '*');
      };
      _global$1.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in _domCreate$1('script')) {
      defer$1 = function (id) {
        _html$1.appendChild(_domCreate$1('script'))[ONREADYSTATECHANGE] = function () {
          _html$1.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer$1 = function (id) {
        setTimeout(_ctx$1(run, id, 1), 0);
      };
    }
  }
  var _task = {
    set: setTask,
    clear: clearTask
  };

  var macrotask = _task.set;
  var Observer = _global$1.MutationObserver || _global$1.WebKitMutationObserver;
  var process$2 = _global$1.process;
  var Promise$1 = _global$1.Promise;
  var isNode = _cof$1(process$2) == 'process';

  var _microtask = function () {
    var head, last, notify;

    var flush = function () {
      var parent, fn;
      if (isNode && (parent = process$2.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (e) {
          if (head) notify();
          else last = undefined;
          throw e;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (isNode) {
      notify = function () {
        process$2.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
    } else if (Observer && !(_global$1.navigator && _global$1.navigator.standalone)) {
      var toggle = true;
      var node = document.createTextNode('');
      new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      var promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(_global$1, flush);
      };
    }

    return function (fn) {
      var task = { fn: fn, next: undefined };
      if (last) last.next = task;
      if (!head) {
        head = task;
        notify();
      } last = task;
    };
  };

  // 25.4.1.5 NewPromiseCapability(C)


  function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = _aFunction$1(resolve);
    this.reject = _aFunction$1(reject);
  }

  var f$8 = function (C) {
    return new PromiseCapability(C);
  };

  var _newPromiseCapability = {
  	f: f$8
  };

  var _perform = function (exec) {
    try {
      return { e: false, v: exec() };
    } catch (e) {
      return { e: true, v: e };
    }
  };

  var navigator = _global$1.navigator;

  var _userAgent = navigator && navigator.userAgent || '';

  var _promiseResolve = function (C, x) {
    _anObject$1(C);
    if (_isObject$2(x) && x.constructor === C) return x;
    var promiseCapability = _newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var _redefineAll = function (target, src, safe) {
    for (var key in src) _redefine$1(target, key, src[key], safe);
    return target;
  };

  var def$1 = _objectDp$1.f;

  var TAG$2 = _wks$1('toStringTag');

  var _setToStringTag$1 = function (it, tag, stat) {
    if (it && !_has$1(it = stat ? it : it.prototype, TAG$2)) def$1(it, TAG$2, { configurable: true, value: tag });
  };

  var SPECIES$1 = _wks$1('species');

  var _setSpecies = function (KEY) {
    var C = _global$1[KEY];
    if (_descriptors$1 && C && !C[SPECIES$1]) _objectDp$1.f(C, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var ITERATOR$3 = _wks$1('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$3]();
    riter['return'] = function () { SAFE_CLOSING = true; };
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$3]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$3] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  var task = _task.set;
  var microtask = _microtask();




  var PROMISE = 'Promise';
  var TypeError$1 = _global$1.TypeError;
  var process$3 = _global$1.process;
  var versions = process$3 && process$3.versions;
  var v8 = versions && versions.v8 || '';
  var $Promise = _global$1[PROMISE];
  var isNode$1 = _classof(process$3) == 'process';
  var empty$2 = function () { /* empty */ };
  var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

  var USE_NATIVE$1 = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1);
      var FakePromise = (promise.constructor = {})[_wks$1('species')] = function (exec) {
        exec(empty$2, empty$2);
      };
      // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return (isNode$1 || typeof PromiseRejectionEvent == 'function')
        && promise.then(empty$2) instanceof FakePromise
        // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
        // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
        // we can't detect it synchronously, so just check versions
        && v8.indexOf('6.6') !== 0
        && _userAgent.indexOf('Chrome/66') === -1;
    } catch (e) { /* empty */ }
  }();

  // helpers
  var isThenable = function (it) {
    var then;
    return _isObject$2(it) && typeof (then = it.then) == 'function' ? then : false;
  };
  var notify = function (promise, isReject) {
    if (promise._n) return;
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) onHandleUnhandled(promise);
              promise._h = 1;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (e) {
          if (domain && !exited) domain.exit();
          reject(e);
        }
      };
      while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) onUnhandled(promise);
    });
  };
  var onUnhandled = function (promise) {
    task.call(_global$1, function () {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result, handler, console;
      if (unhandled) {
        result = _perform(function () {
          if (isNode$1) {
            process$3.emit('unhandledRejection', value, promise);
          } else if (handler = _global$1.onunhandledrejection) {
            handler({ promise: promise, reason: value });
          } else if ((console = _global$1.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
      } promise._a = undefined;
      if (unhandled && result.e) throw result.v;
    });
  };
  var isUnhandled = function (promise) {
    return promise._h !== 1 && (promise._a || promise._c).length === 0;
  };
  var onHandleUnhandled = function (promise) {
    task.call(_global$1, function () {
      var handler;
      if (isNode$1) {
        process$3.emit('rejectionHandled', promise);
      } else if (handler = _global$1.onrejectionhandled) {
        handler({ promise: promise, reason: promise._v });
      }
    });
  };
  var $reject = function (value) {
    var promise = this;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    promise._v = value;
    promise._s = 2;
    if (!promise._a) promise._a = promise._c.slice();
    notify(promise, true);
  };
  var $resolve = function (value) {
    var promise = this;
    var then;
    if (promise._d) return;
    promise._d = true;
    promise = promise._w || promise; // unwrap
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = { _w: promise, _d: false }; // wrap
          try {
            then.call(value, _ctx$1($resolve, wrapper, 1), _ctx$1($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({ _w: promise, _d: false }, e); // wrap
    }
  };

  // constructor polyfill
  if (!USE_NATIVE$1) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      _anInstance(this, $Promise, PROMISE, '_h');
      _aFunction$1(executor);
      Internal.call(this);
      try {
        executor(_ctx$1($resolve, this, 1), _ctx$1($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      this._c = [];             // <- awaiting reactions
      this._a = undefined;      // <- checked in isUnhandled reactions
      this._s = 0;              // <- state
      this._d = false;          // <- done
      this._v = undefined;      // <- value
      this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
      this._n = false;          // <- notify
    };
    Internal.prototype = _redefineAll($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode$1 ? process$3.domain : undefined;
        this._c.push(reaction);
        if (this._a) this._a.push(reaction);
        if (this._s) notify(this, false);
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = _ctx$1($resolve, promise, 1);
      this.reject = _ctx$1($reject, promise, 1);
    };
    _newPromiseCapability.f = newPromiseCapability = function (C) {
      return C === $Promise || C === Wrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  _export$1(_export$1.G + _export$1.W + _export$1.F * !USE_NATIVE$1, { Promise: $Promise });
  _setToStringTag$1($Promise, PROMISE);
  _setSpecies(PROMISE);
  Wrapper = _core$1[PROMISE];

  // statics
  _export$1(_export$1.S + _export$1.F * !USE_NATIVE$1, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  _export$1(_export$1.S + _export$1.F * (_library$1 || !USE_NATIVE$1), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      return _promiseResolve(_library$1 && this === Wrapper ? $Promise : this, x);
    }
  });
  _export$1(_export$1.S + _export$1.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
    $Promise.all(iter)['catch'](empty$2);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) reject(result.v);
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) reject(result.v);
      return capability.promise;
    }
  });

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = _anObject$1(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  // 21.2.5.3 get RegExp.prototype.flags()
  if (_descriptors$1 && /./g.flags != 'g') _objectDp$1.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: _flags
  });

  var TO_STRING = 'toString';
  var $toString = /./[TO_STRING];

  var define = function (fn) {
    _redefine$1(RegExp.prototype, TO_STRING, fn, true);
  };

  // 21.2.5.14 RegExp.prototype.toString()
  if (_fails$1(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
    define(function toString() {
      var R = _anObject$1(this);
      return '/'.concat(R.source, '/',
        'flags' in R ? R.flags : !_descriptors$1 && R instanceof RegExp ? _flags.call(R) : undefined);
    });
  // FF44- RegExp#toString has a wrong name
  } else if ($toString.name != TO_STRING) {
    define(function toString() {
      return $toString.call(this);
    });
  }

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = _wks$1('unscopables');
  var ArrayProto$1 = Array.prototype;
  if (ArrayProto$1[UNSCOPABLES] == undefined) _hide$1(ArrayProto$1, UNSCOPABLES, {});
  var _addToUnscopables$1 = function (key) {
    ArrayProto$1[UNSCOPABLES][key] = true;
  };

  var _iterStep$1 = function (done, value) {
    return { value: value, done: !!done };
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject$1 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof$1(it) == 'String' ? it.split('') : Object(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined$1 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject$1 = function (it) {
    return _iobject$1(_defined$1(it));
  };

  var max$2 = Math.max;
  var min$4 = Math.min;
  var _toAbsoluteIndex$1 = function (index, length) {
    index = _toInteger$1(index);
    return index < 0 ? max$2(index + length, 0) : min$4(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes$1 = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject$1($this);
      var length = _toLength$1(O.length);
      var index = _toAbsoluteIndex$1(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var shared$1 = _shared$1('keys');

  var _sharedKey$1 = function (key) {
    return shared$1[key] || (shared$1[key] = _uid$1(key));
  };

  var arrayIndexOf$1 = _arrayIncludes$1(false);
  var IE_PROTO$3 = _sharedKey$1('IE_PROTO');

  var _objectKeysInternal$1 = function (object, names) {
    var O = _toIobject$1(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO$3) _has$1(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (_has$1(O, key = names[i++])) {
      ~arrayIndexOf$1(result, key) || result.push(key);
    }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys$1 = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys$1 = Object.keys || function keys(O) {
    return _objectKeysInternal$1(O, _enumBugKeys$1);
  };

  var _objectDps$1 = _descriptors$1 ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject$1(O);
    var keys = _objectKeys$1(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) _objectDp$1.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$4 = _sharedKey$1('IE_PROTO');
  var Empty$1 = function () { /* empty */ };
  var PROTOTYPE$4 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict$1 = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate$1('iframe');
    var i = _enumBugKeys$1.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html$1.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict$1 = iframeDocument.F;
    while (i--) delete createDict$1[PROTOTYPE$4][_enumBugKeys$1[i]];
    return createDict$1();
  };

  var _objectCreate$1 = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty$1[PROTOTYPE$4] = _anObject$1(O);
      result = new Empty$1();
      Empty$1[PROTOTYPE$4] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$4] = O;
    } else result = createDict$1();
    return Properties === undefined ? result : _objectDps$1(result, Properties);
  };

  var IteratorPrototype$1 = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide$1(IteratorPrototype$1, _wks$1('iterator'), function () { return this; });

  var _iterCreate$1 = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate$1(IteratorPrototype$1, { next: _propertyDesc$1(1, next) });
    _setToStringTag$1(Constructor, NAME + ' Iterator');
  };

  // 7.1.13 ToObject(argument)

  var _toObject$1 = function (it) {
    return Object(_defined$1(it));
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$5 = _sharedKey$1('IE_PROTO');
  var ObjectProto$2 = Object.prototype;

  var _objectGpo$1 = Object.getPrototypeOf || function (O) {
    O = _toObject$1(O);
    if (_has$1(O, IE_PROTO$5)) return O[IE_PROTO$5];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto$2 : null;
  };

  var ITERATOR$4 = _wks$1('iterator');
  var BUGGY$1 = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR$1 = '@@iterator';
  var KEYS$1 = 'keys';
  var VALUES$1 = 'values';

  var returnThis$1 = function () { return this; };

  var _iterDefine$1 = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate$1(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY$1 && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS$1: return function keys() { return new Constructor(this, kind); };
        case VALUES$1: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES$1;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR$4] || proto[FF_ITERATOR$1] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo$1($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag$1(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!_library$1 && typeof IteratorPrototype[ITERATOR$4] != 'function') _hide$1(IteratorPrototype, ITERATOR$4, returnThis$1);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES$1) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!_library$1 || FORCED) && (BUGGY$1 || VALUES_BUG || !proto[ITERATOR$4])) {
      _hide$1(proto, ITERATOR$4, $default);
    }
    // Plug for library
    _iterators$1[NAME] = $default;
    _iterators$1[TAG] = returnThis$1;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES$1),
        keys: IS_SET ? $default : getMethod(KEYS$1),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) _redefine$1(proto, key, methods[key]);
      } else _export$1(_export$1.P + _export$1.F * (BUGGY$1 || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator$1 = _iterDefine$1(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject$1(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep$1(1);
    }
    if (kind == 'keys') return _iterStep$1(0, index);
    if (kind == 'values') return _iterStep$1(0, O[index]);
    return _iterStep$1(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  _iterators$1.Arguments = _iterators$1.Array;

  _addToUnscopables$1('keys');
  _addToUnscopables$1('values');
  _addToUnscopables$1('entries');

  var ITERATOR$5 = _wks$1('iterator');
  var TO_STRING_TAG$1 = _wks$1('toStringTag');
  var ArrayValues = _iterators$1.Array;

  var DOMIterables$1 = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = _objectKeys$1(DOMIterables$1), i$1 = 0; i$1 < collections.length; i$1++) {
    var NAME$2 = collections[i$1];
    var explicit = DOMIterables$1[NAME$2];
    var Collection$1 = _global$1[NAME$2];
    var proto$1 = Collection$1 && Collection$1.prototype;
    var key;
    if (proto$1) {
      if (!proto$1[ITERATOR$5]) _hide$1(proto$1, ITERATOR$5, ArrayValues);
      if (!proto$1[TO_STRING_TAG$1]) _hide$1(proto$1, TO_STRING_TAG$1, NAME$2);
      _iterators$1[NAME$2] = ArrayValues;
      if (explicit) for (key in es6_array_iterator$1) if (!proto$1[key]) _redefine$1(proto$1, key, es6_array_iterator$1[key], true);
    }
  }

  // 7.2.8 IsRegExp(argument)


  var MATCH = _wks$1('match');
  var _isRegexp = function (it) {
    var isRegExp;
    return _isObject$2(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof$1(it) == 'RegExp');
  };

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt$1 = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined$1(that));
      var i = _toInteger$1(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var at = _stringAt$1(true);

   // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var _advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? at(S, index).length : 1);
  };

  var builtinExec = RegExp.prototype.exec;

   // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var _regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }
    if (_classof(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    return builtinExec.call(R, S);
  };

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var LAST_INDEX = 'lastIndex';

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
        re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        // eslint-disable-next-line no-loop-func
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var _regexpExec = patchedExec;

  _export$1({
    target: 'RegExp',
    proto: true,
    forced: _regexpExec !== /./.exec
  }, {
    exec: _regexpExec
  });

  var SPECIES$2 = _wks$1('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails$1(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length === 2 && result[0] === 'a' && result[1] === 'b';
  })();

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = _wks$1(KEY);

    var DELEGATES_TO_SYMBOL = !_fails$1(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails$1(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };
      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES$2] = function () { return re; };
      }
      re[SYMBOL]('');
      return !execCalled;
    }) : undefined;

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var fns = exec(
        _defined$1,
        SYMBOL,
        ''[KEY],
        function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === _regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );
      var strfn = fns[0];
      var rxfn = fns[1];

      _redefine$1(String.prototype, KEY, strfn);
      _hide$1(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return rxfn.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return rxfn.call(string, this); }
      );
    }
  };

  var $min = Math.min;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX$1 = 'lastIndex';

  // eslint-disable-next-line no-empty
  var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();

  // @@split logic
  _fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
      'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
      'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
      '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
      '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
      ''[$SPLIT](/.?/)[LENGTH]
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return [];
        // If `separator` is not a regex, use native split
        if (!_isRegexp(separator)) return $split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = _regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy[LAST_INDEX$1];
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }
          if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
        }
        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      };
    // Chakra, V8
    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
      };
    } else {
      internalSplit = $split;
    }

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;

        var rx = _anObject$1(regexp);
        var S = String(this);
        var C = _speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                      (rx.multiline ? 'm' : '') +
                      (rx.unicode ? 'u' : '') +
                      (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? 0xffffffff : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = $min(_toLength$1(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = _advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  });

  /**
   * @namespace variables
   */

  /**
   * 判断变量是否是object
   * @memberOf variables
   * @function isObject
   * @param {*} obj
   */
  function isObject$2(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }
  /**
   * 判断object是否是空的
   * @memberOf variables
   * @function isEmptyObject
   * @param {object} obj
   */


  function isEmptyObject$2(obj) {
    for (var key in obj) {
      return false;
    }

    return true;
  }
  /**
   * 检验变量是否有正确的值
   * @memberOf variables
   * @function isCorrect
   * @param {*} variable - 被检验的变量
   * @param {boolean} [notBezero=false] - 是否不允许变量等于零
   */


  function isCorrect(variable, notBezero) {
    var result = true;

    if (typeof variable === "string" && (variable === "" || variable === "undefined" || variable === "null" || variable === "NaN" || variable === "Infinity")) {
      result = false;
    } else if (typeof variable === "number" && (isNaN(variable) || !isFinite(variable) || notBezero && variable === 0)) {
      result = false;
    } else if (variable === null) {
      result = false;
    } else if (typeof variable === "undefined") {
      result = false;
    } else if (isObject$2(variable)) {
      if (isEmptyObject$2(variable)) {
        result = false;
      }
    } else if (Array.isArray(variable)) {
      if (variable.length === 0) {
        result = false;
      }
    }

    return result;
  }

  var cacheData = {};

  var Redis =
  /**
   * 初始化redis
   * @param {object} initialData - 初始缓存数据
  */
  function Redis(initialData) {
    _classCallCheck(this, Redis);

    this.storePagingData = function (params, data) {
      if (!variables.isObject(params)) {
        throw new TypeError("params expect a object, but got " + (typeof params === "undefined" ? "undefined" : _typeof(params)) + ".");
      } else {
        var keyType = _typeof(params.key);
        var pageNumType = _typeof(params.pageNum);
        var pageSizeType = _typeof(params.pageSize);
        if (keyType !== "string") {
          throw new TypeError("params.key expect a string, but got " + keyType + ".");
        } else if (pageNumType !== "number") {
          throw new TypeError("params.pageNum expect a number, but got " + pageNumType + ".");
        } else if (pageSizeType !== "number") {
          throw new TypeError("params.pageSize expect a number, but got " + pageSizeType + ".");
        }
      }

      if (!Array.isArray(data)) {
        throw new TypeError("data expect a array, but got " + (typeof data === "undefined" ? "undefined" : _typeof(data)) + ".");
      }

      var key = params.key,
          pageNum = params.pageNum,
          pageSize = params.pageSize;

      var startCursor = (pageNum - 1) * pageSize;
      var endCursor = startCursor + (data.length - 1);
      if (!variables.isObject(cacheData[key])) {
        cacheData[key] = {
          startCursor: null,
          endCursor: null,
          data: []
        };
      }

      if (cacheData[key]["data"]["length"] === 0) {
        cacheData[key]["data"] = data;
        cacheData[key]["startCursor"] = startCursor;
        cacheData[key]["endCursor"] = endCursor;
      } else {
        var sourceArr = cacheData[key]["data"];
        if (startCursor < cacheData[key]["startCursor"] && endCursor >= cacheData[key]["startCursor"] && endCursor <= cacheData[key]["endCursor"]) {
          var newArr = data.slice(0, cacheData[key]["startCursor"] - startCursor);
          for (var i = newArr.length - 1; i > -1; i--) {
            sourceArr.unshift(newArr[i]);
          }
          cacheData[key]["startCursor"] = startCursor;
        } else if (startCursor < cacheData[key]["startCursor"] && endCursor === cacheData[key]["startCursor"] - 1) {
          var _newArr = data;
          for (var _i = _newArr.length - 1; _i > -1; _i--) {
            sourceArr.unshift(_newArr[_i]);
          }
          cacheData[key]["startCursor"] = startCursor;
        } else if (startCursor < cacheData[key]["startCursor"] && endCursor > cacheData[key]["endCursor"]) {
          var leftArr = data.slice(0, cacheData[key]["startCursor"] - startCursor);
          for (var _i2 = leftArr.length - 1; _i2 > -1; _i2--) {
            sourceArr.unshift(leftArr[_i2]);
          }
          cacheData[key]["startCursor"] = startCursor;
          var rightArr = data.slice(cacheData[key]["endCursor"] - endCursor);
          rightArr.forEach(function (item) {
            sourceArr.push(item);
          });
          cacheData[key]["endCursor"] = endCursor;
        } else if (startCursor >= cacheData[key]["startCursor"] && startCursor <= cacheData[key]["endCursor"] && endCursor > cacheData[key]["endCursor"]) {
          var _newArr2 = data.slice(cacheData[key]["endCursor"] - endCursor);
          _newArr2.forEach(function (item) {
            sourceArr.push(item);
          });
          cacheData[key]["endCursor"] = endCursor;
        } else if (startCursor === cacheData[key]["endCursor"] + 1) {
          var _newArr3 = data;
          for (var _i3 = _newArr3.length - 1; _i3 > -1; _i3--) {
            sourceArr.push(_newArr3[_i3]);
          }
          cacheData[key]["endCursor"] = endCursor;
        }
      }
    };

    if (isCorrect(initialData)) cacheData = initialData;
  }

  /**
   * 存储分页数据
   * @param {object} params
   * @param {string} params.key - 缓存名称
   * @param {number} params.pageNum - 分页页码
   * @param {number} params.pageSize - 单页条数
   * @param {array} data
  */
  ;

  var redis = new Redis();

  /**
   * 捕捉事件触发器(distributor$)推送的指定类型的事件，并返回一个observable
   * @param {string|object} type - 事件类型 或 事件对象
   */
  var attract = function attract(_type) {
    var validator = new Schema({
      type: function type(rule, value, callback) {
        var errors = [];
        if (!(typeof _type === "string" || isObject$1(_type))) {
          errors.push(new Error("type must be string or object"));
        }
        callback(errors);
      }
    });
    validator.validate({ type: _type }, function (errors) {
      if (errors) {
        console.error(errors[0]);
      }
    });

    var options = null;
    var _options = {
      useCache: false,
      cacheType: "eventCache" // eventCache itemCache
    };

    if (isCorrectVal(_type) && typeof _type === "string") {
      options = Object.assign({}, _options);
    } else if (isCorrectVal(_type) && isObject$1(_type)) {
      options = Object.assign({}, _options, _type);
      _type = options.type;
      delete options.type;
    }

    var event$ = eventBus$.pipe(pluck(_type), filter(function (event) {
      if (!isCorrectVal(event)) return false;

      if (!isCorrectVal(rxStore$1.pushHeadersMap[event.type])) {
        rxStore$1.pushHeadersMap[event.type] = {
          event: event,
          lastModifyId: new Date().getTime()
        };
        return true;
      }

      var pushHeaders = rxStore$1.pushHeadersMap[event.type];
      var lastEvent = pushHeaders.event;

      // 判断是否要更新lastModifyId
      if (!options.useCache || md5(JSON.stringify(lastEvent.payload)) !== md5(JSON.stringify(event.payload)) || md5(JSON.stringify(lastEvent.options)) !== md5(JSON.stringify(event.options))) {
        rxStore$1.pushHeadersMap[event.type]["lastModifyId"] = new Date().getTime();
      }
      pushHeaders.event = event;
      return true;
    }));

    var operations = [];
    var _subscription = {
      unsubscribe: function unsubscribe() {}
    };
    function generateObs(obs$) {
      _subscription.unsubscribe();
      var obs$$ = new Subject();
      obs$$.__type__ = _type;
      var _obs$ = obs$.pipe(switchMap(function (event) {
        var pushHeaders = rxStore$1.pushHeadersMap[event.type];
        var hasModified = obs$$.lastModifyId !== pushHeaders.lastModifyId;

        // 判断是否有缓存数据
        var cacheData = void 0;
        if (options.useCache && !hasModified) {
          switch (options.cacheType) {
            case "eventCache":
              cacheData = rxStore$1.dataMap[event.type];
              if (!isCorrectVal(cacheData)) {
                hasModified = true;
                pushHeaders.lastModifyId = new Date().getTime();
              }
              break;
          }
        }
        event.hasModified = hasModified;
        return hasModified ? operations.length === 0 ? of(event) : pipe_3(operations)(of(event)) : of(cacheData);
      }), filter(function (data) {
        var canPass = !(data === null || typeof data === "undefined");
        var pushHeaders = rxStore$1.pushHeadersMap[_type];
        var event = pushHeaders.event;
        var hasModified = event.hasModified;
        if (canPass) {
          obs$$.lastModifyId = pushHeaders.lastModifyId;
        }

        // 缓存数据
        if (canPass && hasModified) {
          switch (options.cacheType) {
            case "eventCache":
              rxStore$1.dataMap[_type] = data;
              break;
          }
        }

        return canPass;
      }));
      _subscription = _obs$.subscribe(obs$$);
      return obs$$;
    }
    var processEvent$ = generateObs(event$);

    processEvent$.pipe = function () {
      for (var i = 0; i < arguments.length; i++) {
        operations.push(arguments[i]);
      }
      return generateObs(event$);
    };
    return processEvent$;
  };

  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  _export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

  var $Object = _core.Object;
  var defineProperty$1 = function defineProperty(it, key, desc) {
    return $Object.defineProperty(it, key, desc);
  };

  var defineProperty$2 = createCommonjsModule(function (module) {
  module.exports = { "default": defineProperty$1, __esModule: true };
  });

  unwrapExports(defineProperty$2);

  var defineProperty$4 = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _defineProperty2 = _interopRequireDefault(defineProperty$2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (obj, key, value) {
    if (key in obj) {
      (0, _defineProperty2.default)(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };
  });

  unwrapExports(defineProperty$4);

  var createClass = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _defineProperty2 = _interopRequireDefault(defineProperty$2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        (0, _defineProperty2.default)(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  });

  unwrapExports(createClass);

  var possibleConstructorReturn = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
  };
  });

  unwrapExports(possibleConstructorReturn);

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var check = function (O, proto) {
    _anObject(O);
    if (!_isObject$1(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };
  var _setProto = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
      function (test, buggy, set) {
        try {
          set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
          set(test, []);
          buggy = !(test instanceof Array);
        } catch (e) { buggy = true; }
        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy) O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }({}, false) : undefined),
    check: check
  };

  // 19.1.3.19 Object.setPrototypeOf(O, proto)

  _export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

  var setPrototypeOf = _core.Object.setPrototypeOf;

  var setPrototypeOf$1 = createCommonjsModule(function (module) {
  module.exports = { "default": setPrototypeOf, __esModule: true };
  });

  unwrapExports(setPrototypeOf$1);

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  _export(_export.S, 'Object', { create: _objectCreate });

  var $Object$1 = _core.Object;
  var create = function create(P, D) {
    return $Object$1.create(P, D);
  };

  var create$1 = createCommonjsModule(function (module) {
  module.exports = { "default": create, __esModule: true };
  });

  unwrapExports(create$1);

  var inherits = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf$1);



  var _create2 = _interopRequireDefault(create$1);



  var _typeof3 = _interopRequireDefault(_typeof_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
    }

    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
  };
  });

  unwrapExports(inherits);

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty$2.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  var printWarning = function() {};

  {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );

          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  var react_development = createCommonjsModule(function (module) {



  {
    (function() {

  var _assign = objectAssign;
  var checkPropTypes = checkPropTypes_1;

  // TODO: this is special because it gets imported during build.

  var ReactVersion = '16.8.3';

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;

  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }
    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }
    return null;
  }

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var validateFormat = function () {};

  {
    validateFormat = function (format) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    };
  }

  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);

    if (!condition) {
      var error = void 0;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  // Relying on the `invariant()` implementation lets us
  // preserve the format and params in the www builds.

  /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var lowPriorityWarning = function () {};

  {
    var printWarning = function (format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.warn(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    lowPriorityWarning = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  var lowPriorityWarning$1 = lowPriorityWarning;

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warningWithoutStack = function () {};

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (args.length > 8) {
        // Check before the condition to catch violations early.
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }
      if (condition) {
        return;
      }
      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format);

        // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    };
  }

  var warningWithoutStack$1 = warningWithoutStack;

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + '.' + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  /**
   * This is the abstract API for an update queue.
   */
  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }

  /**
   * Base class helpers for the updating state of a component.
   */
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  Component.prototype.setState = function (partialState, callback) {
    !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */
  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;

  /**
   * Convenience component with default shallow equality check for sCU.
   */
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  _assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }
    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;


  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return 'ConcurrentMode';
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
          }
      }
    }
    return null;
  }

  var ReactDebugCurrentFrame = {};

  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = '';

      // Add an extra top frame while an element is being validated
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }

      // Delegate to the injected renderer-specific implementation
      var impl = ReactDebugCurrentFrame.getCurrentStack;
      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  };

  {
    _assign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();
      // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
    };
  }

  var warning$1 = warning;

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @param {*} owner
   * @param {*} props
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */
  function createElement(type, config, children) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */


  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  }

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */
  function cloneElement(element, config, children) {
    !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

    var propName = void 0;

    // Original props are copied
    var props = _assign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }

  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */
  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;
        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(traverseContext, children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
        context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;


    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren(children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild(children) {
    !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      // $FlowFixMe: Flow complains about not setting a value, which is intentional here
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }
            return context.Consumer;
          }
        }
      });
      // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  function lazy(ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };

    {
      // In production, this would just set it on the object.
      var defaultProps = void 0;
      var propTypes = void 0;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            defaultProps = newDefaultProps;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            propTypes = newPropTypes;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;
    !(dispatcher !== null) ? invariant(false, 'Hooks can only be called inside the body of a function component. (https://fb.me/react-invalid-hook-call)') : void 0;
    return dispatcher;
  }

  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    {
      !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

      // TODO: add a more generic warning for invalid values.
      if (Context._context !== undefined) {
        var realContext = Context._context;
        // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.
        if (realContext.Consumer === Context) {
          warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }
    return dispatcher.useContext(Context, unstable_observedBits);
  }

  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown = void 0;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }
    return '';
  }

  function getSourceInfoErrorAddendum(elementProps) {
    if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
      var source = elementProps.__source;
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = '\n\nCheck the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes(element) {
    var type = element.type;
    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }
    var name = getComponentName(type);
    var propTypes = void 0;
    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
    // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }
    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */
  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);

    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type);

    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    // Legacy hook: remove it
    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }

  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

  // Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


  // In some cases, StrictMode should also double-render lifecycles.
  // This can be confusing for tests though,
  // And it can be bad for performance in production.
  // This feature flag can be used to control the behavior:


  // To preserve the "Pause on caught exceptions" behavior of the debugger, we
  // replay the begin phase of a failed component inside invokeGuardedCallback.


  // Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


  // Gather advanced timing metrics for Profiler subtrees.


  // Trace which interactions trigger each commit.


  // Only used in www builds.
   // TODO: true? Here it might just be false.

  // Only used in www builds.


  // Only used in www builds.


  // React Fire: prevent the value and checked attributes from syncing
  // with their related DOM properties


  // These APIs will no longer be "unstable" in the upcoming 16.7 release,
  // Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
  var enableStableConcurrentModeAPIs = false;

  var React = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    },

    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,

    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,

    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,

    Fragment: REACT_FRAGMENT_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,

    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,

    version: ReactVersion,

    unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
    unstable_Profiler: REACT_PROFILER_TYPE,

    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
  };

  // Note: some APIs are added with feature flags.
  // Make sure that stable builds for open source
  // don't modify the React object to avoid deopts.
  // Also let's not expose their names in stable builds.

  if (enableStableConcurrentModeAPIs) {
    React.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    React.Profiler = REACT_PROFILER_TYPE;
    React.unstable_ConcurrentMode = undefined;
    React.unstable_Profiler = undefined;
  }



  var React$2 = Object.freeze({
  	default: React
  });

  var React$3 = ( React$2 && React ) || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var react = React$3.default || React$3;

  module.exports = react;
    })();
  }
  });

  var react = createCommonjsModule(function (module) {

  {
    module.exports = react_development;
  }
  });

  var test$ = attract("test");
  test$.subscribe(function (data) {
    console.log(data);
  });
  distributor$.next("test");

}());
