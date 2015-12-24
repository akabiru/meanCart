var status = require('http-status');

exports.$user = function( $http ) {
	var s = {};

	s.loadUser = function() {
		$http.
			get( '/api/v1/me' ).
			success(function( data ) {
				// get the user object
				s.user = data.user;
			}).
			error(function( data, $status ) {
				if ( $status === status.UNAUTHORIZED ) {
					s.user = null;
				}
			});
	};

	s.loadUser();

	// load user every hour
	setInterval( s.loadUser, 60 * 60 * 1000 );

	return s;
};