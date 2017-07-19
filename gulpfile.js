// Include Our Plugins
var autoprefixer  = require('gulp-autoprefixer'),
    bump          = require('gulp-bump'),
    clean         = require('gulp-clean'),
    concat        = require('gulp-concat'),
    cssmin        = require('gulp-cssmin'),
    exec          = require('gulp-exec'),
    fs            = require('fs'),
    git           = require('gulp-git'),
    gulp          = require('gulp'),
    include       = require('gulp-include'),
    minimist      = require('minimist'),
    rename        = require('gulp-rename'),
    replace       = require('gulp-replace'),
    runSequence   = require('run-sequence'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    stylelint     = require('gulp-stylelint'),
    swig          = require('gulp-swig'),
    tag_version   = require('gulp-tag-version'),
    zip           = require('gulp-zip'),
    nunjucksRender = require('gulp-nunjucks-render');;


var config = {
   packages: './node_modules' ,
  import_path: './src/sass/'
};

var args = {
  string: 'defcon',
  default: { defcon: process.env.NODE_ENV || 'patch' }
};

var options = minimist(process.argv.slice(2), args);

gulp.task('bump', function() {
  // bump the package version
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(bump({type: options.semver}))
    // save it back to filesystem
    .pipe(gulp.dest('./'));
});

gulp.task('compile', ['clean'], function(){
  runSequence('sass', 'minify', 'kss-html', 'kss', 'kss-public', 'scripts', 'copy-fonts', 'nunjucks');
});

// Clean build
gulp.task('clean', function() {
  return gulp.src([
      './dist',
      './temp',
      './docs',
      './winnie.zip'
    ])
    .pipe(clean({force: true}));
});

gulp.task('default', ['compile'], function(){
  runSequence('watch');
});

// KSS for CSS documentation
gulp.task('kss', ['kss-html'], function(cb) {
  var options = {
    continueOnError: false,
    pipeStdout: true
  };
  var reportOptions = {
    err: true,
    stderr: true,
    stdout: true
  };

  fs.readFile("./kss-html/html/includes/kss-markup.html", "UTF8", function(err, kss_markup) {
    if (err) { throw err };

    gulp.src('./kss-html/html/layouts/kss-template.html')
    .pipe(swig({
      defaults: {
        cache: false
      }
    }))
    .pipe(rename("index.html"))
    .pipe(replace(/INJECT_KSS_MARKUP/g, kss_markup))
    .pipe(gulp.dest('./temp/kss'));

  });

  return gulp.src('./src/sass/**/*.*')
    .pipe(concat('kss'))
    .pipe(exec('./node_modules/kss/bin/kss-node --config=.kss-node.json', options))
    .pipe(exec.reporter(reportOptions));
});

// Compile Templates
gulp.task('kss-html', ['temp'], function(){

  return gulp.src('./kss-html/homepage.md')
    .pipe(swig({
      defaults: {
        cache: false
      }
    }))
    .pipe(rename("homepage.md"))
    .pipe(gulp.dest('./temp/kss'));
});

gulp.task('kss-public', ['kss'], function(){

  gulp.src('./kss-html/sass/kss.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({
          includePaths: ['./src/sass']
        }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./docs/public/css'));

  return gulp.src([
      config.packages + '/jquery/dist/jquery.js',
      './kss-html/js/kss.js'
    ])
    .pipe(concat('kss.js'))
    .pipe(gulp.dest('./docs/public/js'));
});

gulp.task('sass', function() {

  return gulp.src('./src/sass/winnie.scss')
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'));
});



gulp.task('minify', ['sass'], function() {
  return gulp.src('./dist/css/winnie.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'));
});



// Move source over for compiling
gulp.task('temp', function(){
  // Sass
  return gulp.src('./src/sass/**/*.scss')
    .pipe(gulp.dest('./temp/sass/'));
});

// compile and consolidate js
gulp.task('scripts', function() {
  return gulp.src(['./src/js/bootstrap*.js','./src/js/modernizr-2.8.3.min.js','./src/js/wow.js','./src/js/inview.js','./src/js/main.js'])
    .pipe(concat('wom.js'))
    .pipe(gulp.dest('./dist/js/'));
});

// font assets copy to /dist
gulp.task('copy-fonts', function() {
  gulp.src(['./src/fonts/*/*'])
  .pipe(gulp.dest('./dist/fonts/'))
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('./src/sass/**/*.scss', ['sass', 'kss-html', 'kss', 'kss-public']);
  gulp.watch('./kss-html/**/*.*', ['kss-html', 'kss', 'kss-public']);
  gulp.watch(['./mockups/pages/**/*.*', './mockups/templates/**/*.*'], ['nunjucks']);
  gulp.watch('./src/js/*.js', ['scripts']);
});

gulp.task('zip', ['zip-temp-dist', 'zip-temp-docs'], function(){
  return gulp.src('temp/zip/**/*')
    .pipe(zip('winnie.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('zip-temp-docs', function(){

  return gulp.src('docs/**/*')
    .pipe(gulp.dest('./temp/zip/docs'));
});

gulp.task('zip-temp-dist', function(){

  return gulp.src('dist/**/*')
    .pipe(gulp.dest('./temp/zip/dist'));
});

////////////////////////////////////////////////////////////// - nunjucks start
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('mockups/pages/**/*.+(html|nunjucks|njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['mockups/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('mockups'))
});
////////////////////////////////////////////////////////////// - nunjucks restart
