/*! 
 * Jussi Nitro - v2.1.0 @license MIT
 */

/*!
 * Jussi Nitro v2.1.0
 * Copyright (c) 2015 Lucas Monteverde
 * Under MIT License
 */
 
;(function($, window, document, undefined){

	'use strict';

	var Nitro = window.Nitro = (function() {

		var log = false,
			modules = {};

		var loader = function() {
			$('[data-module]', document).each(function() {
				return Nitro.module.call( this, $(this).data('module') );
			});
		};

		var debug = function() {
			var args = Array.prototype.slice.call(arguments);
			args.unshift('%cNitro:', 'color:blue;');
			return log && console.info.apply(console, args);
		};

		return {

			setup: function(dep, func) {

				if( $.isFunction(dep) ) {
					func = dep;
				}

				if( ! $.isArray(dep) ) {
					dep = [];
				}

				return $(function(){
					$(document).ready(function() {
						func.apply({}, dep.map(Nitro.module) );
						loader();
					});
				});
			},

			module: function(name, dep, func) {

				if( $.isFunction(dep) ) {
					func = dep;
				}

				if( ! $.isArray(dep) ) {
					dep = [];
				}

				if( modules[name] ) {
					
					var m = {}; //Object.create(null);

					modules[name].apply(m, modules[name].dep.map(Nitro.module) );

					debug('modules ' + name + ' started');

					return m;

				}else if( $.isFunction(func) ) {
					debug('defining module', name);

					func.dep = dep;

					modules[name] = func;
				}

				//return modules[name];
			}
		};
	})();

	return Nitro;

})(jQuery, window, document);