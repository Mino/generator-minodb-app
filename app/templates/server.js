var logger = require('tracer').console();
var express = require('express');
var path = require('path');
var globals = require('./globals');

globals.username = '<%=username%>';
globals.email = '<%=email%>';
globals.password = '<%=password%>';
globals.mongodb_url = '<%=mongodb_url%>'

require('./mino_setup')(function(){

	var server = express();

	server.engine('mustache', require('mustache-express')());
	server.set('views', path.join(__dirname, 'views'));
	server.set('view engine', 'mustache');

	server.use(require('errorhandler')());
	server.use(express.static('./public'));
	server.use(require('body-parser')());
	server.use('/mino/', globals.minodb.server());

	server.get('/*', function(req, res) {
		res.render('index.mustache');
	})
	
	server.listen(process.env.PORT || 5002);
});