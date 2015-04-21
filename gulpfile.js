'use strict';

var browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  gutil = require('gulp-util');

var browserifyOpts = {
  entries: './index.js',
  standalone: 'HermesMessenger'
};

gulp.task('dist', function() {
  var b = browserify(browserifyOpts);

  return b.bundle()
    .pipe(source('hermes-messenger.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/'))
    //.pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    //.pipe(sourcemaps.write('maps/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['dist']);
