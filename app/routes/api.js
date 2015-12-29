var bodyparser = require('body-parser'),
		express = require('express'),
		status = require('http-status'),
		_ = require('underscore');

module.exports = function( wagner ) {
	var api = express.Router();

	// use body parser so that we can grab data from POST req
	api.use(bodyparser.json());

	/* CATEGORY API */
	api.get( '/category/id/:id', wagner.invoke(function( Category ) {
		return function( req, res ) {
			Category.findOne({
				_id : req.params.id
			}, function( error, category ) {
				if ( error ) {
					return res.
						status( status.INTERNAL_SERVER_ERROR ).
						json({
							error : error.toString()
						});
				}

				if ( !category ) {
					return res.
						status( status.NOT_FOUND ).
						json({
							error : 'Not found'
						});
				}
				// success
				res.json({
					category : category
				});
			});
		};
	}));

	api.get( '/category/parent/:id', wagner.invoke(function( Category ) {
		return function( req, res ) {
			Category.
				find({
					parent : req.params.id
				}).
				sort({
					_id : 1
				}).
				exec(function( error, categories ) {
					if ( error ) {
						return res.
							status( status.INTERNAL_SERVER_ERROR ).
							json({
								error : error.toString()
							});
					}
					// success
					res.json({
						categories : categories
					});
				});
		};
	}));

	/* PRODUCT API */
	// get a product by id
	api.get( '/product/id/:id', wagner.invoke(function( Product ) {
		return function( req, res ) {
			Product.findOne({
				_id : req.params.id
			}, handleOne.bind( null, 'product', res ));
		};
	}));

	// get a product by category
	api.get( '/product/category/:id', wagner.invoke(function( Product ) {
		return function( req, res ) {
			var sort = {
				name : 1
			};
			if ( req.query.price === "1" ) {
				sort = {
					'internal.apprioximatePriceUSD' : 1
				};
			} else if ( req.query.price === "-1" ) {
				sort = {
					'internal.apprioximatePriceUSD' : -1
				};
			}

			Product.
				find({
					'category.ancestors' : req.params.id
				}).
				sort( sort ).
				exec( handleMany.bind( null, 'products', res ) );
		};
	}));

	/* USER API */
	// modify cart
	api.put( '/me/cart', wagner.invoke(function( User ) {
		return function( req, res ) {
			try {
				// made possible by body parser
				var cart = req.body.data.cart;
			} catch( e ) {
				return res.
					status( status.BAD_REQUEST ).
					json({
						error : error.toString()
					});
			}

			req.user.data.cart = cart;
			req.user.save(function( error, user ) {
				if ( error ) {
					return res.
						status( status.INTERNAL_SERVER_ERROR ).
						json({
							error : error.toString()
						});
				}

				return res.json({
					user : user
				});
			});
		};
	}));

	// get a single user
	api.get( '/me', function( req, res ) {
		if ( !req.user ) {
			return res.
				status( status.UNAUTHORIZED ).
				json({
					error : 'Not logged in'
				});
		}

		// join the user cart
		req.user.populate({
			path : 'data.cart.product',
			model : 'Product'
		}, handleOne.bind(null, 'user', res));

	});

	/* STRIPE CHECKOUT API */
	// chekout
	api.post( '/checkout', wagner.invoke(function(User, Stripe) {
		return function( req, res ) {
			if ( !req.user ) {
				return res.
					status( status.UNAUTHORIZED ).
					json({
						error : 'Not logged in.'
					});
			}

			// Populate the products in the user's cart
			req.user.populate({
				path : 'data.cart.product',
				model : 'Product'
			}, 
			function( error, user ) {
				// sum up the total products in the user's cart
				var totalCostUSD = 0;

				_.each( user.data.cart, function( item ) {
					totalCostUSD += 
						item.product.internal.apprioximatePriceUSD *
						item.quantity;
				});

				// create a charge in Stripe corresponding to the price
				Stripe.charges.create({
					// Stripe takes price in cents; *100 and round up
					amount : Math.ceil( totalCostUSD * 100 ),
					currency : 'usd',
					source : req.body.stripeToken,
					description : 'Example charge'
				},
				function( err, charge ) {
					if ( err && err.type === 'StripeCardError' ) {
						return res.
							status( status.BAD_REQUEST ).
							json({
								error : err.toString()
							});
					}

					if ( err ) {
						console.log( err );
						return res.
							status( status.INTERNAL_SERVER_ERROR ).
							json({
								error : err.toString()
							});
					}

					req.user.data.cart = [];
					req.user.save(function() {
						// ignore any errors - if we failed to empty the user's
						// cart, that's not necessarily an error

					  // If successful, return the charge id
					  return res.json({
					  	id : charge.id
					  });
					});
				});
			});
		};
	}));

	/* TEXT SEARCH API */
	// full text search
	api.get( '/product/text/:query', wagner.invoke(function( Product ) {
		return function( req, res ) {
			Product.
				find(
					{ $text : { $search : req.params.query } },
          { score : { $meta: 'textScore' } }).
				sort({
					score : {
						$meta : 'textScore'
					}
				}).
				limit(10).
				exec(handleMany.bind( null, 'products', res ));
		};
	}));

	return api;
};

function handleOne( property, res, error, result ) {
	if ( error ) {
		return res.
			status( status.INTERNAL_SERVER_ERROR ).
			json({
				error : error.toString()
			});
	}
	// empty result
	if ( !result ) {
		return res.
			status( status.BAD_REQUEST ).
			json({
				error : 'Not found'
			});
	}

	var json = {};
	json[property] = result;

	res.json( json );

}

function handleMany( property, res, error, result ) {
	if ( error ) {
		return res.
			status( status.INTERNAL_SERVER_ERROR ).
			json({
				error : error.toString()
			});
	}

	var json = {};
	json[property] = result;
	res.json( json );
}
