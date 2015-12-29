var Stripe = require('stripe'),
		fx = require('./app/models/fx'),
		fs = require('fs');

module.exports = function( wagner ) {	

	wagner.factory( 'Stripe', function( Config ) {
		return Stripe( process.env.STRIPE_KEY || Config.stripeKey );
	});

	wagner.factory( 'fx', fx);

	wagner.factory( 'Config', function() {
		return JSON.parse( fs.readFileSync('./config.json').toString() );
	});
};