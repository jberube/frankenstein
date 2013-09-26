var Browser = require("zombie"),
	assert = require("assert");

var baseUrl = 'http://127.0.0.1:8080/web/'; // local
//var baseUrl = 'http://julienberube.kd.io/'; // Koding

describe('frankenstein', function () {
	it('is alive!', function () {
		var browser = new Browser();
		browser.visit(baseUrl + 'index.html')
			.then(function () {
				if (!browser.success) {
					assert.fail('failed to fetch url: ' + browser.url);
				}
			})
			.fail(function (err) {
				assert.fail(err);
			});
	});
	
	it('can assert something in the DOM of a web page', function (done) {
		this.timeout(10000);
		var browser = new Browser();
		console.log(baseUrl + 'index.html');
		browser
			.visit(baseUrl + 'index.html')
			.then(function () {
				console.log("The page:\n", browser.html());
				console.log("success?:\n", browser.success);
				done();
			});
			/*
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
		*/
		});
});
