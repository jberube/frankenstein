var server = require('./server_harness'),
	assert = require('assert');

describe('Server harness', function () {
	it('can be instantiated and closed', function (done) {
		var harness = server.connect('127.0.0.1', 8080, function () {
			assert.ok(harness.primo);
			assert.ok(harness.api);
			harness.close(done);
		});
	});

	describe('once instantiated', function () {
		var harness;
		
		beforeEach(function (done) {
			harness = server.connect('127.0.0.1', 8080, done);
		});
		
		afterEach(function (done) {
			harness.close(done);
		});

		it('injects "codeIs(code)" on primo', function () {
			assert.equal(typeof harness.codeIs, 'function');
			assert.throws(function () {
				harness.codeIs('whatever');
			}, assert.AssertionError);
		});
	
		it('can sets user\'s code', function (done) {
			harness.setCode('some code', function (primo) {
				harness.codeIs('some code');
				done();
			});
		});
		
		it('can provoke a signal', function (done) {
			harness.primo.on('signal', function (signal){
				assert.equal(signal.type, 'beep');
				assert.deepEqual(signal.payload, {foo: 'bar'});
				done();
			});
			harness.signal({ type: 'beep', payload: {foo: 'bar'}});
		});
		
		it('can set the console\'s entries', function (done) {
			harness.setConsoleEntries(['one', 'two', 'three'])
				.then(function (primo) {
					assert.deepEqual(primo.ideConsole, ['one', 'two', 'three']);
				})
				.then(done, done);
		});
	});
});
