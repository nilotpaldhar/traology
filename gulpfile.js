// Load plugins
const gulp = require('gulp'),
	{ src, series, dest, watch } = gulp,
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	terser = require('gulp-terser-js'),
	csso = require('gulp-csso'),
	babel = require('gulp-babel'),
	merge = require('merge-stream');

function compileSass() {
	return (
		src('./src/sass/*.scss')
			.pipe(sass())
			.pipe(
				autoprefixer({
					cascade: false,
				})
			)
			.pipe(dest('src/css'))
			// Stream changes to all browsers
			.pipe(browserSync.stream())
	);
}

function modules() {
	const bootstrap = src('./node_modules/bootstrap/**/*').pipe(
		dest('./src/vendor/bootstrap')
	);
	const jquery = src('./node_modules/jquery/dist/*').pipe(
		dest('./src/vendor/jquery')
	);
	const smoothScroll = src('./node_modules/smooth-scroll/dist/*').pipe(
		dest('./src/vendor/smooth-scroll')
	);

	// node_modules\slick-carousel\slick
	return merge(bootstrap, jquery, smoothScroll);
}

function optimiseAssests() {
	return src('./src/*.html')
		.pipe(useref())
		.pipe(
			gulpif(
				'*.js',
				babel({
					presets: ['@babel/env'],
				})
			)
		)
		.pipe(gulpif('*.js', terser()))
		.pipe(gulpif('*.css', csso()))
		.pipe(dest('./dist'));
}

function images() {
	return src('./src/images/**/*').pipe(dest('dist/images'));
}

function serve() {
	browserSync.init({
		server: {
			baseDir: './src',
		},
		port: 4000,
	});
	gulp.watch('./src/sass/**/*.scss', series(compileSass));
	gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('./src/*.html').on('change', browserSync.reload);
}

const build = series(compileSass, optimiseAssests, images);
const dev = series(modules, serve);

exports.compileSass = compileSass;
exports.serve = serve;
exports.optimiseAssests = optimiseAssests;
exports.modules = modules;
exports.images = images;

exports.build = build;
exports.dev = dev;
exports.default = dev;
