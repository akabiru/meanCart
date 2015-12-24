var gulp = require('gulp'),
		browserify = require('gulp-browserify');

gulp.task( 'browserify', function() {
	return gulp.
		src('./public/app/app.js').
		pipe( browserify() ).
		pipe( gulp.dest('./public/bin') );
});

gulp.task( 'watch', function() {
	gulp.watch(['./public/app/controllers/*.js', 
		'./public/app/directives/*.js', './public/app/services/*.js'
		], 
		['browserify']);
});