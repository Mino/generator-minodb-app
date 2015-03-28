var gulp = require('gulp');
var gutil = require('gulp-util');
var logger = require('tracer').console();
var path = require('path');

var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var concat = require('gulp-concat');
var gulpImports = require('gulp-imports');
var mocha = require('gulp-mocha');

var onError = function (err) {  
    gutil.beep();
    console.log(err);
};

gulp.task('test', function(cb){
    gulp.src( [ 'test/test.js' ] )
    .pipe( mocha( {
        reporter: 'spec'
    }))
    .on('end', cb)
    .on('error', gutil.log)
});

gulp.task('less', function(){
    gulp.src('./public_src/style/style.less')
    .pipe(plumber(onError))
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/'));    
});

gulp.task('js', function(){
    gulp.src([
        'public_src/init.js'
    ])
    .pipe(plumber(onError))
    .pipe(gulpImports())
    .pipe(concat('frontend.js'))
    .pipe(gulp.dest('public/'))
});

gulp.task('watch', function(){

    gulp.watch(['public_src/**/*.js'], ['js']);
    gulp.watch(['public_src/**/*.less', 'public_src/**/*.subless'], ['less']);    

});

gulp.task('nodemon', function () {
    nodemon({ script: 'server.js', watch: [
        'server.js',
        'public_src/',
        'node_modules/minodb/',
        'views/'
    ], ext: 'js'})
        .on('restart', function () {
            console.log('restarted!')
        })
})

gulp.task('default', function(){
    gulp.start('nodemon');
})