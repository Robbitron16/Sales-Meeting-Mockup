//===========================================================================================
// Modules
//===========================================================================================

// Source processing
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");

var ngAnnotate = require('gulp-ng-Annotate');

// Webserver
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');

//=======================================================
// Global definitions
//=======================================================
var partials = 'components/**/*.html';
var scripts = ['lib/*.js', 'app.js', 'components/**/module.js', 'components/**/*.js', '!components/**/*_test.js', '!components/**/*_exclude.js'];
//var css = ['bower_components/html5-boilerplate/css/*.css', 'css/*.css'];
var css = ['css/*.css'];

//=======================================================
// Combine scripts into a single file
//=======================================================
gulp.task('scripts', function () {
  return gulp.src(scripts, {cwd: 'app'})
	.pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
//    .pipe(uglify())
	.pipe(sourcemaps.write())
    .pipe(gulp.dest('./Deploy', {cwd: 'app'}))

	.pipe(connect.reload())
});

//=======================================================
// Combine and preload all HTML templates
//=======================================================
gulp.task('partials', function () {
  return gulp.src(partials, {cwd: 'app'})
	.pipe(minifyHtml({
		empty: true,
		spare: true,
		quotes: true
	}))

	.pipe(ngHtml2Js({
		moduleName: "partials",
	}))

	.pipe(concat("partials.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("./Deploy", {cwd: 'app'}))

	.pipe(connect.reload())
});

//=======================================================
// Combine CSS into a single minified file
//=======================================================
gulp.task('css', function() {
	return gulp.src(css, {cwd: 'app'})
		.pipe(concat('app.min.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('./Deploy', {cwd: 'app'}))

		.pipe(connect.reload())
});

//=======================================================
//=======================================================
gulp.task('deployScripts', function () {
  return gulp.src(scripts, {cwd: 'app'})
    .pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./Deploy', {cwd: 'app'}))

	// Copy files, including HTML templates and minimal bower components
	// Alternately, concat all partials into a single file -- they require wrapping in a script tag.
});

//=======================================================
//=======================================================
gulp.task('webserver', function() {
	connect.server({
		port: 8000,
		livereload: true,

		// HTML5 route support
		root: __dirname + '/app',
		middleware: function(connect, opt) {
			return [historyApiFallback ];
		}
	});
});

//=======================================================
//=======================================================
gulp.task('watch', function() {
	gulp.watch(['index.html', 'lib/*.js', 'app.js', 'components/**/*.js'], {cwd: 'app'}, ['scripts']);
	gulp.watch(css, {cwd: 'app'}, ['css']);
	gulp.watch(partials, {cwd: 'app'}, ['partials']);
});

//=======================================================
// Default Task
//=======================================================
gulp.task('default', ['webserver', 'scripts', 'partials', 'css', 'watch']);