var Browser = require("zombie"),
	assert = require("assert"),
	child_process = require('child_process');

var baseUrl = 'http://127.0.0.1:8080/'; // local
//var baseUrl = 'http://julienberube.kd.io/'; // Koding

process.on('error', function (err) {
	console.log('error in parent:', err);
});

describe('frankenstein', function () {
	var browser;
	var server;

	beforeEach(function (done){
		server = child_process.fork('server/server.js');
		server.on('error', function(err) {
			console.error('PARENT child process error:', err);
		});
		server.on('exit', function(code, signal) {
			console.log('PARENT child process exit:', code, signal);
		});
		server.on('close', function(code, signal) {
			console.log('PARENT child process close:', code, signal);
		});
		server.on('disconnect', function(code, signal) {
			console.log('PARENT child process disconnect:', code, signal);
		});
		server.on('message', function(message, sendHandle) {
			console.log('PARENT child process message:', message, sendHandle);
			if (message === 'ready') {
				browser = new Browser({ 
					debug: true, 
					runScripts: true,
					site: baseUrl
				});

				done();
			}
		});
	});

	afterEach(function (){
		browser = null;
		
		console.log('PARENT child is connected?: ', server.connected);
		if (server.connected) {
			console.log('PARENT disconnecting the child...');
			server.disconnect();
		}
	});
	
	it('is alive!', function (done) {
		this.timeout(2000);
		browser.visit('web/index.html')
			.then(function () {
				assert(browser.success, 'huho, didn\'t succeeded.');
				done();
			});
	});
	
	/*
	it('can assert something in the DOM of a web page', function (done) {
		console.log('2');
		//todo: move to beforeEach
		//this.timeout(2000);
		
		browser
			.visit('web/index.html')
			.then(function () {
				console.log("The page:\n", browser.html());
				console.log("success?:\n", browser.success);
				done();
			});
			.then(function () {
				return browser
					.fill('*#ide-code', 'unicorn')
					.pressButton('#save');
			})
			.then(function() {
    	  assert.equal(browser.text('H1'), 'unicorn');
			})
			.fail(function (err) {
				console.log(err);
				if (err) throw err;
				done();
			});
 	 		//.finally(done);
		});
		*/
});
