var child_process = require('child_process');

module.exports.harness = function (source, options) {
	var settings = options || {};
	
	server = child_process.fork(source);
	
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

	server.signal = function (signal) {
		server.send({type : 'fire signal', signal : signal});
	};
	
	return server;
};


