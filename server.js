var express = require('express'),
		wagner = require('wagner-core'),
		config = require('./config');

// pass wagner to models
require('./models/models')( wagner );

var app = express();

// invoke authentication passing app as local
wagner.invoke(require('./routes/auth'), { app : app });

// register our api
app.use( '/api/v1', require('./routes/api')( wagner ));

// start our server
app.listen( config.port );
console.log( 'listening on port ' + config.port );