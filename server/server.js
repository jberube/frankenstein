var express = require('express');
var app = express();
var fs  = require('fs');
var qs = require('querystring');

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

/*
app.get(/^\/web\/(\w|\/|\.)+$/, function(req, res){
	var path = process.cwd() + req.url;
	
	fs.readFile(path, function (err, data) {
		if (err) throw err;
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', data.length);
		res.end(data);
	});
});
*/

app.get(/^\/api\/(\w|\/|\.)+(\?|$)/, function(req, res){
	var querystring = req.url.split('?')[1]
	var payload = qs.parse(querystring);
	console.log('api call: ' + req.url);
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
app.listen(3000, '0.0.0.0');
console.info('listening port 3000');
/*
var http = require('http');
var server = http.createServer(function (req, res) {
	console.log('request in: ' + req.url);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(3000, '0.0.0.0');
console.log('Server running at 0.0.0.0');
*/