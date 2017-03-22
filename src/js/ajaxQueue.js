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
	 * @param {number} [options.delay=0] - delay between requests in ms
	 * @param {number} [options.activeRequestLimit=1] - how many requests can fire at once (be dequeued)
	 * @param {boolean} [options.abortOnFail=false] - whether to abandon the queue if one request fails
	 * @returns {AjaxQueue}
	 */
	constructor(options){
		super();

		var defaults = {
			size : 100,
			delay : 0,
			activeRequestLimit : 1,
			abortOnFail : false
		};

		// properties
		this.queue = [];
		this.settings = $.extend(defaults, options);
		this.activeRequests = 0;

		return this;
	}

	/**
	 * Run the next request
	 * @private
	 */
	_next(){
		if(this.settings.delay > 0)
			setTimeout(this.dequeue.bind(this), this.settings.delay);
		else
			this.dequeue();
		return this;
	}

	/**
	 * Enqueue a request.
	 * Dequeues all requests immediately after
	 * @param {...jQuery}  arguments - the request(s)
	 * @returns {AjaxQueue}
	 */
	enqueue(){
		if(this.queue.length < this.settings.size){
			this.queue.push(...arguments);
			this.dequeue();
		}
		else{
			console.warn("AjaxQueue.enqueue: queue size is at limit");
		}

		return this;
	}

	/**
	 * Dequeue all requests.
	 * Requests fire on previous done() or fail()
	 * @returns {AjaxQueue}
	 */
	dequeue(){
		if(this.queue.length > 0 && this.activeRequests < this.settings.activeRequestLimit){
			var self = this;
			var req = this.queue.pop();
			this.activeRequests++;

			req()
				.done(function(){
					self.activeRequests--;
					self._next();
				})
				.fail(function(){
					self.activeRequests--;
					if(self.settings.abortOnFail){
						self.queue = [];
						self.activeRequests = 0;
						return this;
					}
					else{
						self._next();
					}
				});
		}
		return this;
	}
}