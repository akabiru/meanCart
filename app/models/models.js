// setup models as services with wagner
var mongoose = require('mongoose'),
		_ = require('underscore'),
		config = require('../../config');

module.exports = function( wagner ) {
	mongoose.connect(  process.env.DATABASE_URI || config.databaseLocal );

	// register mongoose as a service
	wagner.factory( 'db', function() {
		return mongoose;
	});

	var Category = 
		mongoose.model( 'Category', require('./category'), 'categories' );	
	var User = 
		mongoose.model( 'User', require('./user'), 'users' );

	var models = {
		Category : Category,		
		User : User
	};

	// To ensure DRY-code, register factories in a loop
	_.each( models, function( value, key ) {
		wagner.factory( key, function() {
			return value;
		});
	});

	wagner.factory( 'Product', require('./product') );

	return models;
};
