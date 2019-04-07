var gulp = require('gulp');
var babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var WebpackDevServer = require('webpack-dev-server');
var shell = require('gulp-shell');

var watchFiles = [
  'scripts/colorNamer/src/**/*.js',
  'scripts/colorNamer/src/**/*.json',
  'scripts/colorNamer/target/**',
  'test/**'
];
var outPutFolder = 'scripts/colorNamer/target';

gulp.task('default-watch', () => {
  return gulp.watch(watchFiles[0], [/*'test',*/'webpack']);
});

gulp.task('build', ['webpack']);

gulp.task( 'babel', () => {
  // return gulp.src(watchFiles[0]).pipe(shell([
  //   "babel ./scripts/colorNamer/src -d "+ outPutFolder +" --presets es2015 --plugins minify-mangle-names --minified --no-comments --source-maps -watch"
  // ]));
  return gulp.src(watchFiles[0])
    // .pipe(sourcemaps.init())
    .pipe(babel({
      sourceMaps: true
    }))
    // .pipe(sourcemaps.write('../target', {addComment: false}))
    .pipe(gulp.dest(outPutFolder));
});


gulp.task('test', ['babel'], () => {
  return gulp.src('test/*.js')
    .pipe(mocha())
    .on('error', () => {
      gulp.emit('end');
    });
});


gulp.task('webpack', ['babel','test'], function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ];

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    callback();
  });
});
gulp.task('jekyll-server', [], shell.task([
  'jekyll serve'
]));

/*
gulp.task('server', ['webpack'], function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true
    },
    hot: true
  }).listen(8080, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});
*/
