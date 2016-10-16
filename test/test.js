var expect = chai.expect;

var json = {
	heartbeat : 'heartbeat.json',
	simple : 'simple.json'
};

function request(){
	return $.post(json.simple);
}

// AjaxModule

describe("AjaxModule", function() {
	describe("constructor", function() {
		it("should throw an error if no options.url is provided", function() {
			expect(function() {
				(new AjaxModule());
			}).to.throw(ReferenceError);
		});
		// defaults
		it("should have a default async setting", function() {
			var a = new AjaxModule({url:''});
			expect(a.settings.async).to.equal(true);
		});
		it("should have a default interval", function() {
			var a = new AjaxModule({url:''});
			expect(a.settings.interval).to.equal(10000);
		});
		it("should have a default type", function() {
			var a = new AjaxModule({url:''});
			expect(a.settings.type).to.equal("GET");
		});
		it("should have a default dataType", function() {
			var a = new AjaxModule({url:''});
			expect(a.settings.dataType).to.equal("json");
		});

		// options
		it("should set the async setting if provided", function() {
			var a = new AjaxModule({url:'', async:false});
			expect(a.settings.async).to.equal(false);
		});
		it("should set the interval if provided", function() {
			var a = new AjaxModule({url:'', interval:55});
			expect(a.settings.interval).to.equal(55);
		});
		it("should set the type if provided", function() {
			var a = new AjaxModule({url:'', type:'POST'});
			expect(a.settings.type).to.equal("POST");
		});
		it("should set the dataType if provided", function() {
			var a = new AjaxModule({url:'', dataType:'xml'});
			expect(a.settings.dataType).to.equal("xml");
		});

		// request
		it("accept a jQuery ajax request as an argument", function() {
			var a = new AjaxModule({request:request});
			expect(a.settings.request).to.equal(request);
		});
	});
	describe("start", function() {
		it("should set the interval", function() {
			var a = new AjaxModule({url:''});
			a.start();
			expect(a.interval).to.be.a('number');
			a.stop();
		});
		it("should return a jquery deferred object when constructed with a request", function() {
			var a = new AjaxModule({request:request});
			var s = a.start();
			expect(s).to.have.ownProperty('readyState');
			a.stop();
		});
		it("should return a jquery deferred object when constructed with options", function() {
			var a = new AjaxModule({url:''});
			var s = a.start();
			expect(s).to.have.ownProperty('readyState');
			a.stop();
		});
	});
	describe("stop", function() {
		// defaults
		it("should clear the interval", function() {
			var a = new AjaxModule({url:''}).stop();
			expect(a.interval).to.equal(null);
		});
	});
});

// AjaxMonitor
describe("AjaxMonitor", function() {
	describe("constructor", function() {
		it("should throw an error if the heartbeat url is not defined", function() {
			expect(function() {
				(new AjaxMonitor());
			}).to.throw(ReferenceError);
		});
		// defaults
		it("should have a default max failure limit", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			expect(a.settings.maxFailures).to.equal(4);
		});
		it("should have a default timer", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			expect(a.settings.resetTimer).to.equal(10000);
		});
		// options
		it("should set the max failure limit if provided", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat, maxFailures : 55});
			expect(a.settings.maxFailures).to.equal(55);
		});
		it("should set the interval limit if provided", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat, interval : 666});
			expect(a.settings.interval).to.equal(666);
		});
		it("should set the heartbeat url", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			expect(a.heartbeat.settings.url).to.equal(json.heartbeat);
		});
		it("should allow the heartbeat even when it is disconnected", function(done) {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.isConnected = false;
			a.heartbeat.start()
				.then(
					function (data) {
						expect(data.status).to.equal(1);
						done();
					},
					function (err) {
						done(err);
					}
				);
		});
		it("should reject requests when it is disconnected", function(done) {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.isConnected = false;
			var b = new AjaxModule({url:json.simple});
			expect(b.start().readyState).to.equal(0);
			done();
			b.stop();
		});
	});
	describe("checkLimit", function() {
		it("should set isConnected to true if max failures is not reached", function() {
			var a = new AjaxMonitor({url : json.heartbeat});
			a.failures = 1;
			a.checkLimit();
			expect(a.isConnected).to.equal(true);
		});
		it("should emit 'connected' event if it was previously disconnected, and a request then succeeded", function() {
			var res = {e:false};
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.on('connected', function(){
				res.e = 152;
			});
			a.failures = 5;
			a.checkLimit();
			a._done();
			expect(res.e).to.equal(152);
		});
		it("should set isConnected to false if max failures is reached", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.failures = 5;
			a.checkLimit();
			expect(a.isConnected).to.equal(false);
		});
		it("should emit 'disconnected' event if it was previously connected and if max failures is reached", function() {
			var res = {e:false};
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.on('disconnected', function (){
				res.e = 636;
			});
			for(var i = 0; i < a.settings.maxFailures + 1; i++){
				a._fail();
			}
			expect(res.e).to.equal(636);
		});
		it("should start the heartbeat when it is disconnected", function() {
			var a = new AjaxMonitor({heartbeatUrl : json.heartbeat});
			a.failures = 5;
			a.checkLimit();
			expect(a.heartbeat.interval).to.be.a('number');
		});
	});
});