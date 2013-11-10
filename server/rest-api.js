var http = require('http'),
	express = require('express'),
	path = require('path'),
	qs = require('querystring');
	
/* module *************************************/
var RestApi = module.exports = function (primo, address, port, callback) {
	//events.EventEmitter.call(this);
	this.primo = primo;
	this.app = express();

	this.defineRoutes(this.app, this.primo);
	
	this.server = http.createServer(this.app).listen(port, address, undefined, callback);
};
//util.inherits(RestApi, events.EventEmitter);

RestApi.create = function(primo, address, port, callback) {
	return new RestApi(primo, address, port, callback);
};

RestApi.prototype.close = function (callback) {
	this.server.close(callback);
};

RestApi.prototype.defineRoutes = function (app, primo) {
	// all files under web are served as file
	app.use(express.static(path.join(process.cwd(), 'web')));

	app.get(/^\/api\/code(\?|$)/, function (req, res) {
		var body = JSON.stringify({ code: primo.getCode() });
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(body);
	});
	
	app.post(/^\/api\/code(\?|$)/, function (req, res) {
		var body = '';
		req.on('data', function (chunk) { body+=chunk; })
			.on('end', function () {
				var payload = qs.parse(body);
				var code = payload.code;
				primo.pushCode(code, function () {
					res.statusCode = 200;
					res.end();
				});
			});
	});
	
	app.get(/^\/api\/ide\/console\/logs(\?|$)/, function (req, res) {
		var logs = primo.ideConsole;
		var body = JSON.stringify({
			logs: logs
		});
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(body);
	});
};

/*** allow CORS *******************************/
/*
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
*/
