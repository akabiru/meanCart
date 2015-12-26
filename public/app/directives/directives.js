exports.userMenu = function() {
	return {
		controller : 'UserMenuController',
		templateUrl : '/app/views/user_menu.html'
	};	
};

exports.productDetails = function() {
	return {
		controller : 'ProductDetailsController',
		templateUrl : '/app/views/product_details.html'
	};
};