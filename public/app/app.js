var controllers = require('./controllers/controllers'),
		directives = require('./directives/directives'),
		services = require('./services/services'),
    _ = require('underscore');

var components = angular.module('mean-cart.components', ['ng']);

// inject all controllers to main module
_.each( controllers, function( controller, name ) {
	components.controller( name, controller );
});

// inject all directives to main module
_.each( directives, function( directive, name ) {
	components.directive( name, directive );
});

// inject all services
_.each( services, function( factory, name ) {
	components.factory( name, factory );
});

var app = angular.module('mean-cart', ['mean-cart.components', 'ngRoute']);

app.config(function( $routeProvider ) {
	$routeProvider.
		when( '/', {
			templateUrl : '<search-bar></search-bar>'
		}).
		when( '/category/:category', {
			templateUrl : '/app/views/category_view.html'
		}).
		when( '/checkout', {
			template : '<checkout></checkout>'
		}).
		when( '/product/:id', {
			template : '<product-details></product-details>'
		});
});
