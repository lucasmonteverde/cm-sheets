'use strict';

var gulp		= require('gulp'),
	$			= require('gulp-load-plugins')(),
	del			= require('del'),
	webpack 	= require('webpack-stream'),
	named		= require('vinyl-named'),
	path		= require('path'),
	browserSync = require('browser-sync');

require('dotenv').config({silent: true});

var paths = {
	webpack: 'src/scripts/*.js',
	scripts: ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js'],
	templates: ['src/templates/**/*.html', 'app/views/**/*.html'],
	styles: 'src/styles/**/*.scss',
	images: 'src/images/**/*.{png,jpeg,jpg,svg,gif}',
	extras: ['src/*.*', 'src/fonts/**/*'],
	dest: {
		scripts : 'dist/js',
		styles: 'dist/css',
		images: 'dist/img',
		extras: 'dist'
	}
};

var lint = function (files) {
	return gulp.src(files)
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
};

gulp.task('lint:client', function () {
	return lint(paths.scripts);
});

gulp.task('lint:server', function () {
	return lint( ['server.js', 'app/**/*.js'] );
});

gulp.task('scripts', ['lint:client'], function () {

	return gulp.src( paths.webpack )
		.pipe($.plumber())
		.pipe(named())
		.pipe(webpack({
			output: {
				filename: '[name].min.js'
			},
			externals: {
				'jquery': 'jQuery',
			},
			resolve: {
				root: path.resolve('./src/scripts'),
				/*alias: {
					templates: path.resolve('./src/templates')
				}*/
			},
			module: {
				loaders: []
			},
			plugins: [
				$.util.env.production ? new webpack.webpack.optimize.UglifyJsPlugin({
					minimize: true,
					compress: {
						warnings: false
					}
				}) : $.util.noop,
			],
			devtool: $.util.env.production ? '': '#source-map'
		}))
		.pipe(gulp.dest(paths.dest.scripts));
});

gulp.task('styles', function () {
	return gulp.src(paths.styles)
		.pipe($.plumber())
		.pipe( $.util.env.production ? $.util.noop() : $.sourcemaps.init() )
		.pipe($.sass({
			outputStyle: $.util.env.production ? 'compressed' : 'nested',
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest.styles));
});

gulp.task('images', function () {
	return gulp.src(paths.images)
		.pipe($.plumber())
		.pipe($.newer(paths.dest.images))
		.pipe($.imagemin({
			optimizationLevel: $.util.env.production ? 5 : 1,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(paths.dest.images));
});

gulp.task('extras', function () {
	return gulp.src(paths.extras, {base: 'src'})
		.pipe($.newer(paths.dest.extras))
		.pipe(gulp.dest(paths.dest.extras));
});

gulp.task('clean', function () {
	return del([paths.dest.extras]);
});

gulp.task('serve', ['watch'], function () {
	browserSync({
		files: [ 'dist/**', '!dist/**/*.map', '!dist/**/*.html', '!dist/export/*' ],
		proxy: 'localhost:3000',
		port: 3001,
		ui: false,
		open: !$.util.env.no
	});
});

gulp.task('express', function () {
	return $.nodemon({
				script: 'server.js',
				ext: 'html js',
				ignore: ['public/**', 'src/**', 'dist/**', 'node_modules/**'],
				//tasks: ['lint:server']
			})
			.on('restart', function () {
				gulp.start('lint:server');
				console.log('restarted!');
			});
});

gulp.task('watch', ['scripts', 'styles', 'images', 'extras'], function() { //'html'
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.extras, ['extras']);
	gulp.watch(paths.templates, ['scripts']);
});

gulp.task('default', ['clean', 'express'], function () {
	gulp.start('serve');
});

gulp.task('deploy', ['clean'], function () {
	$.util.env.production = true;

	gulp.start(['scripts', 'styles', 'images', 'extras']);
});

var spawn = require('child_process').spawn;

gulp.task('reload', function() {
	var p;

	function spawnChildren() {
		if(p) {
			p.kill();
		}

		p = spawn('gulp', ['default'], {stdio: 'inherit'});
	}

	gulp.watch('gulpfile.js', spawnChildren);

	spawnChildren();
});