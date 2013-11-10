var Browser = require("zombie"),
	assert = require("assert"),
	qs = require('querystring'),
	client_harness = require('../lib/client_harness');
	
var browserOptions = { 
	debug: false, 
	runScripts: true,
	site: 'http://127.0.0.1:8080/'
};

describe('UI', function() {
	var browser, harness;
	
	beforeEach(function (done) {
		client_harness.connect('127.0.0.1', 8080)
			.then(function (h) {
				harness = h;
				browser = new Browser(browserOptions);
				harness.mockGet('/api/code', { code: 'console.log(signal.type);' });
				harness.mockGet('/api/ide/console/logs', { logs: ['some','logs']});
				done();
			});
	});
	
	afterEach(function(done) {
		harness.close(done);
	});

	it('clicking "save" post the code to /api/code', function (done) {
		//harness.mockPost('/api/code');
		harness.on('POST /api/code', function (req, res) {
			assert.deepEqual(req.body.code, 'hey(there);');
			done();
		});

		harness.fileServer();		
		loadIde()
			.then(function() { browser.fill('#ide-code', 'hey(there);').pressButton('#ide-save'); })
			.then(null, done);
	});

	it('loading the ide gets the code from /api/code', function (done) {
		harness.fileServer();
		loadIde()
			.then(function () { expect.codeIs('console.log(signal.type);');	})
			.then(done, done);
	});
	
	function loadIde() {
		return browser.visit('index.html')
			.then(function () {
				assert.equal(browser.statusCode, 200);
				return browser.wait(500);
			})
			.fail(function (err) { throw err; });
	}
	
	var expect = {
		codeIs : function (code) { assert.equal(browser.text('#ide-code'), code); }
	};

});
