var app = angular.module('myApp', ['ng', 'ngRoute']);
// configure our routes
app.config(function( $routeProvider, $locationProvider ) {
	$routeProvider.
		when( '/', {
			templateUrl : 'views/home.html',
			controller : 'mainController',
			controllerAs : 'main'
		}).
		when( '/about', {
			templateUrl : 'views/about.html'
		});
});