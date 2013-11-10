var Browser = require("zombie"),
	assert = require("assert"),
	qs = require('querystring'),
	http = require('http'),
	Q = require('q');

var browserOptions = { 
	debug: false, 
	runScripts: false,
	site: 'http://127.0.0.1:8080/'
};

describe('REST api', function () {
	describe('during instantiation', function () {
		it('uses the given primo server', function (done) {
			var rest_api = require('../../server/rest-api');
			var primo = require('../../server/primo').connect();
			var api = rest_api.create(primo, '127.0.0.1', 8080, function () {
				assert.strictEqual(api.primo, primo);
				api.close(done);
			});
		});
	});
	
	describe('once instantiated', function () {
		var rest_api = require('../../server/rest-api'),
			primo = require('../../server/primo'),
			api, server, requestOptions;
		
		beforeEach(function (done){
			requestOptions = {
				host: '127.0.0.1',
				port:8080,
				method: 'GET'
			};

			server = primo.connect();
			api = rest_api.create(server, '127.0.0.1', 8080, done);
		});
		
		afterEach(function (done) {
			api.close(done);
		});
		
		it('can serve static files', function (done) {
			requestOptions.path = '/index.html';
			var req = http.get(requestOptions, function (res) {
				assert.equal(res.statusCode, 200);
				consume(res).then(function (data) {
					done();
				}, done);
			}).on('error', function(e) {
  			done(e);
			});
		});

		it('can get code using GET /api/code', function (done) {
			requestOptions.path = '/api/code';
			var req = http.get(requestOptions, function (res) {
				assert.equal(res.statusCode, 200);
				consume(res).then(function(data) { 
					assert.equal(JSON.parse(data).code, 'console.log(signal.type);');
				})
				.then(done, done);
			})
			.on('error', function(e) {
  			done(e);
			});
		});
		
		it('can save some code using POST /api/code', function (done) {
			var defer = new Q.defer();
			var orig = server.pushCode;
			server.pushCode = function (code, fn) {
				assert.equal(code, 'var my = { brand : { new: code }};');
				defer.resolve(orig(code, fn));
			}
			defer.promise.then(function () {
				done();
			});

			requestOptions.path = '/api/code';
			requestOptions.method = 'POST';
			var req = http.request(requestOptions, function (res) {
				consume(res).then(function (data) {
					assert.equal(res.statusCode, 200);
				}).then(null, done);
			})
			.on('error', function(e) {
  			done(e);
			});
			req.write(qs.stringify({code : 'var my = { brand : { new: code }};'}));
			req.end();
		});
	});
	
	function consume(res)	{
		var deffered = Q.defer();
		var data = '';
		res.on('data', function (chunk) { data += chunk;})
			.on('end', function () { deffered.resolve(data) })
			.on('close', function () { console.log('CLOSE');});
		return deffered.promise;
	}
});
