'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*!
 * util
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * General utility functions
 */
var Util = function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: 'each',

		/**
   * Wraps a for in loop.
   * For each object it will pass the
   * property name and value to a callback.
   * @param {object} data - data to loop through
   * @param {function} cb - callback
   */
		value: function each(data, cb) {
			for (var i in data) {
				var e = data[i];
				cb(i, e);
			}
		}
	}]);

	return Util;
}();

// helpers


if (typeof isDefined === 'undefined') {
	window.isDefined = function (x) {
		return typeof x !== 'undefined';
	};
}
if (typeof isNull === 'undefined') {
	window.isNull = function (x) {
		return x === null;
	};
}
if (typeof isFunction === 'undefined') {
	window.isFunction = function (x) {
		return typeof x === 'function';
	};
}
if (typeof isString === 'undefined') {
	window.isString = function (x) {
		return typeof x === 'string';
	};
}
if (typeof isNumber === 'undefined') {
	window.isNumber = function (x) {
		return typeof x === 'number';
	};
}
if (typeof isObject === 'undefined') {
	window.isObject = function (x) {
		return x !== null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object';
	};
}
if (typeof getType === 'undefined') {
	//http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
	window.getType = function (x) {
		if (x === null) return "[object Null]";
		return Object.prototype.toString.call(x);
	};
}
// array
if (typeof Array.diff === 'undefined') {
	Array.diff = function (a, b) {
		return a.filter(function (i) {
			return b.indexOf(i) < 0;
		});
	};
}
if (typeof Array.min === 'undefined') {
	Array.min = function (array) {
		return Math.min.apply(Math, array);
	};
}
if (typeof Array.max === 'undefined') {
	Array.max = function (array) {
		return Math.max.apply(Math, array);
	};
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
	Object.assign = function (target) {
		'use strict';

		if (target == null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		target = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var source = arguments[index];
			if (source != null) {
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	};
}
/*!
 * eventSystem
 * https://github.com/Voliware/Util
 * Licensed under the MIT license.
 */

/**
 * Basic event system.
 * Uses the on/off/trigger or emit methods.
 */

var EventSystem = function () {

	/**
  * Constructor
  * @returns {EventSystem}
  */
	function EventSystem() {
		_classCallCheck(this, EventSystem);

		this.events = {};
		return this;
	}

	/**
  * Create an event an object
  * with an array of callbacks
  * @param {string} name - name of the event
  * @returns {{callbacks: Array}}
  * @private
  */


	_createClass(EventSystem, [{
		key: '_create',
		value: function _create(name) {
			return this.events[name] = { callbacks: [] };
		}

		/**
   * Destroy an event
   * @param {string} name - name of the event
   * @returns {EventSystem}
   * @private
   */

	}, {
		key: '_destroy',
		value: function _destroy(name) {
			if (isDefined(this.event[name])) delete this.event[name];
			return this;
		}

		/**
   * Attaches a callback to an event
   * @param {string} name - name of the event
   * @param {function} callback - the callback function
   * @returns {EventSystem}
   */

	}, {
		key: 'on',
		value: function on(name, callback) {
			var event = this.events[name];

			if (!isDefined(event)) event = this._create(name);

			event.callbacks.push(callback);
			return this;
		}

		/**
   * Detach a callback from an event.
   * This will only work if the callback is not anonymous
   * @param {string} name - name of the event
   * @param {function} callback - the callback function
   * @returns {EventSystem}
   */

	}, {
		key: 'off',
		value: function off(name, callback) {
			var event = this.events[name];

			if (isDefined(event)) {
				var i = event.callbacks.indexOf(callback);
				if (i > -1) event.callbacks.splice(i, 1);
			}
			return this;
		}

		/**
   * Remove all callbacks for an event
   * @param {string} name - name of the event
   * @returns {EventSystem}
   */

	}, {
		key: 'offAll',
		value: function offAll(name) {
			var event = this.events[name];

			if (isDefined(event)) event[name].callbacks = [];

			return this;
		}

		/**
   * Run all callbacks attached to an event
   * @returns {EventSystem}
   */

	}, {
		key: 'trigger',
		value: function trigger() {
			// grab the name of the event and remove it from arguments
			var shift = [].shift;
			var name = shift.apply(arguments);
			var event = this.events[name];

			// there's no need to trigger if no one is listening
			if (!isDefined(event)) return this;

			for (var i = 0; i < event.callbacks.length; i++) {
				var _event$callbacks;

				(_event$callbacks = event.callbacks)[i].apply(_event$callbacks, arguments);
			}
			return this;
		}

		/**
   * Alias to trigger method
   * @returns {EventSystem}
   */

	}, {
		key: 'emit',
		value: function emit() {
			return this.trigger();
		}
	}]);

	return EventSystem;
}();
/*!
 * ajaxModule
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * An object that fetches data via
 * ajax post or get at a set interval
 */


var AjaxModule = function (_EventSystem) {
	_inherits(AjaxModule, _EventSystem);

	/**
  * Constructor
  * @param {object} options
  * @param {number} [options.interval=10000] - the interval in which to make each request
  * @param {jQuery} [options.request=null] - if passed, this request
  * object will be used for AjaxModule's request, ignoring other options
  * @param {boolean} [options.async=true] - whether the request is async
  * @param {string} [options.url] - the request url
  * @param {string} [options.type='GET'] - the request type
  * @param {string} [options.dataType='json'] - the expected data type
  * @param {object|string} [options.data] - data to send with the req header
  * @param {string} [options.username] - username to use with request
  * @param {string} [options.password] - password to use with request
  * @returns {AjaxModule}
  */
	function AjaxModule(options) {
		var _ret;

		_classCallCheck(this, AjaxModule);

		if (!isDefined(options)) throw new ReferenceError("AjaxModule.constructor: must pass an options object or an AJAX call");

		var _this = _possibleConstructorReturn(this, (AjaxModule.__proto__ || Object.getPrototypeOf(AjaxModule)).call(this));

		var defaults = {
			request: null,
			interval: 10000,
			// request properties
			async: true,
			url: '',
			data: '',
			dataType: 'json',
			type: 'GET',
			username: '',
			password: ''
		};

		_this.settings = $.extend(defaults, options);
		_this.interval = null;
		_this.isFirstUpdate = true;
		_this._cachedData = {};

		_this._request = _this.settings.request ? _this._useRequest.bind(_this) : _this._useOptions.bind(_this);

		return _ret = _this, _possibleConstructorReturn(_this, _ret);
	}

	/**
  * Makes the request
  * @returns {jQuery}
  * @private
  */


	_createClass(AjaxModule, [{
		key: '_req',
		value: function _req() {
			var self = this;

			return this._request().done(function (data) {
				self._cacheData(data);
				data = self._processData(data);
				self._done(data);
				self.trigger('done', data);
			}).fail(function (err) {
				self._fail(err);
				self.trigger('fail', err);
			}).always(function () {
				self._always();
				self.trigger('always');
				self.isFirstUpdate = false;
			});
		}

		/**
   * Uses the request provided in the
   * constructor options
   * @returns {jQuery}
   * @private
   */

	}, {
		key: '_useRequest',
		value: function _useRequest() {
			return this.settings.request();
		}

		/**
   * Uses the settings provided in the
   * constructor options to make a req
   * @returns {jQuery}
   * @private
   */

	}, {
		key: '_useOptions',
		value: function _useOptions() {
			var s = this.settings;
			return $.ajax({
				type: s.type,
				url: s.url,
				dataType: s.dataType,
				async: s.async,
				username: s.username,
				password: s.password,
				data: s.data
			});
		}

		/**
   * Success callback
   * @param {*} data
   * @private
   * @abstract
   */

	}, {
		key: '_done',
		value: function _done(data) {}
		// implement in child


		/**
   * Fail callback
   * @param {object} err
   * @private
   * @abstract
   */

	}, {
		key: '_fail',
		value: function _fail(err) {}
		// implement in child


		/**
   * Always callback
   * @private
   */

	}, {
		key: '_always',
		value: function _always() {}
		// implement in child


		/**
   * Cache data
   * @param {object} data
   * @returns {AjaxModule}
   * @private
   */

	}, {
		key: '_cacheData',
		value: function _cacheData(data) {
			this._cachedData = $.extend(true, {}, data);
			return this;
		}

		/**
   * Process received data
   * @param {object} data
   * @returns {object}
   * @private
   */

	}, {
		key: '_processData',
		value: function _processData(data) {
			return data;
		}

		/**
   * Start the interval
   * @returns {jQuery}
   */

	}, {
		key: 'start',
		value: function start() {
			this.interval = setInterval(this._req.bind(this), this.settings.interval);
			return this._req();
		}

		/**
   * Stops the interval
   * @returns {AjaxModule}
   */

	}, {
		key: 'stop',
		value: function stop() {
			clearInterval(this.interval);
			return this;
		}
	}]);

	return AjaxModule;
}(EventSystem);
/*!
 * ajaxPoll
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * Poll a url until a desired
 * result is found within its response
 * @extends AjaxModule
 */


var AjaxPoll = function (_AjaxModule) {
	_inherits(AjaxPoll, _AjaxModule);

	/**
  * Constructor
  * @param {object} options
  * @param {string} options.url - url to poll
  * @param {number} [options.maxPolls=10] - max poll attempts
  * @param {number} [options.maxFails=10]- max failures
  * @param {function|number|string} [options.expectation=1] - the expected value of the data response,
  * or a function to run that returns a boolean based on the data
  * @returns {AjaxPoll}
  */
	function AjaxPoll(options) {
		var _ret2;

		_classCallCheck(this, AjaxPoll);

		var defaults = {
			url: '',
			maxPolls: 10,
			maxFails: 10,
			expectation: 1
		};

		var _this2 = _possibleConstructorReturn(this, (AjaxPoll.__proto__ || Object.getPrototypeOf(AjaxPoll)).call(this, $.extend(defaults, options)));

		_this2.polls = 0;
		_this2.fails = 0;
		_this2.dfd = $.Deferred();

		return _ret2 = _this2, _possibleConstructorReturn(_this2, _ret2);
	}

	/**
  * Request success handler.
  * Checks if the data is what was desired
  * @param {*} data
  * @returns {AjaxPoll}
  * @private
  */


	_createClass(AjaxPoll, [{
		key: '_done',
		value: function _done(data) {
			this._checkExpectation(data);
			return this;
		}

		/**
   * Request failure handler
   * @param {object} err
   * @returns {AjaxPoll}
   * @private
   */

	}, {
		key: '_fail',
		value: function _fail(err) {
			if (this.settings.maxFails > 0) {
				this.fails++;
				this._checkFailure();
			}
			return this;
		}

		/**	
   * Request always handler
   * @returns {AjaxPoll}
   * @private
   */

	}, {
		key: '_always',
		value: function _always() {
			if (this.settings.maxPolls > 0) {
				this.polls++;
				this._checkPolls();
			}
			return this;
		}

		/**
   * Check if the data retrieved
   * matches the desired data
   * @param {*} data
   * @returns {AjaxPoll}
   * @private
   */

	}, {
		key: '_checkExpectation',
		value: function _checkExpectation(data) {
			var exp = this.settings.expectation;
			if (exp === data || typeof exp === 'function' && exp(data)) {
				this.dfd.resolve(data);
				this.stop();
			}
			return this;
		}

		/**
   * Check if the maximum amount
   * of polls has been reached.
   * If it has, the request is rejected
   * @returns {AjaxPoll}
   * @private
   */

	}, {
		key: '_checkPolls',
		value: function _checkPolls() {
			if (this.polls >= this.settings.maxPolls) {
				this.dfd.reject();
				this.stop();
			}
			return this;
		}

		/**
   * Check if the maximum amount
   * of failures has been reached.
   * If it has, the request is rejected
   * @returns {AjaxPoll}
   * @private
   */

	}, {
		key: '_checkFailure',
		value: function _checkFailure() {
			if (this.fails >= this.settings.maxFails) {
				this.dfd.reject();
				this.stop();
			}
			return this;
		}

		/**
   * Start polling
   * @returns {*}
   */

	}, {
		key: 'start',
		value: function start() {
			_get(AjaxPoll.prototype.__proto__ || Object.getPrototypeOf(AjaxPoll.prototype), 'start', this).call(this);
			return this.dfd.promise();
		}
	}]);

	return AjaxPoll;
}(AjaxModule);
/*!
 * ajaxMonitor
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * Monitors all ajax requests made in the application.
 * If enough requests fail in a certain time frame,
 * AjaxMonitor determines the connection to be lost.
 * It then begins a heartbeat and blocks all other requests
 * until at least on heartbeat requests is responded to
 */


var AjaxMonitor = function (_EventSystem2) {
	_inherits(AjaxMonitor, _EventSystem2);

	/**
  * Constructor
  * @param {object} options
  * @param {string} options.heartbeatUrl - URL to send a heartbeat req to
  * @param {number} [options.maxFailures=4] - the max amount of ajax failures
  * that can occur in the ajaxTimeout setting, before the monitor determines
  * the connection ist lost
  * @param {number} [options.resetTimer=10000] - the time in which the max amount of
  * failures can occur before the monitor determines the connection is lost
  * @param {number} [options.ajaxTimeout=0] - the global timeout for all ajax reqs
  * @param {boolean} [options.abortOnDisconnecttrue] - whether to abort all requests
  * before they can be made if AjaxMonitor is "disconnected"
  * @returns {AjaxMonitor}
  */
	function AjaxMonitor(options) {
		var _ret3;

		_classCallCheck(this, AjaxMonitor);

		if (!isDefined(options)) throw new ReferenceError("AjaxMonitor.constructor: options.heartbeatUrl argument is required.");

		var _this3 = _possibleConstructorReturn(this, (AjaxMonitor.__proto__ || Object.getPrototypeOf(AjaxMonitor)).call(this));

		var self = _this3;
		var defaults = {
			heartbeatUrl: '',
			maxFailures: 4,
			ajaxTimeout: 0,
			resetTimer: 10000,
			abortOnDisconnect: true
		};
		_this3.settings = $.extend(defaults, options);

		// set up a heart beat for determining
		// connection status. Don't start it yet.
		_this3.heartbeat = new AjaxModule({
			url: _this3.settings.heartbeatUrl,
			data: { heartbeat: 1 },
			interval: 5000
		});

		_this3.interval = null;
		_this3.failures = 0;
		_this3.isConnected = true;

		// set the global ajax timeout
		if (_this3.settings.ajaxTimeout > 0) $.ajaxSetup({ timeout: _this3.settings.ajaxTimeout });

		// intercept all ajax requests
		(function (open) {
			XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
				this.addEventListener("readystatechange", function () {
					if (this.readyState === 1) {
						// stop all ajax attempts if we're disconnected
						// but allow heartbeat to always go through
						if (self.settings.abortOnDisconnect && !self.isConnected && url.indexOf('heartbeat') === -1) {
							this.abort();
						}
					}
				}, false);
				this.addEventListener("abort", function () {
					self._fail();
				}, false);
				this.addEventListener("error", function () {
					self._fail();
				}, false);
				this.addEventListener("timeout", function () {
					self._fail();
				}, false);
				this.addEventListener("load", function () {
					self._done();
				}, false);
				return open.apply(this, arguments);
			};
		})(XMLHttpRequest.prototype.open);

		return _ret3 = _this3, _possibleConstructorReturn(_this3, _ret3);
	}

	/**
  * Success handler when any
  * ajax req is successful
  * @returns {AjaxMonitor}
  * @private
  */


	_createClass(AjaxMonitor, [{
		key: '_done',
		value: function _done() {
			this.failures = 0;
			this.checkLimit();
			return this;
		}

		/**
   * Failure handler when
   * any ajax req fails
   * @returns {AjaxMonitor}
   * @private
   */

	}, {
		key: '_fail',
		value: function _fail() {
			this.failures++;
			this.checkLimit();
			return this;
		}

		/**
   * Start the monitor
   * @returns {AjaxMonitor}
   */

	}, {
		key: 'start',
		value: function start() {
			this.interval = setInterval(this.reset, this.settings.interval);
			return this;
		}

		/**
   * Stop the monitor
   * @returns {AjaxMonitor}
   */

	}, {
		key: 'stop',
		value: function stop() {
			clearInterval(this.interval);
			return this;
		}

		/**
   * Reset the recorded failure count
   * @returns {AjaxMonitor}
   */

	}, {
		key: 'reset',
		value: function reset() {
			this.failures = 0;
			return this;
		}

		/**
   * Check if enough failures have occurred
   * in the given time frame
   * @returns {AjaxMonitor}
   */

	}, {
		key: 'checkLimit',
		value: function checkLimit() {
			var prevState = this.isConnected;
			this.isConnected = this.failures <= this.settings.maxFailures;

			// only trigger on change from prev state
			if (prevState !== this.isConnected) {
				if (this.isConnected) {
					this.trigger('connected');
					this.start();
					this.heartbeat.stop();
				} else {
					this.trigger('disconnected');
					this.stop();
					this.heartbeat.start();
				}
			}
			return this;
		}
	}]);

	return AjaxMonitor;
}(EventSystem);
/*!
 * ajaxQueue
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * A queue of reqs that allows only one
 * request to run at a time
 * @extends EventSystem
 */


var AjaxQueue = function (_EventSystem3) {
	_inherits(AjaxQueue, _EventSystem3);

	/**
  * Constructor
  * @param {object} [options]
  * @param {number} [options.size=100] - size of the queue
  * @param {number} [options.timeout=0] - timeout between requests in ms
  * @param {boolean} [options.abortOnFail=false] - whether to abandon the queue if one request fails
  * @returns {AjaxQueue}
  */
	function AjaxQueue(options) {
		var _ret4;

		_classCallCheck(this, AjaxQueue);

		var _this4 = _possibleConstructorReturn(this, (AjaxQueue.__proto__ || Object.getPrototypeOf(AjaxQueue)).call(this));

		var defaults = {
			size: 100,
			timeout: 0,
			abortOnFail: false
		};
		_this4.settings = $.extend(defaults, options);
		_this4.queue = [];
		_this4.inProgress = false;

		return _ret4 = _this4, _possibleConstructorReturn(_this4, _ret4);
	}

	/**
  * Run the next request
  * @private
  */


	_createClass(AjaxQueue, [{
		key: '_next',
		value: function _next() {
			var timeout = this.settings.timeout;
			this.inProgress = false;
			if (timeout > 0) setTimeout(this.dequeue.bind(this), timeout);else this.dequeue();
			return this;
		}

		/**
   * Enqueue a request.
   * Dequeues all requests immediately after
   * @param {jQuery|jQuery[]} arguments - the request(s)
   * @returns {AjaxQueue}
   */

	}, {
		key: 'enqueue',
		value: function enqueue() {
			var args = arguments.length > 0 ? Array.prototype.slice.call(arguments) : arguments[0];

			if (this.queue.length <= this.settings.size) {
				this.queue.push(args);
				this.dequeue();
			} else {
				console.warn("AjaxQueue.enqueue: queue size is at limit");
			}

			return this;
		}

		/**
   * Dequeue all requests.
   * Requests fire on previous always()
   * @returns {AjaxQueue}
   */

	}, {
		key: 'dequeue',
		value: function dequeue() {
			if (this.queue.length > 0 && !this.inProgress) {
				var self = this;
				var req = this.queue.pop();

				req().fail(function () {
					if (self.settings.abortOnFail) {
						self.queue = [];
						return this;
					} else {
						self._next();
					}
				}).done(function () {
					self._next();
				});
			}
			return this;
		}
	}]);

	return AjaxQueue;
}(EventSystem);