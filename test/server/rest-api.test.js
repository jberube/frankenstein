var Browser = require("zombie"),
	assert = require("assert");

var browserOptions = { 
	debug: false, 
	runScripts: false,
	site: 'http://127.0.0.1:8080/'
};

describe('REST api', function () {
	var restApi;
	
	beforeEach(function () {
		restApi = require('../../server/rest-api');
	});
	
	it('can serve static files', function (done) {
		browser = new Browser(browserOptions);
		browser.visit('index.html')
			.then(function () {
				assert.equal(browser.statusCode, 200);
				done();
			})
			.then(null, done);
	});
	
	afterEach(function (done) {
		restApi.server.close(done);
	});
});
