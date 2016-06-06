'use strict';

var router = require('express').Router(),
	fs = require('fs-extra'),
	glob = require('glob');

var renderTemplates = function(req, res, next) {
	
	//console.log('CMS', req.content);
	
	/*glob('dist/** /*.html', function(err, files) {
		files.forEach(function(file) {
			fs.remove(file);
		});
	});*/
	
	glob('app/views/**/*.html', {
		ignore: ['**/templates/*', '**/partials/*']
	}, function(err, files) {
		
		files.map(function( file ) {
			return file.replace('app/views/', '');
		}).forEach(function( file ) {
			req.app.render( file, res.locals, function(err, html) {
				fs.outputFile('dist/' + file, html);
			});
		});
		
		next();
		
	});
	
};

router.get(['/', '/:view.html'], renderTemplates, function(req, res) {
	res.render( req.params.view || 'index' );
});

module.exports = router;