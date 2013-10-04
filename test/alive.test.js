var Browser = require("zombie"),
	assert = require("assert"),
	server_harness = require('./lib/server_harness');

var baseUrl = 'http://127.0.0.1:8080/'; // local
//var baseUrl = 'http://julienberube.kd.io/'; // Koding

process.on('error', function (err) {
	console.trace('error in parent:', err);
});

describe('frankenstein', function () {
	var browser;
	var server;

	beforeEach(function (done){
		harness = server_harness.harness('server/server', { debug: false});
		harness.on('message', function(message, sendHandle) {
			console.log('PARENT child process message:', message, sendHandle);
			if (message === 'ready') {
				browser = new Browser({ 
					debug: false, 
					runScripts: true,
					site: baseUrl
				});
				done();
			}
		});
	});

	afterEach(function (){
		browser = null;
		if (harness.connected) {
			harness.disconnect();
		}
	});
	
	it('is alive!', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				assert(browser.success, 'huho, didn\'t succeeded.');
				done();
			});
	});
	
	it('can assert something in the DOM of a web page', function (done) {
		browser
			.visit('web/index.html')
			.then(function() {
				assert.equal(browser.text('H1'), 'Code');
			})
			.then(function () {
				return browser
					.fill('*#ide-code', 'unicorn')
					.pressButton('#save');
			})
			.then(function() {
    	  assert.equal(browser.text('H1'), 'unicorn');
			})
			.then(done, done);
	});
});

describe('code', function(){
	it('can be loaded from the server');
	
	it('can be saved to the server');
});

