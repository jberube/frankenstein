var assert = require('assert'),
	child_process = require('child_process');

describe('Nanoïd server', function () {
	var server;
	
	beforeEach(function (){
		server = require('../../server/server').connect();
	});

	beforeEach(function (){
		server.disconnect();
	});
	
	it('can be connected to', function () {
		var server = require('../../server/server').connect();
		assert.ok(server.connected);
	});
	
	it('can be disconnected from', function () {
		server.on('disconnect', function (svr) {
			assert.strictEqual(svr, server);
			assert.deepEqual(svr.connected, false);
		})
		.disconnect();
	});
	
	it('can fire a signal with a payload', function (done) {
		var bodyParts = { members : ['leg', 'leg', 'arm'], limbs: ['pancreas']};

		server.on('signal', function (signal) {
			assert.equal(signal.type, 'putrid flesh');
			assert.deepEqual(signal.payload, bodyParts);
			done();
		});
		
		server.signal('putrid flesh', bodyParts);
	});

	it('can set the console entries', function () {
		server.log('mmm... brains...');
		assert.equal(server.getLastLog(), 'mmm... brains...');
	});
	
	it('can save some code', function (done) {
		server.pushCode('console.log(\'grrrr...\')', function (svr) {
			assert.equal(svr.getCode(), 'console.log(\'grrrr...\')');
			done();
		});
	});
});
