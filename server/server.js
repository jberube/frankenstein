var express = require('express'),
	url = require('url'),
	qs = require('querystring'),
	fs  = require('fs'),
	path = require('path');
var app = express();
var port = 8080;

/*** allow CORS *******************************/

app.all('*', function(req, res, next) {
	console.log('incoming request: ' + req.url);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/*** helper methods ***************************/
//todo: don't polute the global object
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"};

function getMimeType(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), unescape(uri));
	var mimeType = mimeTypes[path.extname(filename).split('.')[1]];
	res.setHeader('Content-Type', mimeType);
}

/*** Routes ***********************************/

app.get(/^\/web\/(\w|\/|\.|-)+$/, function(req, res){
	console.log('serving as file: ' + req.url);
	var path = process.cwd() + req.url;
	console.log('path: ' + path);
	
	fs.readFile(path, {encoding: 'utf-8'}, function (err, data) {
		if (err) {
			console.error('file not found:' + path);
			res.statusCode = 404;
			res.end();
			return;
		}
		
		console.log('serving file: ' + path);
		//res.setHeader('Content-Type', 'text/html');
		getMimeType(req, res);
		res.setHeader('Content-Length', data.length);
		res.statusCode = 200;
		res.end(data, 'utf-8');
		console.log("The time:", Date.now());
	});
});

app.get(/^\/api\/(\w|\/|\.)+(\?|$)/, function(req, res){
	console.log('api call: ' + req.url);
    var querystring = req.url.split('?')[1];
	var payload = qs.parse(querystring);
	console.info(payload);
	res.send(payload.code);
});

/*
app.get('/', function(req, res){
	var body = 'mmm... brains...';
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});
*/
//app.listen(3000, '0.0.0.0'); // when testing on Koding
app.listen(port, '127.0.0.1'); // when testing localy
console.info('listening port ' + port);
/*
var http = require('http');
var server = http.createServer(function (req, res) {
	console.log('request in: ' + req.url);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(3000, '0.0.0.0');
console.log('Server running at 0.0.0.0');
*/
