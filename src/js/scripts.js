$(document).ready(function () {

  lightbox.option({
    'resizeDuration': 300,
    'fadeDuration': 200
  });

  var $scrollToTop = $('.scroll-to-top');
  $scrollToTop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $scrollToTop.fadeIn();
    } else {
      $scrollToTop.fadeOut();
    }
  });
  $scrollToTop.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

  $(".navbar-nav .nav-link").click(function (event) {
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
      $("#navbar").collapse('hide');
    }
  });

  $('nav').singlePageNav({
    offset: $('.navbar').outerHeight(),
    filter: ':not(.external)',
    speed: 750,
    currentClass: 'active'
  });
});
