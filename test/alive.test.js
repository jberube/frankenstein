var Browser = require("zombie"),
	assert = require("assert"),
	server_harness = require('./lib/server_harness');

var browserOptions = { 
	debug: false, 
	runScripts: true,
	site: 'http://127.0.0.1:8080/'
};

process.on('error', function (err) {
	console.trace('error in parent:', err);
});

describe('frankenstein', function () {
	var browser, harness;

	beforeEach(function (done){
		harness = server_harness.harness('server/server', { debug: false})
			.on('message', function (message, sendHandle) {
				if (message === 'ready') {
					browser = new Browser(browserOptions);
					done();
				}
			});
	});

	afterEach(function (){
		browser = null;
		if (harness.connected) harness.disconnect();
	});
	
	it('is alive!', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				assert(browser.success, 'huho, didn\'t succeeded.');
				done();
			});
	});
	
	it('can assert something in the DOM of a web page', function (done) {
		browser.visit('web/index.html')
			.then(function() {
				assert.equal(browser.text('#ide-status'), '');

				browser
					.fill('*#ide-code', 'some(code);')
					.pressButton('#ide-save')
					.then(function () {
    	  		assert.equal(browser.text('#ide-status'), 'saved');
    	  	});
			})
			.then(done, done);
	});
});
