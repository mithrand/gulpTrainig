const gulp = require('gulp');
const concat = require('gulp-concat');
const myth = require('gulp-myth');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const path = require('path');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const imagesMin = require('gulp-imagemin');
const connect = require('connect');
const serve = require('serve-static');
const browsersync = require('browser-sync');

const CSS_FILES = ['app/**/*.css'];
const SCRIPTS_FILES = ['app/**/*.js'];
const IMAGES_FILES = ['app/img/*.*'];
const HTML_FILES = ['app/**/*.html'];
const BUILD_FOLDER = 'build';


gulp.task('styles', () => {
  return gulp.src(CSS_FILES)
    .pipe(concat('all.css'))
    .pipe(myth())
    .pipe(gulp.dest(path.join(BUILD_FOLDER, 'css')));
});

gulp.task('lint', () => {
  return gulp.src(SCRIPTS_FILES)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', ['lint'], () => {
  return gulp.src(SCRIPTS_FILES)
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(path.join(BUILD_FOLDER, 'js')));
});

gulp.task('images', () => {
  return gulp.src(IMAGES_FILES)
    .pipe(imagesMin())
    .pipe(gulp.dest(path.join(BUILD_FOLDER, 'img')));
});

gulp.task('html', () => {
  return gulp.src(HTML_FILES)
    .pipe(gulp.dest(BUILD_FOLDER));
});

gulp.task('build', ['scripts', 'styles', 'images', 'html']);

gulp.task('watch', () => {
  gulp.watch(CSS_FILES, ['styles', browsersync.reload]);
  gulp.watch(SCRIPTS_FILES, ['scripts', browsersync.reload]);
  gulp.watch(IMAGES_FILES, ['images', browsersync.reload]);
  gulp.watch(HTML_FILES, ['html', browsersync.reload]);
});

gulp.task('server', () => {
  return connect().use(serve(path.join(__dirname, BUILD_FOLDER)))
    .listen(8080)
    .on('listening', () => {
      console.log('Server Running: View at http://localhost:8080');
    });
});

gulp.task('browsersync', () => {
  return browsersync({
    server: {
      baseDir: './',
    },
  });
});

gulp.task('default', ['build', 'server','browsersync', 'watch']);

