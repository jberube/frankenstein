var express = require('express'),
	url = require('url'),
	qs = require('querystring'),
	fs  = require('fs'),
	path = require('path');
var app = express();
var port = 8080;

/*** child process poutine ********************/
process.on('error', function (err) {
	console.log('error in child:', err);
});
process.on('disconnect', function(code, signal) {
	console.log('CHILD disconnected:', code, signal);
	process.exit();
});
process.on('message', function(m) {
  console.log('CHILD got message:', m);
});

/*** allow CORS *******************************/
app.all('*', function(req, res, next) {
	console.log('incoming request: ' + req.url);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/*** helper methods ***************************/
//todo: don't polute the global object
function getMimeType(req, res) {
	//todo: store elsewhere
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
	console.log('serving as file: ' + req.url);
	var path = process.cwd() + req.url;
	console.log('path: ' + path);
	
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

app.get(/^\/api\/(\w|\/|\.)+(\?|$)/, function(req, res){
	console.log('api call: ' + req.url);
    var querystring = req.url.split('?')[1];
	var payload = qs.parse(querystring);
	console.info(payload);
	res.send(payload.code);
});

//app.listen(port, '0.0.0.0'); // when testing on Koding
app.listen(port, '127.0.0.1'); // when testing localy
console.info('CHILD listening port ' + port);

if (process.connected) process.send('ready');

