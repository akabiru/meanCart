var superagent = require('superagent'),
		_ = require('underscore');    

module.exports = function() {
	var url = 'http://openexchangerates.org/api/latest.json?app_id' +
		process.env.OPEN_EXCHANGE_RATES_KEY;
	var rates = {
    USD: 1,
    EUR: 1.1,
    GBP: 1.5
  };

  var ping = function( callback ) {
  	superagent.get( url, function( error, res ) {
  		// If error happens, ignore because we'll 
  		// try again
  		if ( error ) {
  			if ( callback ) {
  				callback( error );
  			}
  			return;
  		}

  		var results;
  		try {
  			results = JSON.parse( res.text );

  			_.each( results.rates || {}, function( value, key ) {
  				rates[key] = value;
  			});

  			if ( callback ) {
  				callback( null, rates );
  			}
  		} catch ( e ) {
  			if ( callback ) {
  				callback( e );
  			}
  		}
  	});
  };

  // set to repeat every hour
  setInterval( ping, 60 * 60 * 1000 );

  // return the current state of the exchange rates
  var ret = function() {
  	return rates;
  };

  ret.ping = ping;
  return ret;	
};