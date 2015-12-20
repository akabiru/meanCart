// setup models as services with wagner
var mongoose = require('mongoose'),
		_ = require('underscore'),
		config = require('../../config');

module.exports = function( wagner ) {
	mongoose.connect( config.database );

	var Category = 
		mongoose.model( 'Category', require('./category'), 'categories' );
	var Product = 
		mongoose.model( 'Product', require('./product'), 'products' );
	var User = 
		mongoose.model( 'User', require('./user'), 'users' );

	var models = {
		Category : Category,
		Product : Product,
		User : User
	};

	// To ensure DRY-code, register factories in a loop
	_.each( models, function( value, key ) {
		wagner.factory( key, function() {
			return value;
		});
	});

	return models;
};
