var rest_api = require('./rest-api'),	
	primo = require('./primo');

var p = primo.connect();
var api = rest_api.create(p, '127.0.0.1', 8080, function () {
	console.log('ready');	
});
