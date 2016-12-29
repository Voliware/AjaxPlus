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
	 * @param {boolean} [options.abortOnFail=false] - whether to abandon the queue if one request fails
	 * @returns {AjaxQueue}
	 */
	constructor(options){
		super();

		var defaults = {
			size : 100,
			delay : 0,
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
		this.inProgress = false;
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
		if(this.queue.length <= this.settings.size){
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
	 * Requests fire on previous always()
	 * @returns {AjaxQueue}
	 */
	dequeue(){
		if(this.queue.length > 0 && !this.inProgress){
			var self = this;
			var req = this.queue.pop();

			req()
				.fail(function(){
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