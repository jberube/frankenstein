var Browser = require("zombie");
var assert = require("assert");

describe('zombie', function () {
	it('is alive!', function (done) {
		console.log('alive');
		Browser.visit('http://julienberube.kd.io/index.html', function (e, browser, status){
			if (browser.success){
				console.log('success');
				assert.equal(browser.text("H1") , 'Hello Woorld!');
			} else {
				console.log('sot uccess');
			}
			done();
		});
		/*
		.then(function() {
			console.log('then');
			console.log(browser);
				assert.equal(browser.text("H1") , 'Hello Woorld!');
			done();
			console.log('done');
		})
		.fail(function(error) {
			console.log('fail');
			assert.fail('failed to visit');
			console.log("Oops", error);
			done(error);
		});
		*/
		console.log('end');
	});
});