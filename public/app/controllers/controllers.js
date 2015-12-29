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

exports.AddToCartController = function( $scope, $http, $user, $timeout ) {
	$scope.addToCart = function( product ) {
		var obj = {
			product : product._id,
			quantity : 1
		};
		$user.user.data.cart.push( obj );

		$http.
			put( '/api/v1/me/cart', $user.user).
			success(function( data ) {
				$user.loadUser();
				$scope.success = true;

				$timeout(function() {
					$scope.success = false
				}, 5000);
			});
	};
};

exports.CheckoutController = function( $scope, $user, $http ) {
	// For update cart
	$scope.user = $user;

	$scope.updateCart = function() {
		$http.
			put( '/api/v1/me/cart', $user.user).
			success(function( data ) {
				$scope.updated = true;
			});
	};

	// For checkout
  Stripe.setPublishableKey('pk_test_M0McxbJS8arMnK20BECJYkZa');

	$scope.stripeToken = {
		number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2016'
	};

	$scope.checkout = function() {
		$scope.error = null;
		Stripe.card.createToken( $scope.stripeToken, 
			function( status, response ) {
				if ( status.error ) {
					$scope.error =  status.error;
					return;
				}

				$http.
					post( '/api/v1/checkout', {
						stripeToken : response.id
					}).
					success(function( data ) {
						$scope.checkedOut = true;
						$user.user.data.cart = [];
					});
			});
	};
};

exports.SearchBarController = function( $scope, $http ) {
	$scope.searchText = '';
	
  $scope.update = function() {   

    $http.
      get( '/api/v1/product/text/' + $scope.searchText).
      success(function (data ) {
        $scope.results = data.products;
      });
  };
};