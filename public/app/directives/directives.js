exports.navBar = function() {
	return {
		controller : 'NavBarController',
		templateUrl : '/app/views/nav_bar.html'
	};	
};

exports.productDetails = function() {
	return {
		controller : 'ProductDetailsController',
		templateUrl : '/app/views/product_details.html'
	};
};

exports.categoryTree = function() {
	return {
		controller : 'CategoryTreeController',
		templateUrl : '/app/views/category_tree.html'
	};
};

exports.categoryProducts = function() {
	return {
		controller : 'CategoryProductsController',
		templateUrl : '/app/views/category_products.html'
	};
};