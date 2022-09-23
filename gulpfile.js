const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

function bootstrap() {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
      .pipe(gulp.dest('src/js'))
      .pipe(browserSync.stream());
}
exports.bootstrap = bootstrap;

function bootstrapmap() {
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map')
      .pipe(gulp.dest('src/js'))
      .pipe(browserSync.stream());
}
exports.bootstrapmap = bootstrapmap;

function typescript() {
  return gulp.src('src/ts/**/*.ts')
      .pipe(ts({declaration: false}))
      .js.pipe(gulp.dest('src/js'))
      .pipe(uglify())
      .pipe(browserSync.stream());
}
exports.typescript = typescript;

function styles() {
  return gulp.src('src/styles.scss')
      .pipe(sass().on('error',sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('src/css'))
      .pipe(browserSync.stream());
}
exports.styles = styles;

function runBuild() {
  typescript();
  bootstrap();
  bootstrapmap();
  styles();
}

async function dev() {
  runBuild();

  browserSync.init({
    server: {
      baseDir: "./src",
      index: "/index.html"
    }
  });
  gulp.watch('src/styles.scss', styles);
  gulp.watch('src/scss/**/*.scss', styles);
  gulp.watch('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', bootstrap);
  gulp.watch('src/ts/**/*.ts', typescript);
  gulp.watch('./**/*.css').on('change', browserSync.reload);
  gulp.watch('./**/*.html').on('change', browserSync.reload);
  gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}
exports.dev = dev;

async function build() {
  gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
      .pipe(gulp.dest('dist/js'));
  gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map')
      .pipe(gulp.dest('dist/js'));
  gulp.src('src/ts/**/*.ts')
      .pipe(ts({declaration: false}))
      .js.pipe(gulp.dest('dist/js'))
      .pipe(uglify());
  gulp.src('src/styles.scss')
      .pipe(sass().on('error',sass.logError))
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('dist/css'));
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
}
exports.build = build;
