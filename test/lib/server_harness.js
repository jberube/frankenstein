var child_process = require('child_process');

module.exports.harness = function (source, options) {
	var settings = options || {};
	
	server = child_process.fork(source);
	
	server.on('error', function(err) {
		if (options.debug) console.trace('PARENT child process error:', err);
	});
	server.on('exit', function(code, signal) {
		if (options.debug) console.log('PARENT child process exit:', code, signal);
	});
	server.on('close', function(code, signal) {
		if (options.debug) console.log('PARENT child process close:', code, signal);
	});
	server.on('disconnect', function(code, signal) {
		if (options.debug) console.log('PARENT child process disconnect:', code, signal);
	});
	return server;
};


