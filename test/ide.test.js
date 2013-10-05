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
	
	it('is loaded in ide when page loads', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				return browser.wait(3000);
			}).then(function () {
				assert.equal(browser.text('#ide-code'), 'my.last.saved(code);');
			}).then(done, done);
	});
	
	it('can be saved', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				return browser.fill('#ide-code', 'some.new(code);').pressButton('#ide-save');
			}).then(function () {
				return browser.visit('web/index.html');
			}).then(function () {
				return browser.wait(1000);
			}).then(function () {
				assert.equal(browser.text('#ide-code'), 'some.new(code);');
			}).then(done, done);
	});

	it('can be reloaded from to the server', function (done) {
		browser.visit('web/index.html')
			.then(function () {
				return browser.fill('#ide-code', 'some.other(code);').pressButton('#ide-reload');
			}).then(function () {
				assert.equal(browser.text('#ide-code'), 'my.last.saved(code);');
			}).then(done, done);
	});

	it("can handle an event that writes in the console", function (done) {
		harness.setCode('console.log(\'handled event: \' + signal.type);');

		harness.signal({'type' : 'BRAINS'});
		
		browser.visit('web/index.html')
			.then(function () {
				return browser.wait(1000);
			}).then(function () {
				assert.equal(browser.text('#ide-console-out'), 'handled event: BRAINS');
			}).then(done, done);
	});
	
	it("console content is loaded when the page loads");
});

