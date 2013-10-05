var express = require('express'),
	url = require('url'),
	qs = require('querystring'),
	fs  = require('fs'),
	path = require('path'),
	vm = require('vm');
var app = express();
var port = 8080;

/*** state ************************************/
var code = 'console.log(signal.type);',
	ideConsole = ['welcome!'];
	
/*** child process poutine ********************/
process.on('error', function (err) {
	console.trace('error in server/server:', err);
});
process.on('disconnect', function(code, signal) {
	process.exit();
});

process.on('message', function (event) {
	if (event.type === 'fire signal')
		process.emit('signal', event.signal);
	else
		code = event.code;	
});
process.on('signal', function (signal)  {
	var sandbox = { 
		api : {}, 
		console : { 
			log : function (arg) {
				ideConsole.push(arg);
			}
		},
		signal : signal
	};
	var context = vm.createContext(sandbox);
	
	var callback = ';(function (api, console, signal) {' + code + '})(api, console, signal)';
	vm.runInContext(callback, context, 'signal.vm');	
});

/*** allow CORS *******************************/
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/*** helper methods ***************************/
function getMimeType(req, res) {
	var mimeTypes = {
		"html": "text/html",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"png": "image/png",
		"js": "text/javascript",
		"css": "text/css"};

  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), unescape(uri));
	var mimeType = mimeTypes[path.extname(filename).split('.')[1]];
	res.setHeader('Content-Type', mimeType);
}

/*** Routes ***********************************/
// all files under web are served as file
app.get(/^\/web(\/(?:[a-zA-Z0-9_.!~*'()-]|%[0-9a-fA-F]{2})*)*(\?|$)/, function(req, res){
	var path = process.cwd() + req.url;
	
	fs.readFile(path, {encoding: 'utf-8'}, function (err, data) {
		if (err) {
			console.error('file not found: ' + path, err);
			res.statusCode = 404;
			res.end();
			return;
		}
		
		getMimeType(req, res);
		res.setHeader('Content-Length', data.length);
		res.statusCode = 200;
		res.end(data, 'utf-8');
	});
});

app.get(/^\/api\/code(\?|$)/, function (req, res) {
	var data = JSON.stringify({
		code: code
	});
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(data);
});

app.post(/^\/api\/code(\?|$)/, function (req, res) {
	data = '';
	req.on('data', function (chunk) {
		data += chunk;
	});
	req.on('end', function (){
		code = qs.parse(data).code;
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('');
	});
});

app.get(/^\/api\/ide\/console\/logs(\?|$)/, function (req, res) {
	var data = JSON.stringify({
		logs: ideConsole
	});
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(data);
});

app.listen(port, '127.0.0.1'); // when testing localy

if (process.connected) process.send('ready');

