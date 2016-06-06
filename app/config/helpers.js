'use strict';

var _ = require('lodash'),
	moment = require('moment');

require('moment/locale/pt-br');

moment.locale('pt-br');

exports.excerpt = function(text) {
	var limit = 100;
	
	if( text && text.length > limit) {
		text = text.substring(0,limit) + '...';
	}
	
	return text;
};

/*lt: function (v1, v2) {
	return v1 < v2;
},
gt: function (v1, v2) {
	return v1 > v2;
},
lte: function (v1, v2) {
	return v1 <= v2;
},
gte: function (v1, v2) {
	return v1 >= v2;
},*/

exports.eq = function (v1, v2) {
	return v1 === v2;
};

exports.ne = function (v1, v2) {
	return v1 !== v2;
};

exports.and = function (v1, v2) {
	return v1 && v2;
};

exports.or = function (v1, v2) {
	return v1 || v2;
};

exports.in = function (str, token) {
	return str.indexOf(token) !== -1;
};

exports.pageTitle = function( opts ) {
	var page = _.find(this.pages, {
		template: opts.data.exphbs.view
	});

	return page && page.name || 'Home';
};

exports.formatTitle = function( text ){
	return _.startCase( text && text.toLowerCase() );
};

exports.json = function(obj) {
	return JSON.stringify(obj);
};

exports.formatDateFromNow = function(date) {
	return moment(date).fromNow();
};

exports.formatDate = function(date, format) {
	format = format || 'DD/MM/YYYY';
	return moment(date).format(format);
};

exports.getDateFrom = function(date, formated) {
	return moment(date, formated !== false ? 'DD/MM/YYYY': null).toDate();
};

exports.show = function( exp ) {
	return exp ? 'show' : 'hide';
};

exports.selected = function(value, elem) {
	return _.isEqual(value, elem) ? 'selected' : '';
};

exports.checked = function(value, elem) {
	return _.isEqual(value, elem) ? 'checked' : '';
};

exports.active = function(value, elem) {
	return _.isEqual(value, elem) ? 'active' : '';
};