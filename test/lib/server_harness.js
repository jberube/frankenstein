var server = require('./server_harness'),
	server = require('../../server/primo'),
	rest_api = require('../../server/rest-api'),
	events = require('events'),
	util = require('util'),
	assert = require('assert'),
	Q = require('q');

var ServerHarness = module.exports = function (address, port, callback) {
	//events.EventEmitter.call(this);
	this.primo = server.connect();
	this.api = rest_api.create(this.primo, address, port, callback);
};
//util.inherits(ServerHarness, events.EventEmitter);

ServerHarness.connect = function (address, port, callback) {
	return new ServerHarness(address, port, callback);
};

ServerHarness.prototype.close = function (callback) {
	this.api.close(callback);
};

ServerHarness.prototype.setCode = function (code, callback) {
	this.primo.pushCode(code, callback);
};

ServerHarness.prototype.codeIs = function (code) {
	assert.equal(code, this.primo.getCode());
};

ServerHarness.prototype.on = function (event, callback) {
	this.primo.on('signal', function (type, payload) {
		if (type === event) {
			callback(type, payload);
		};
	});
};

ServerHarness.prototype.signal = function (signal) {
	this.primo.signal(signal);
};

ServerHarness.prototype.setConsoleEntries = function (entries) {
	var deffered = Q.defer();
	this.primo.ideConsole = entries;

	deffered.resolve(this.primo);

	return deffered.promise;
};

/*
function (options) {
	server.on('error', function(err) {
		if (settings.debug) console.trace('PARENT child process error:', err);
	});
	server.on('exit', function(code, signal) {
		if (settings.debug) console.log('PARENT child process exit:', code, signal);
	});
	server.on('close', function(code, signal) {
		if (settings.debug) console.log('PARENT child process close:', code, signal);
	});
	server.on('disconnect', function(code, signal) {
		if (settings.debug) console.log('PARENT child process disconnect:', code, signal);
	});
	
	server.setCode = function (code) {
		server.send({type : 'save code', code : code});
	};

	server.setConsoleEntries = function (entries) {
		server.send({type : 'set console entries', entries : entries});
	};
	
	return server;
};
*/
