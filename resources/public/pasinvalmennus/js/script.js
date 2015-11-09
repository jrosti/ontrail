var $ = jQuery.noConflict();


// Page Loader
$(window).load(function(){
	$('#loader').fadeOut();
});





/*----------------------------------------------------*/
	/*	Nav Menu & Search
	/*----------------------------------------------------*/
jQuery(document).ready(function(){
    "use strict";
    
	$(".nav > li:has(ul)").addClass("drop");
	$(".nav > li.drop > ul").addClass("dropdown");
	$(".nav > li.drop > ul.dropdown ul").addClass("sup-dropdown");
	

});



////------- Latest News

$(document).ready(function() {
 
  $("#latest-news").owlCarousel({
        pagination: false,
        navigation : true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 5000,
    	items: 2,
        itemsMobile : [559,1],
        itemsDesktopSmall : [991,2],
        itemsDesktopSmall : [1024,2],
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});


////------- Testimonial

$(document).ready(function() {
 
  $("#testimonials").owlCarousel({
        pagination: false,
        navigation : true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 8000,
    	singleItem:true,
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});


////------- Testimonial

$(document).ready(function() {
 
  $("#clients").owlCarousel({
        pagination: false,
        navigation : true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 3000,
    	singleItem:false,
        items: 5,
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});


////------- Pricing Table

$(document).ready(function() {
 
  $("#pricing").owlCarousel({
        pagination: false,
        navigation : true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 3000,
    	singleItem:false,
        itemsMobile : [550,1],
        itemsDesktopSmall : [991,2],
        items: 3,
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});




// Team Carousel

$(document).ready(function() {
 
  $(".our-team").owlCarousel({
        pagination: true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 3000,
        items: 4,
    	//singleItem:true,
        itemsMobile : [550,1],
        itemsDesktopSmall : [991,2],
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});



// Team Carousel

$(document).ready(function() {
 
  $("#management-team").owlCarousel({
        pagination: true,
        slideSpeed : 4500,
		stopOnHover: true,
    	autoPlay: 3000,
        items: 4,
    	//singleItem:true,
        itemsMobile : [550,1],
        itemsDesktopSmall : [991,2],
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});


// Team Carousel

$(document).ready(function() {
 
  $("#architect-team").owlCarousel({
        pagination: true,
        slideSpeed : 4500,
		stopOnHover: true,
    	autoPlay: 6000,
        items: 4,
    	//singleItem:true,
        itemsMobile : [550,1],
        itemsDesktopSmall : [991,2],
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});

// Team Carousel

$(document).ready(function() {
 
  $("#engineer-team").owlCarousel({
        pagination: true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 5000,
        items: 4,
    	//singleItem:true,
        itemsMobile : [550,1],
        itemsDesktopSmall : [991,2],
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});




// ABout Page Slider

$(document).ready(function() {
 
  $(".about-slider").owlCarousel({
        pagination: true,
        slideSpeed : 2500,
		stopOnHover: true,
    	autoPlay: 5000,
    	singleItem:true,
		transitionStyle : "fade",
		navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>']
  });
 
});


// Main Slider Slider

$(document).ready(function() {
 
  $('.carousel').carousel({
    interval: 4000
  });
 
});







// Tab------------------------------

$(document).ready(function() {

    $('.team-section a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });

});



/*---------------------------------------------------*/
/* Progress Bar
/*---------------------------------------------------*/
$(document).ready(function($) {
	"use strict";
    
        $('.skill-shortcode').appear(function() {
            $('.progress').each(function(){ 
                $('.progress-bar').css('width',  function(){ return ($(this).attr('data-percentage')+'%')});
            });
        },{accY: -100});
        
        
});


/*---------------------------------------------------*/
/* Fitvids
/*---------------------------------------------------*/
$(document).ready(function($) {
    "use strict";
    
    $("body").fitVids();
     
});



/*----------------------------------------------------*/
/*	Nice-Scroll
/*----------------------------------------------------*/
$(document).ready(function($) {
	"use strict";
    
	$("html").niceScroll({
		scrollspeed: 100,
		mousescrollstep: 38,
		cursorwidth: 5,
		cursorborder: 0,
		cursorcolor: '#333',
		autohidemode: false,
		zindex: 999999999,
		horizrailenabled: false,
		cursorborderradius: 0,
	});
    
});



/*----------------------------------------*/
/*  Bootstrap Carousel                    */
/*----------------------------------------*/

$(document).ready(function($) {
	"use strict";

    $('.carousel').carousel({
      interval: 2000,
    });

});




/*----------------------------------------------------*/
	/*	Back Top Link
	/*----------------------------------------------------*/
$(document).ready(function($) {
	"use strict";
    
    var offset = 200;
    var duration = 500;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(400);
        } else {
            $('.back-to-top').fadeOut(400);
        }
    });
    $('.back-to-top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
        return false;
    })
    
});