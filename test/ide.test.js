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

describe('user\'s ide', function() {
	var browser, harness;

	beforeEach(function (done) {
		harness = server_harness.connect('127.0.0.1', 8080, function () {
			browser = new Browser(browserOptions);
			done();
		});
	});
	
	afterEach(function (done) {
		harness.close(done);
	});

	describe('code', function () {	
		it('is loaded in ide when page loads', function (done) {
			loadIde()
			.then(function () { expect.codeIs('console.log(signal.type);');	})
			.then(done, done);
		});
	
		it('can be saved', function (done) {
			loadIde()
			.then(function () { return savesCode('some.new(code);'); })
			.then(function () { return loadIde();	})
			.then(function () { expect.codeIs('some.new(code);');	})
			.then(done, done);
		});
	
		it('can be reloaded from the server', function (done) {
			loadIde()
			.then(function () { return enterCode('some.other(code);'); })
			.then(function (code) { return code.pressButton('#ide-reload'); })
			.then(function () { expect.codeIs('console.log(signal.type);');	})
			.then(done, done);
		});
	});
	
	describe('console', function () {
		it('entries are loaded when the page loads', function (done) {
			given.user().hasConsoleEntries(['welcome!', 'type "help" for help']);
		
			loadIde()
			.then(function () { expect.logIs(['welcome!', 'type "help" for help']);	})
			.then(done, done);
		});
	});

	describe('game', function () {
		it('can handle an event that writes in the console', function (done) {
			given.user().hasCode('console.log(\'handled event: \' + signal.type);');
			given.user().handlesSignal({type: 'BRAINS'});

			loadIde()
			.then(function () { expect.lastLogIs('handled event: BRAINS'); })
			.then(done, done);
		});
	});
	
	function loadIde() {
		return browser.visit('index.html')
			.then(function () {
				assert.equal(browser.statusCode, 200);
				return browser.wait(50);
			})
			.fail(function (err) {
				throw err;
			});
	}
	
	function enterCode(code) {
		return browser.fill('#ide-code', code);
	}
	
	function savesCode(code) {
		return enterCode(code).pressButton('#ide-save');
	}

	function lastLogEntry() {
		var logs = logEntries();
		return logs[logs.length-1];
	}
	
	function logEntries() {
		return browser.document.getElementById('ide-console-out').innerHTML.split('\r\n');
	}
	
	var given = {
		user : function () {
			return {
				hasCode : function (code) { harness.setCode(code); },
				handlesSignal : function (type, payload) { harness.signal(type, payload); },
				hasConsoleEntries : function (entries) { harness.setConsoleEntries(entries); }
			};
		}
	};

	var expect = {
		codeIs : function (code) { assert.equal(browser.text('#ide-code'), code); },
		lastLogIs : function (entry) { assert.equal(lastLogEntry(), entry); },
		logIs : function (entries) { assert.deepEqual(logEntries(), entries); }
	};
});
