var Stripe = require('stripe'),
		fx = require('./app/models/fx'),
		config = require('./config');

module.exports = function( wagner ) {
	var stripe = Stripe( config.stripeKey );

	wagner.factory( 'Stripe', function() {
		return stripe;
	});

	wagner.factory( 'fx', fx);
};