var gulp = require('gulp');
var notify = require('gulp-notify');
var nodemon = require('gulp-nodemon');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var pjson = require('./package.json');
var livereload = require('gulp-livereload');
var tsProject = typescript.createProject('tsconfig.json', {
  declaration: false,
});

gulp.task('backendSrc', function() {
  var tsResult = tsProject.src()
    .pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write({
      // Return relative source map root directories per file.
      sourceRoot: function (file) {
        var sourceFile = path.join(file.cwd, file.sourceMap.file);
        return path.relative(path.dirname(sourceFile), file.cwd);
      }
    }))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  livereload.listen();

  nodemon({
    // the script to run the app
    script: './build/index.js',
    tasks: ['backendSrc'],
    ext: 'ts json', //den vazw ext: ts json .js gt exoume ts isws gia json to xreiastoume alla 9a exei confict me to serverAssets 9a dw.
    ignore: ['build/', 'gulpfile.js', 'package.json', 'tsconfig.json']
  }).on('restart', function() {
    // when the app has restarted, run livereload.
    gulp.src('./build/index.js')
      .pipe(livereload())
      .pipe(notify('Server restarted, reloading page...'));
  });
});

gulp.task('default', gulp.series(['backendSrc']), function() {});
gulp.task('dev', gulp.series(['backendSrc', 'watch']), function() {});
