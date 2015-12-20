var bodyparser = require('body-parser'),
		express = require('express'),
		status = require('http-status');

module.exports = function( wagner ) {
	var api = express.Router();

	// use body parser so that we can grab data from POST req
	api.use(bodyparser.json());

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
				status( status.UNAUTHORISED ).
				json({
					error : error.toString()
				});
		}

		// join the user cart
		req.user.populate({
			path : 'data.cart.product',
			model : 'Product'
		}, handleOne.bind(null, 'user', res));

	});

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
