var argv = require('yargs').argv;
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var merge = require('merge-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var config = require('./gulpfile.config');

gulp.task('default', ['build']);
gulp.task('serve', ['build'], serve);
gulp.task('build', ['build-css', 'build-js', 'build-html']);
gulp.task('build-css', ['clean', 'copy'], buildCSS);
gulp.task('build-js', ['clean', 'copy'], buildJS);
gulp.task('build-html', ['clean', 'copy'], buildHTML);
gulp.task('copy', ['clean'], copy);
gulp.task('clean', clean);

function clean() {
  if (!argv.sync) {
    return del(config.site.dest + '**/*');
  }
}

function copy() {
  var images = gulp.src(config.site.globs.images, { cwd: config.site.src })
    .pipe(gulpif(!argv.dev, imagemin()))
    .pipe(gulp.dest(config.site.dest + 'img/'));

  var fonts = gulp.src(config.site.globs.fonts, { cwd: config.site.src })
    .pipe(gulp.dest(config.site.dest + 'fonts/'));

  return merge(images, fonts);
}

function buildCSS() {
  var spriteData = gulp.src(config.site.globs.sprites, { cwd: config.site.src })
    .pipe(spritesmith({
      imgName: '../img/spritesheet.png',
      cssName: 'spritesheet.css'
    }));

  var spritesheet = spriteData.img
    .pipe(gulpif(!argv.dev, buffer()))
    .pipe(gulpif(!argv.dev, imagemin()))
    .pipe(gulp.dest(config.site.dest + 'img/'))

  var scss = gulp.src(config.site.paths.scss, { cwd: config.site.src })
    .pipe(sass())
    .on('error', sass.logError);

  var css = merge(spriteData.css, scss)
    .pipe(concat('styles.css'))
    .pipe(autoprefixer(config.autoprefixer))
    //.pipe(gulpif(!argv.dev, cleanCSS(config.cleanCSS)))
    .pipe(gulpif(!argv.dev, rename({ suffix: '.' + config.revision, extname: '.css' })))
    .pipe(gulp.dest(config.site.dest + 'css/'));

  return merge(spritesheet, css)
    .pipe(browserSync.stream());

}

function buildJS() {
  return gulp.src(config.site.globs.js, { cwd: config.site.src })
    .pipe(concat('scripts.js'))
    .pipe(gulpif(!argv.dev, uglify()))
    .pipe(gulpif(!argv.dev, rename({ suffix: '.' + config.revision, extname: '.min.js' })))
    .pipe(gulp.dest(config.site.dest + 'js/'))
    .pipe(browserSync.stream());
}

function buildHTML() {
  return gulp.src(config.site.paths.index, { cwd: config.site.src })
    .pipe(gulpif(!argv.dev,
      replace('$js_ext', config.revision + '.min.js'),
      replace('$js_ext', 'js')))
    .pipe(gulpif(!argv.dev,
      replace('$css_ext', config.revision + '.css'),
      replace('$css_ext', 'css')))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(config.site.dest))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init(config.browserSync);
  gulp.watch(config.site.paths.scss, { cwd: config.site.src }, ['build-css']);
  gulp.watch(config.site.globs.js, { cwd: config.site.src }, ['build-js']);
  gulp.watch(config.site.paths.index, { cwd: config.site.src }, ['build-html']);
}
