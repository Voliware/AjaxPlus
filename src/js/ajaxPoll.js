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
class AjaxPoll extends AjaxModule {

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
	constructor(options){
		var defaults = {
			url : '',
			maxPolls : 10,
			maxFails : 10,
			expectation : 1
		};
		super($.extend(defaults, options));

		this.polls = 0;
		this.fails = 0;
		this.dfd = $.Deferred();

		return this;
	}

	/**
	 * Request success handler.
	 * Checks if the data is what was desired
	 * @param {*} data
	 * @returns {AjaxPoll}
	 * @private
	 */
	_done(data){
		this._checkExpectation(data);
		return this;
	}

	/**
	 * Request failure handler
	 * @param {object} err
	 * @returns {AjaxPoll}
	 * @private
	 */
	_fail(err){
		if(this.settings.maxFails > 0){
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
	_always(){
		if(this.settings.maxPolls > 0){
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
	_checkExpectation(data){
		var exp = this.settings.expectation;
		if(exp === data || (typeof exp === 'function' && exp(data))){
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
	_checkPolls(){
		if(this.polls >= this.settings.maxPolls){
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
	_checkFailure(){
		if(this.fails >= this.settings.maxFails){
			this.dfd.reject();
			this.stop();
		}
		return this;
	}

	/**
	 * Start polling
	 * @returns {*}
	 */
	start(){
		super.start();
		return this.dfd.promise();
	}
}