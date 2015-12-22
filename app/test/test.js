var assert = require('assert');
var express = require('express');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe( 'User API', function() {});

var PRODUCT_ID = '000000000000000000000001';

describe('User Checkout', function() {
  this.timeout( 60000 );
  var server, Category, Product, Stripe, User;

  before(function() {
    app = express();

    // bootstrap the server
    models = require('../models/models')( wagner );
    dependencies = require('../../dependencies')( wagner );

    // Make models available in test
    Category = models.Category;
    Product = models.Product;
    Stripe = dependencies.Stripe;
    User = models.User;
    // get a user
    app.use(function( req, res, next ) {
      User.findOne({}, function( error, user ) {
        assert.ifError( error );
        req.user = user;
        next();
      });
    });
    // register subrouters
    app.use(require('../routes/api')( wagner ));
    // start the server
    server = app.listen( 3000 );

  });

  after(function() {
    // shut down the server when we're done
    server.close();
  });

  beforeEach(function( done ) {
    // Make sure categories are empty before each test
    Category.remove({}, function( error ) {
      assert.ifError( error );
      Product.remove({}, function( error ) {
        assert.ifError( error );
        User.remove({}, function( error ) {
          assert.ifError( error );
          done();
        });
      });
    });
  });

  beforeEach(function( done ) {
    var categories = [
      { _id: 'Electronics' },
      { _id: 'Phones', parent: 'Electronics' },
      { _id: 'Laptops', parent: 'Electronics' },
      { _id: 'Bacon' }
    ];

    var products = [
      {
        name: 'LG G4',
        category: { _id: 'Phones', ancestors: ['Electronics', 'Phones'] },
        price: {
          amount: 300,
          currency: 'USD'
        }
      },
      {
        _id: PRODUCT_ID,
        name: 'Asus Zenbook Prime',
        category: { _id: 'Laptops', ancestors: ['Electronics', 'Laptops'] },
        price: {
          amount: 2000,
          currency: 'USD'
        }
      },
      {
        name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
        category: { _id: 'Bacon', ancestors: ['Bacon'] },
        price: {
          amount: 20,
          currency: 'USD'
        }
      }
    ];

    var users = [{
      profile: {
        username: 'vkarpov15',
        picture: 'http://pbs.twimg.com/profile_images/550304223036854272/Wwmwuh2t.png'
      },
      data: {
        oauth: 'invalid',
        cart: []
      }
    }];

    Category.create( categories, function( error ) {
      assert.ifError( error );
      Product.create( products, function( error ) {
        assert.ifError( error );
        User.create( users, function( error ) {
          assert.ifError( error );
          done();
        });
      });
    });
  });

  it( 'can save a users cart', function() {
    var url = URL_ROOT + '/me/cart';

    superagent.
      put( url ).
      send({
        data : {
          cart : [{
            product : PRODUCT_ID,
            quantity : 1
          }]
        }
      }).
      end(function( error, res ) {
        assert.ifError( error );
        assert.equal( res.status, status.OK );

        User.findOne({}, function( error, user ) {
          assert.ifError( error );
          assert.equal( user.data.cart.length, 1 );
          assert.equal( user.data.cart[0].product, PRODUCT_ID );
          assert.equal( user.data.cart[0].quantity, 1 );
          done();
        });
      });
  });
  
  it( 'can load users cart', function( done ) {
    var url = URL_ROOT + '/me';

    User.findOne({}, function( error, user ) {
      assert.ifError( error );
      user.data.cart = [{
        product: PRODUCT_ID, quantity : 1
      }];

      user.save(function( error ) {
        assert.ifError( error );

        superagent.get( url, function( error, res ) {
          assert.ifError( error );

          assert.equal( res.status, 200 );
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse( res.text ).user;
          });
          assert.equal( result.data.cart.length, 1 );
          assert.equal( result.data.cart[0].product.name, 
          'Asus Zenbook Prime' );
          assert.equal( result.data.cart[0].quantity, 1 );
          done();
        });
      });
    });
  });

});