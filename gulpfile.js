var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var reload      = browserSync.reload;
var concat      = require('gulp-concat');
var bourbon     = require('node-bourbon').includePaths;
var jsmin       = require('gulp-jsmin');
var rename      = require('gulp-rename');
var cleanCSS    = require('gulp-clean-css');

var src = {
    scss: './app/assets/scss/**/*.scss',
    html: './app/components/**/*.html'
};

var dist = {
  css: './dist/css',
  js: './dist/js',
}

var angular = [
  './app/app.module.js',
  './app/shared/services.js',
  './app/shared/filters.js',
  './app/components/welcome/welcome.js',
  './app/components/welcome/welcome.controller.js',
  './app/components/words/words.js',
  './app/components/words/words.controller.js',
  './app/components/game/game.js',
  './app/components/game/game.factories.js',
  './app/components/game/game.controller.js',
  './app/components/game/game.directives.js',
  './app/components/result/result.js',
  './app/components/result/result.controller.js'
];

gulp.task('serve', ['sass', 'angularMerge'], function() {
    browserSync.init({
        proxy: "http://localhost:8080/app/",
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(angular, ['angularMerge']);
    gulp.watch(src.html).on('change', reload);
});

gulp.task('sass', function() {
  return gulp.src(src.scss)
    .pipe(concat('main.scss'))
    .pipe(sass({
        errLogToConsole: true,
        includePaths: ['styles'].concat(bourbon)
    }))
    .pipe(gulp.dest(dist.css))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(dist.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('angularMerge', function(){
  return gulp.src(angular)
    .pipe(concat('scripts.js'))
  	.pipe(gulp.dest(dist.js))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('angularMin', function(){
  return gulp.src(angular)
  	.pipe(jsmin())
  	.pipe(concat('scripts.js'))
    .pipe(rename({suffix: '.min'}))
  	.pipe(gulp.dest(dist.js))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('cssMin', function(){
  return gulp.src(dist.css+"/main.css")
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(dist.css));
})

gulp.task('default', ['serve']);
gulp.task('minify', ['angularMin', 'cssMin']);