var controllers = require('./controllers/controllers'),
		directives = require('./directives/directives'),
		services = require('./services/services'),
    _ = require('underscore');

var app = angular.module('mean-cart', ['ng']);

// inject all controllers to main module
_.each( controllers, function( controller, name ) {
	app.controller( name, controller );
});

// inject all directives to main module
_.each( directives, function( directive, name ) {
	app.directive( name, directive );
});

// inject all services
_.each( services, function( factory, name ) {
	app.factory( name, factory );
});
