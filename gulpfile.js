/*! gulpfile.js */

var exec = require('child_process').exec;
var webbuild = require('gulp-webbuild');
var gulp = webbuild.gulp;
var buildJs = webbuild.buildJs;
var buildCss = webbuild.buildCss;
var buildMove = webbuild.buildMove;
var buildInject = webbuild.buildInject;
var buildFileSys = webbuild.buildFileSys;

// project
var proj = 'C:/Voliware/Web/AjaxPlus/';

// source
var src = proj + 'src/js/';

// dist
var dist = proj + 'dist/js/';

// WebUtil
var webUtil = 'C:/Voliware/Web/WebUtil/src/js/';

/**
 * Bulid the ajax plus lib
 * @returns {*}
 */
function buildAjaxPlus(){
	var js = [
		webUtil + 'util.js',
		webUtil + 'eventSystem.js',
		src + 'ajaxModule.js',
		src + 'ajaxPoll.js',
		src + 'ajaxMonitor.js',
		src + 'ajaxQueue.js',
		src + 'ajaxSequence.js'
	];
	return buildJs(js, dist, 'ajaxPlus');
}

/**
 * Build js doc
 */
function buildJsDoc(){
	var cmd = 'jsdoc -c conf.json';
	return exec(cmd, function(error, stdout, stderr) {
		console.log('js doc done');
	});
}

// tasks
gulp.task('all', function(){
	buildJsDoc();
	return buildAjaxPlus();
});

// individual tasks
gulp.task('ajax', function(){
	return buildAjaxPlus()();
});

gulp.task('jsdoc', function(){
	buildJsDoc();
});