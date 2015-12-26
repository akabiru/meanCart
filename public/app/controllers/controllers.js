exports.UserMenuController = function( $scope, $user ) {
	// make user available in views
	$scope.user = $user;
};

exports.ProductDetailsController = function( $scope, $routeParams, $http ) {
	var encoded = encodeURIComponent( $routeParams.id );

	$http.
		get( '/api/v1/product/id/' + encoded).
		success(function( data ) {
			$scope.product = data.product;
		});
};