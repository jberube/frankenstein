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

describe('user\'s code', function() {
	var browser, harness;

	beforeEach(function (done) {
		harness = server_harness.harness('server/server', { debug: false})
			.on('message', function (message, sendHandle) {
				if (message === 'ready') {
					browser = new Browser(browserOptions);
					done();
				}
			});
	});

	afterEach(function () {
		browser = null;
		if (harness.connected) harness.disconnect();
	});
	
	it('is displayed in ide when page loads', function (done) {
		this.timeout(4000);
		browser.visit('web/index.html')
			.then(function () {
				browser.wait(3000, function () {
					assert.equal(browser.text('#ide-code'), 'my.last.saved(code);');
					done();
				});
			})
			.then(null, done);
	});
	
	it('can be saved', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				return browser.fill('#ide-code', 'some.new(code);').pressButton('#save');
			}).then(function () {
				return browser.visit('web/index.html');
			}).then(function () {
				return browser.wait(1000);
			}).then(function () {
				assert.equal(browser.text('#ide-code'), 'some.new(code);');
			}).then(done, done);
	});
		
	it('can be saved to the server');

	it('can be reloaded from to the server');
});

