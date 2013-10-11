var http = require('http'),
	express = require('express'),
	path = require('path');
	
var app = express(),
	port = 8080;
	
// all files under web are served as file
app.use(express.static(path.join(process.cwd(), 'web')));

module.exports.server = http.createServer(app);
module.exports.server.listen(port, '127.0.0.1');

