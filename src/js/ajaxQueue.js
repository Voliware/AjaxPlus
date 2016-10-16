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
class AjaxQueue extends EventSystem {

	/**
	 * Constructor
	 * @param {object} [options]
	 * @param {number} [options.size=100] - size of the queue
	 * @param {number} [options.timeout=0] - timeout between requests in ms
	 * @param {boolean} [options.abortOnFail=false] - whether to abandon the queue if one request fails
	 * @returns {AjaxQueue}
	 */
	constructor(options){
		super();

		var defaults = {
			size : 100,
			timeout : 0,
			abortOnFail : false
		};
		this.settings = $.extend(defaults, options);
		this.queue = [];
		this.inProgress = false;

		return this;
	}

	/**
	 * Run the next request
	 * @private
	 */
	_next(){
		var timeout = this.settings.timeout;
		this.inProgress = false;
		if(timeout > 0)
			setTimeout(this.dequeue.bind(this), timeout);
		else
			this.dequeue();
		return this;
	}

	/**
	 * Enqueue a request.
	 * Dequeues all requests immediately after
	 * @param {jQuery|jQuery[]} arguments - the request(s)
	 * @returns {AjaxQueue}
	 */
	enqueue(){
		var args = arguments.length > 0
	 		? Array.prototype.slice.call(arguments)
			: arguments[0];

		if(this.queue.length <= this.settings.size){
			this.queue.push(args);
			this.dequeue();
		}
		else{
			console.warn("AjaxQueue.enqueue: queue size is at limit");
		}

		return this;
	}

	/**
	 * Dequeue all requests.
	 * Requests fire on previous always()
	 * @returns {AjaxQueue}
	 */
	dequeue(){
		if(this.queue.length > 0 && !this.inProgress){
			var self = this;
			var req = this.queue.pop();

			req().fail(function(){
					if(self.settings.abortOnFail){
						self.queue = [];
						return this;
					}
					else{
						self._next();
					}
				})
				.done(function(){
					self._next();
				});
		}
		return this;
	}
}