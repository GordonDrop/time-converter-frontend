const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const path = require('path');

const conf = require('../conf/gulp.conf');

gulp.task('styles', styles);

function styles() {
  return gulp.src(conf.path.src('index.less'))
    .pipe(sourcemaps.init())
    .pipe(less({compress: false})).on('error', conf.errorHandler('Less'))
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(conf.path.tmp()))
    .pipe(browserSync.stream());
}

gulp.task('fonts', fonts);
function fonts(){
  return gulp.src([
    'bower_components/font-awesome/fonts/*',
    'bower_components/bootstrap/fonts/*'
  ])
  .pipe(gulp.dest(path.join(conf.path.dist(), '/fonts/')));
}