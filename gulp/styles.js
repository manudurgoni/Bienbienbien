var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    handleErrors = require('./utils/handleErrors'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    argv = require('yargs').argv,
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var env = argv.env != "production";

gulp.task('styles', function() {
    gulp.src('./sass/styles.scss')
    .pipe(plumber())
    .pipe(sass({
        style: 'expanded',
        sourceComments: 'nope'
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer())
    .pipe(env ? gutil.noop() : minifyCSS())
    .pipe(gulp.dest('./static/build/'))
    .pipe(reload({stream: true}));
});