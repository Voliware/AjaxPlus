/*!
 * ajaxModule
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * An object that fetches data via
 * ajax post or get at a set interval
 */
class AjaxModule extends EventSystem {

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
    constructor(options){
		if (!isDefined(options))
			throw new ReferenceError("AjaxModule.constructor: must pass an options object");

		super();
			var defaults = {
				request : null,
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

		// properties
		this.settings = $.extend(defaults, options);
        this.interval = null;
		this._cachedData = {};

		// states
		this.isFirstUpdate = true;

		// determine which request to use
		this._request = this.settings.request
			? this._useRequest.bind(this)
			: this._useOptions.bind(this);

        return this;
    }

	/**
	 * Makes the request
	 * @returns {jQuery}
	 * @private
	 */
	_req(){
		var self = this;

		return this._request()
			.done(function(data){
				self._cacheData(data);
				data = self._processData(data);
				self._done(data);
			})
			.fail(function(data){
				self._fail(data);
			})
			.always(function(){
				self._always();
				self.isFirstUpdate = false;
			});
	}

	/**
	 * Uses the request provided in the
	 * constructor options
	 * @returns {jQuery}
	 * @private
	 */
	_useRequest(){
		return this.settings.request()
	}

	/**
	 * Uses the settings provided in the
	 * constructor options to make a req
	 * @returns {jQuery}
	 * @private
	 */
	_useOptions(){
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
	 * @returns {AjaxModule}
	 * @private
	 */
	_done(data){
		this.trigger('done', data);
		return this;
	}

	/**
	 * Fail callback
	 * @param {*} data
	 * @returns {AjaxModule}
	 * @private
	 */
	_fail(data){
		this.trigger('fail', data);
		return this;
	}

	/**
	 * Always callback
	 * @returns {AjaxModule}
	 * @private
	 */
	_always(){
		this.trigger('always');
		return this;
	}

	/**
	 * Cache data
	 * @param {object} data
	 * @returns {AjaxModule}
	 * @private
	 */
	_cacheData(data){
		this._cachedData = $.extend(true, {}, data);
		return this;
	}

	/**
	 * Process received data
	 * @param {object} data
	 * @returns {object}
	 * @private
	 */
	_processData(data){
		return data;
	}

	/**
	 * Start the interval
	 * @returns {jQuery}
	 */
    start(){
        this.interval = setInterval(this._req.bind(this), this.settings.interval);
        return this._req();
    }

	/**
	 * Stops the interval
	 * @returns {AjaxModule}
	 */
    stop(){
        clearInterval(this.interval);
        return this;
    }
}