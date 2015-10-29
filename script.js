var stickyNav;

$(document).ready(function(){

	//applyPreloader();
	//randomFeature();


	applyHeader();
	applyNavigation(); 
	//applyMailTo();
	applyResize();
	checkHash();
});

/* Preloader Function */
function applyPreloader() {
	$('.containloader').delay(2000).fadeOut(1000);
}

function randomFeature() {
	function moveClouds(e, s, d) {
    $(e).css('right', '-20%');
        var wait = window.setTimeout(function(){
            $(e).animate ({
                right: '120%'
            }, s, 'linear', function() {
            moveClouds(e, s, d);
        });
    },d);
}

if(!Modernizr.cssanimations) {
    var clouds = [1,2,3,4];
		    
    $.each(clouds, function() {
        var e = $('.cloud-' + this);
        moveClouds(e, e.data('speed'), e.data('delay'));
    });
}

}

/* Header Function */
function applyHeader() {
	$('.jumbotron').css({ height: ($(window).height()) +'px' });
}	

/* Navigation Functions */
function applyNavigation() {
	forClicking();
	scrollSpy();
	stickyNavigation();
}

function forClicking(){
	$('a[href*=#]').on('click', function(e) {
		e.preventDefault();

		if( $( $.attr(this, 'href') ).length > 0 ) {
			$('html, body').animate({
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 400);
		}

		return false;
	});
}

function scrollSpy() {
	$('#navbar').on('activate.bs.scrollspy', function() {
		window.location.hash = $('.nav .active a').attr('href').replace('#', '#/');
	});
}

function stickyNavigation() {
	stickyNav = $('.scroll-down').offset().top + 20;
	$(window).on('scroll', function() {  
		stickyNavigation();  
	});  
	stickyNavigation();
}

function stickyNavigation() {         
	if($(window).scrollTop() > stickyNav) {   
		$('body').addClass('fixed');  
	} else {  
		$('body').removeClass('fixed');   
	}  
}

/* Resize Function */
function applyResize() {
	$(window).on('resize', function() {  
		stickyNav = $('.scroll-down').offset().top + 20;
		$('.jumbotron').css({ height: ($(window).height()) +'px' });
	}); 
}

/* Hash Function */
function checkHash() {
	lstrHash = window.location.hash.replace('#/', '#');
	if($('a[href='+ lstrHash +']').length > 0) {
		$('a[href='+ lstrHash +']').trigger('click');
	}
}