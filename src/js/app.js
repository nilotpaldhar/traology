$(document).ready(function () {
	// Smooth scroll
	SmoothScroll('a[href*="#"]', {
		offset: 150,
		speed: 900,
	});

	// Instantiate bootstrap scrollspy
	$('body').scrollspy({
		target: '#top-nvigation',
		offset: 200,
	});

	// Toggle nav fixed-top and shadow class
	$(document).scroll(function () {
		var navbar = $('#top-nvigation');
		navbar.toggleClass(
			'fixed-top shadow',
			$(this).scrollTop() > navbar.height() + 100
		);
	});

	// Testimonial slider
	$('#testimonial-slider').slick({
		autoplay: true,
		speed: 800,
		arrows: false,
		dots: true,
	});
});
