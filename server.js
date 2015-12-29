var express = require('express'),
		wagner = require('wagner-core'),
		config = require('./config');

// pass wagner to models and stripe
require('./app/models/models')( wagner );
require('./dependencies')( wagner );

var app = express();

// invoke authentication passing app as local
wagner.invoke(require('./app/routes/auth'), { app : app });

// register our api subrouters
app.use( '/api/v1', require('./app/routes/api')( wagner ));

// define static files and use cache max 2 hours
app.use( express.static( './public', {
	maxAge : 4 * 60 * 60 * 1000
}));

// start our server
app.listen( process.env.PORT || config.port );
console.log( 'listening on port ' + config.port );