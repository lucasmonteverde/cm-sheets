'use strict';

var express = require('express'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	compression = require('compression'),
	hbs = require('config/engine'),
	fs = require('fs'),
	app = express();

app.engine('html', hbs.engine);

app.set('views', 'app/views');
app.set('view engine', 'html');

app.disable('x-powered-by');

app.use(logger('dev'));
app.use(compression());
app.use(require('libs/cms')());
app.use(require('controllers/index'));
app.use(express.static('dist'));

if( 'development' === app.get('env') ) {
	app.use( errorHandler() );
}

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

 /*jshint unused:false*/
app.use(function(err, req, res, next) {
	
	console.error( 'App Error', err.message, err.stack );
	
	res.status( err.status || 500 );
	
	res.format({
		json: function() {
			res.json( err.message );
		},
		html: function() {
			res.render('error/' + (err.status === 404 ? err.status : 'error'), {
				layout: false
			});
		}
	});
});

app.listen( process.env.PORT || 3000 );

module.exports = app;