var express = require('express'),
		wagner = require('wagner-core'),
		config = require('./config');

// pass wagner to models and stripe
require('./app/models/models')( wagner );
require('./dependencies')( wagner );

var app = express();

// invoke authentication passing app as local
wagner.invoke(require('./app/routes/auth'), { app : app });

// register our api
app.use( '/api/v1', require('./app/routes/api')( wagner ));

// start our server
app.listen( config.port );
console.log( 'listening on port ' + config.port );