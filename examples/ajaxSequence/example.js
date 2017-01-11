// fake server data
var json = {
	simple : '../simple.json'
};

// requests
function requestA(){
	return $.get(json.simple)
		.done(function(data){
			console.log('Request A complete');
			console.log(data)
		});
}

function requestB(){
	return $.post(json.simple)
		.done(function(data){
			console.log('Request B complete');
		});
}

function requestC(){
	return $.get(json.simple)
		.done(function(data){
			console.log('Request C complete');
		});
}

var ajaxSequence = new AjaxSequence({
		abortOnFail : false
	})
	.enqueue(requestA)
	.enqueue(requestB, requestC);

$(document).ready(function(){
	// dequeue all requests
	ajaxSequence.dequeue()
		.done(function(data){
			console.log('All requests done');
			console.log('Array of retrieved data is :');
			console.log(data);
		})
		.fail(function(){
			console.error('At least one request failed, aborting');
		})
		.always(function(){
			console.log('Sequence complete');
		});
});