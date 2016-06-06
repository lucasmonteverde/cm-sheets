'use strict';

//var Uri = require('jsuri');

require('app/helpers');

//load lib
require('vendor/nitro');

//load modules
//require('app/plugins');

Nitro.setup([], function() {
	
	
	$('a[data-toggle="tab"]').click(function(e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	var headerHeight,
		$navbar = $('.navbar-custom'),
		MQL = 1170;
	
	var navScroll = function() {
		var currentTop = $(window).scrollTop();
		//check if user is scrolling up
		if ( currentTop < this.previousTop ) {
			//if scrolling up...
			if ( currentTop > 0 && $navbar.hasClass('is-fixed') ) {
				$navbar.addClass('is-visible');
			} else {
				$navbar.removeClass('is-visible is-fixed');
			}
		} else {
			//if scrolling down...
			$navbar.removeClass('is-visible');
			if ( currentTop > headerHeight && ! $navbar.hasClass('is-fixed') ) {
				$navbar.addClass('is-fixed');
			}
		}
		this.previousTop = currentTop;
	};

	//primary navigation slide-in effect
	if ( $(window).width() > MQL ) {
		headerHeight = $('.navbar-custom').height();
		$(window).on('scroll', { previousTop: 0 }, navScroll );
	}
	
});
