'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
// const reactify = require('reactify');


gulp.task('browserify', () => {

  const bundler = browserify({
    entries: ['./app/app.js'], // Only need initial file, browserify finds the deps
    // transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  })
  .transform('babelify', { presets: ["es2015", "react"] });

  const watcher = watchify(bundler);

  return watcher
    .on('update', () => { // When any files update
      console.log('JS file update detected, re-processing');
      watcher
        .bundle() // Create new bundle that uses the cache for high performance
        .on('error', (err) => {
          console.log(err);
        })
        .pipe(source('app.js'))
// This is where you add uglifying etc.
// TODO this is a duplicate of the bundle, source, etc below.
        .pipe(gulp.dest('./static/js/'));
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', (err) => {
      console.log(err);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./static/js/'));
});


gulp.task('default', ['browserify']);