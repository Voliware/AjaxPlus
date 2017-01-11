
var json = {
	heartbeat : '../heartbeat.json',
	simple : '../simple.json'
};

function request(){
	return $.post(json.simple);
}

function requestWithHandlers(){
	return request().done(function(data){
		console.log(data);
	});
}

// basic ajax queue
var queue = new AjaxQueue({size:10})
	.enqueue(request)
	.enqueue(request, request);

// ajax queue with request delay
var queueDelay = new AjaxQueue({size:3, delay:3000})
	.enqueue(request, requestWithHandlers, request);

/**
 * All requests will
 * get routed through Server
 */
class Server {
	static get(params = {}){
		var dfd = $.Deferred();
		Server.queue.enqueue(get);
		return dfd.promise();

		function get(){
			return $.get(json.simple, params)
				.done(function(){
					dfd.resolve();
				})
				.fail(function(){
					dfd.reject();
				})
		}
	}
}

Server.queue = new AjaxQueue();

/**
 * All routes will send
 * requests through Server
 */
class Route {
	static get(params = {}){
		params.route = 'routeA';
		return Server.get(params);
	}
}

Route.get().done(function(data){
	console.log("success")
});