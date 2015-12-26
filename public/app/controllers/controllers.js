exports.NavBarController = function( $scope, $user ) {
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

exports.CategoryProductsController = function( $scope, $routeParams, $http ) {
	var encoded = encodeURIComponent( $routeParams.category );

	$scope.price = undefined;

	$scope.handlePriceClick = function() {
		if ( $scope.price === undefined ) {
			$scope.price = -1;
		} else {
			$scope.price = 0 - $scope.price;
		}
		$scope.load();
	};

	$scope.load = function() {
		var queryParams = {
			price : $scope.price
		};

		$http.
			get( '/api/v1/product/category/' + encoded, {
				params : queryParams
			}).
			success(function( data ) {
				$scope.products = data.products;
			});
	};

	$scope.load();

};

exports.CategoryTreeController = function( $scope, $routeParams, $http ) {
	var encoded = encodeURIComponent( $routeParams.category );

	$http.
		get( '/api/v1/category/id/' + encoded).
		success(function( data ) {
			$scope.category = data.category;
			$http.
				get( '/api/v1/category/parent/' + encoded).
				success(function( data ) {
					$scope.children = data.categories;
				});
		});
};