var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var sass   = require('gulp-sass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

gulp.task('build-css', function() {
  return gulp.src('private/assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('usemin', function() {
  return gulp.src('private/*.html')
    .pipe(usemin({
      css: [ rev() ],
      js: [ uglify(), rev() ],
      inlinejs: [ uglify() ],
      inlinecss: [ minifyCss() ]
    }))
    .pipe(gulp.dest('public/'));
});


  gulp.task('scss',['build-css']);
  gulp.task('start',['usemin']);
