var	express = require('express'),
	http = require('http'),
	path = require('path'),
	util = require('util'),
	events = require('events'),
	Q = require('q');

var ClientHarness = module.exports = function (address, port, callback) {
	events.EventEmitter.call(this)
	this.address = address;
	this.port = port;
	this.app = express();
	this.server = http.createServer(this.app).listen(port, address, undefined, callback);
 };
util.inherits(ClientHarness, events.EventEmitter);

ClientHarness.connect = function (address, port) {
	var deffered = Q.defer();
	var harness = new ClientHarness(address, port, function () {
		deffered.resolve(harness);
	});

	harness.app.use(express.bodyParser());

	harness.app.use(function (req, res, next) {
		harness.emit(req.method + ' ' + req.path, req, res);
		next();
	});

	return deffered.promise;
};

ClientHarness.prototype.close = function (callback) {
	this.server.close(callback);
};

ClientHarness.prototype.fileServer = function () {
	this.app.use(express.static(path.join(process.cwd(), 'web')));
};

ClientHarness.prototype.mockGet = function (path, data) {
	this.app.get(path, function (req, res) { res.send(200, data); });
};

ClientHarness.prototype.mockPost = function (path, data) {
	this.app.post(path, function (req, res) { res.send(200, data); });
};

ClientHarness.prototype.get = function (path) {
	var options = { host: this.address, port: this.port, method: 'GET', path: path	};
	var deffered = Q.defer();
	var req = http.request(options, function (res) {
		deffered.resolve(res);
	});
	req.end();
	return deffered.promise;
};

ClientHarness.prototype.post = function (path, data) {
	var options = { host: this.address, port: this.port, method: 'POST', path: path	};
	var deffered = Q.defer();
	var req = http.request(options, function (res) {
		deffered.resolve(res);
	});
	req.write(JSON.stringify(data));
	req.end();
	return deffered.promise;
};

ClientHarness.prototype.getRequestBody = function (req) {
	var deffered = Q.defer();
	var data = '';
	req.on('data', function (chunk) { data += chunk; })
		.on('end', function () { deffered.resolve(data); });
	return deffered.promise;
};

ClientHarness.prototype.getResponseBody = function (res) {
	var deffered = Q.defer();
	var data='';
	res.on('data', function (chunk) { data+=chunk; })
		.on('end', function () { deffered.resolve(data); });
	return deffered.promise;
};
