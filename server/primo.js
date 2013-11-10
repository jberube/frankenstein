var util = require('util'),
	events = require('events'),
	vm = require('vm');

/* module *************************************/
var Server = module.exports = function () {
	events.EventEmitter.call(this);
	this.code = 'console.log(signal.type);';
	this.ideConsole = ['welcome, nanoïd.', 'type "help" for help'];
};
util.inherits(Server, events.EventEmitter);

Server.connect = function() {
	return new Server();
};

Server.prototype.signal = function (signal) {
	this.emit('signal', signal);
	var that = this;
	var sandbox = { 
		api : {}, 
		console : { 
			log : function (arg) {
				that.ideConsole.push(arg);
			}
		},
		signal : signal
	};
	var context = vm.createContext(sandbox);
	
	var callback = ';(function (api, console, signal) {' + this.code + '})(api, console, signal)';
	vm.runInContext(callback, context, 'signal.vm');	
};

Server.prototype.log = function (msg) {
	return this.ideConsole.push(msg);
};

Server.prototype.pushCode = function (code, fn) {
	this.code = code;
	if (typeof fn === 'function') fn(this);
};

Server.prototype.getCode = function () {
	return this.code;
};

Server.prototype.getLastLog = function () {
	return this.ideConsole[this.ideConsole.length-1];
};
	
/*** child process poutine ********************/
process.on('error', function (err) {
	console.trace('error in server/server:', err);
});

process.on('disconnect', function(code, signal) {
	process.exit();
});

