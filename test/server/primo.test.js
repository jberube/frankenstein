var assert = require('assert');

describe('Nanoïd primordial soup', function () {
	var primo;
	
	beforeEach(function () {
		primo = require('../../server/primo');
	});
	
	it('can be instantiated', function () {
		assert.equal(typeof primo.connect, 'function');
		
		var soup = primo.connect();
		assert.ok(soup);
	});
	
	describe('once instantiated', function () {
		var soup;
		
		beforeEach(function (){
			soup = primo.connect();
		});
	
		it('can fire a signal with a payload', function (done) {
			var bodyParts = { members : ['leg', 'leg', 'arm'], limbs: ['pancreas']};

			soup.on('putrid flesh', function (payload) {
				assert.deepEqual(payload, bodyParts);
				done();
			});
		
			soup.emit('putrid flesh', bodyParts);
		});

		it('can set the console entries', function () {
			soup.log('mmm... brains...');
			assert.equal(soup.getLastLog(), 'mmm... brains...');
		});
	
		it('can save some code', function (done) {
			soup.pushCode('console.log(\'grrrr...\')', function (svr) {
				assert.equal(svr.getCode(), 'console.log(\'grrrr...\')');
				done();
			});
		});
	});
});
