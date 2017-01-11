/*!
 * ajaxSequence
 * https://github.com/Voliware/AjaxPlus
 * Licensed under the MIT license.
 */

/**
 * Like a queue, builds up an array of ajax requests
 * and only fires them when dequeue is called.
 * Returns a promise when all requests are complete.
 * Pushes each request data (done or fail) into an array.
 * @extends AjaxQueue
 */
class AjaxSequence extends AjaxQueue {

	/**
	 * Constructor
	 * @param {object} [options]
	 * @returns {AjaxSequence}
	 */
	constructor(options){
		super(options);

		// properties
		this.currentRequest = 0;
		this.requestData = [];

		return this;
	}

	/**
	 * Enqueue a request
	 * @param {...jQuery}  arguments - the request(s)
	 * @returns {AjaxSequence}
	 */
	enqueue(){
		if(this.queue.length <= this.settings.size)
			this.queue.push(...arguments);
		else
			console.warn("AjaxSequence.enqueue: queue size is at limit");

		return this;
	}

	/**
	 * Dequeue all requests in order and
	 * return a promise when all is complete
	 * @param {jQuery} [defer] - deferred object to be returned
	 * @returns {jQuery} deferred promise
	 */
	dequeue(defer = $.Deferred()){
		var self = this;

		// queue is done, reset and resolve
		if(this.queue.length === this.currentRequest){
			// clone data so it can be reset
			var requestData = this.requestData;
			this.currentRequest = 0;
			this.requestData = [];
			defer.resolve(requestData);
		}
		else {
			this.queue[this.currentRequest]()
				.done(function(data){
					onComplete(data);
				})
				.fail(function(data){
					if(self.settings.abortOnFail)
						defer.reject();
					else
						onComplete(data);
				});
		}

		return defer.promise();

		/**
		 * On complete handler for both fail and done
		 */
		function onComplete(data){
			self.currentRequest++;
			self.requestData.push(data);
			self.dequeue(defer);
		}
	}
}