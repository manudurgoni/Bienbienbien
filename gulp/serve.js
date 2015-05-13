var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// Watch Files For Changes & Reload
gulp.task('serve', ['clean', 'jshint', 'styles', 'watch'], function () {
    browserSync.init(null, {
        watchTask: true,
        notify: false,
        proxy: 'http://bienbienbien.dev/'
    });

    gulp.watch('./sass/**/*.scss', ['styles']);
    gulp.watch(['./static/build/**/*.js','./static/build/**/*.html', './static/index.html'], reload);
});