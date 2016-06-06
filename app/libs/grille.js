'use strict';

var Grille = require('grille');

//var grille = new Grille('1r2SaVhOH6exvevx_syqxCJFDARg-L4N1-uNL9SZAk04');
var grille = new Grille('1RX_QPO28kD5rJQNYxFt1l4-1uh0ofCyEUgtFdFAlB9w');

//grille.storage.clear();

console.log( 'spreadsheet', grille.spreadsheets[0].meta_worksheet.spreadsheet );

/*grille.load(function(err) {
	console.log(grille.content);
	// run application
});*/

console.log('old version', grille.version);

grille.update(function(err) {
	if( err ) {
		return console.error(err);
	}
	
	console.log(grille.content);
	console.log('new version', grille.version);
});

module.exports = grille;