'use strict';

var GoogleSpreadsheet = require('google-spreadsheet'),
	document = new GoogleSpreadsheet('1enUsVbsiFUlyqQUMV8Vo-VsZIL3Fzton57HSUiLqrdU'),
	Promise = require('bluebird'),
	fs = require('fs-extra'),
	_ = require('lodash');
	
Promise.promisifyAll(fs);
Promise.promisifyAll(document);

var debug = require('debug')('app:cms');

var cacheFile = 'content.json';

var omitValues = [ 'app:edited', '_xml', '_links', 'id', 'content', 'save', 'del', 'title'];

/*var getSheetId = function getSheetId( url ) {
	return (url || '').split('/').splice(-2, 1);
};*/

var fileExists = function fileExists( filePath ) {
	try {
		return fs.statSync(filePath).isFile();
	} catch (err) {
		return false;
	}
};

var proccessConfig = function proccessRows( rows ) {
	return _.reduce(rows, function(o, v) {
		o[v.key] = v.value;
		return o;
	}, {});
};


var proccessCustomRow = function proccessRows( rows ) {
	return _.reduce(rows, function(o, v) {
		(o[v.name] || (o[v.name] = []) ).push(v.description);
		return o;
	}, {});
};

var joinRows = function proccessRows( rows ) {
	return _.map(rows, function(o) {
		return _.values(o)[0];
	});
};

var proccessRows = function proccessRows( rows ) {

	rows = _.map(rows, function( row ) {
		return _(row)
			.omit( omitValues )
			.mapValues(function(o) {
				try{
					o = JSON.parse( o && o.toLowerCase() );
				} catch(err){}
				
				return o;
			})
			.value();
	});
	
	if( rows.length ) {
		/*if( rows[0].key && rows[0].value ) {
			rows = proccessConfig( rows );
		}*/

		if( Object.keys(rows[0]).length === 1 ) {
			rows = joinRows( rows );
		}
	}
	
	return rows;
};

var processSheets = function processSheets( index, sheet, content ) {
	
	debug('sheet', index, sheet.title);
	
	return document
		.getRowsAsync(index, {
			offset: 1
		})
		.then(proccessRows)
		.then(function( rows ) {

			//custom rules
			if( sheet.title === 'Especificações - Abas' ) {
				rows = proccessCustomRow( rows );
			}
			
			content[sheet.title] = rows;
		});
	
};

var save = function save( content ) {
	debug('save content');

	return fs.outputJson(cacheFile, content);
};

var load = function load( force ) {
	
	var content = {};

	if( ! force && fileExists(cacheFile) ) {
		return fs.readJsonAsync(cacheFile);
	}
	
	return document
		.useServiceAccountAuthAsync({
			client_email: process.env.DRIVE_CLIENT_EMAIL,
			private_key: process.env.DRIVE_PRICATE_KEY
		})
		.then(function() {
			return document.getInfoAsync();
		})
		.then(function(info) {
			return info.worksheets;
		})
		.each(function(sheet, index) {
			return processSheets(index + 1, sheet, content);
		})
		.then(function() {
			return save(content);
		})
		.then(function() {
			
			//console.log('res', res);
			//debug('content', content);
			
			return content;
		})
		.catch(function(err) {
			console.error('Spreadsheet Error', err);
		});
};

var CMS = function( options ) {
	
	options = options || {};
	
	var loadData = load();
	 
	return function CMS(req, res, next) {

		if( req.query.update ) {
			loadData = load(true);
		} else if ( req.content ) {
			return next();
		}
		
		loadData
			.then(function( data ) {
				//debug('content', data);
				req.content = res.locals = data;
			})
			.then(next);
	};
};

module.exports = CMS;