var hbs = require('express-handlebars');

module.exports = hbs.create({
	defaultLayout: 'main',
	extname: '.html',
	layoutsDir: 'app/views/templates',
	partialsDir: 'app/views/partials',
	helpers: require('config/helpers')
});