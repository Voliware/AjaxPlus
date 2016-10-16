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
class AjaxMonitor extends EventSystem {

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
	constructor(options){
		if (!isDefined(options))
			throw new ReferenceError("AjaxMonitor.constructor: options.heartbeatUrl argument is required.");

		super();
		var self = this;
		var defaults = {
			heartbeatUrl : '',
			maxFailures : 4,
			ajaxTimeout : 0,
			resetTimer : 10000,
			abortOnDisconnect : true
		};
		this.settings = $.extend(defaults, options);

		// set up a heart beat for determining
		// connection status. Don't start it yet.
		this.heartbeat = new AjaxModule({
			url : this.settings.heartbeatUrl,
			data : {heartbeat:1},
			interval : 5000
		});

		this.interval = null;
		this.failures = 0;
		this.isConnected = true;

		// set the global ajax timeout
		if(this.settings.ajaxTimeout > 0)
			$.ajaxSetup({timeout : this.settings.ajaxTimeout});

		// intercept all ajax requests
		(function(open) {
			XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
				this.addEventListener("readystatechange", function() {
					if(this.readyState === 1){
						// stop all ajax attempts if we're disconnected
						// but allow heartbeat to always go through
						if(self.settings.abortOnDisconnect && !self.isConnected && url.indexOf('heartbeat') === -1){
							this.abort();
						}
					}
				}, false);
				this.addEventListener("abort", function() {
					self._fail();
				}, false);
				this.addEventListener("error", function() {
					self._fail();
				}, false);
				this.addEventListener("timeout", function() {
					self._fail();
				}, false);
				this.addEventListener("load", function() {
					self._done();
				}, false);
				return open.apply(this, arguments);
			};
		})(XMLHttpRequest.prototype.open);

		return this;
	}

	/**
	 * Success handler when any
	 * ajax req is successful
	 * @returns {AjaxMonitor}
	 * @private
	 */
	_done(){
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
	_fail(){
		this.failures++;
		this.checkLimit();
		return this;
	}

	/**
	 * Start the monitor
	 * @returns {AjaxMonitor}
	 */
	start(){
		this.interval = setInterval(this.reset, this.settings.interval);
		return this;
	}

	/**
	 * Stop the monitor
	 * @returns {AjaxMonitor}
	 */
	stop(){
		clearInterval(this.interval);
		return this;
	}

	/**
	 * Reset the recorded failure count
	 * @returns {AjaxMonitor}
	 */
	reset(){
		this.failures = 0;
		return this;
	}

	/**
	 * Check if enough failures have occurred
	 * in the given time frame
	 * @returns {AjaxMonitor}
	 */
	checkLimit(){
		var prevState = this.isConnected;
		this.isConnected = this.failures <= this.settings.maxFailures;

		// only trigger on change from prev state
		if(prevState !== this.isConnected) {
			if (this.isConnected){
				this.trigger('connected');
				this.start();
				this.heartbeat.stop();
			}
			else{
				this.trigger('disconnected');
				this.stop();
				this.heartbeat.start();
			}
		}
		return this;
	}
}