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
	
	it('can be reloaded from to the server', function (done) {
		loadIde()
		.then(function () { return enterCode('some.other(code);'); })
		.then(function (code) { return code.pressButton('#ide-reload'); })
		.then(function () { expect.codeIs('console.log(signal.type);');	})
		.then(done, done);
	});

	it("console entries are loaded when the page loads", function (done) {
		given.user().hasConsoleEntries(['welcome!', 'type "help" for help']);
		
		loadIde()
		.then(function () { expect.logIs(['welcome!', 'type "help" for help']);	})
		.then(done, done);
	});

	it("can handle an event that writes in the console", function (done) {
		given.user().hasCode('console.log(\'handled event: \' + signal.type);');
		given.user().handlesSignal({'type' : 'BRAINS'});

		loadIde()
		.then(function () { expect.lastLogIs('handled event: BRAINS'); })
		.then(done, done);
	});
	
	function loadIde() {
		return browser.visit('web/index.html')
			.then(function () {
				return browser.wait(500);
			});
	}
	
	function enterCode(code) {
		return browser.fill('#ide-code', code);
	}
	
	function savesCode(code) {
		return enterCode(code).pressButton('#ide-save');
	}

	function lastLogEntry() {
		var logs = browser.document.getElementById('ide-console-out').innerHTML.split('\r\n');
		return logs[logs.length-1];
	}
	
	function logEntries() {
		return browser.document.getElementById('ide-console-out').innerHTML.split('\r\n');
	}
	
	var given = {
		user : function () {
			return {
				hasCode : function (code) { harness.setCode(code); },
				handlesSignal : function (signal) {	harness.signal(signal); },
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
