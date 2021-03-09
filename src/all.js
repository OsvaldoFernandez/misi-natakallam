"use strict";
var body = $("body")
  , menu = $(".js-menu")
  , menuButton = $(".js-menu-button")
  , closeMenuButton = $(".js-close-menu-button")
  , mainCarousel = $(".js-main-carousel")
  , testimonialsCarousel = $(".js-testimonials-carousel")
  , universitiesCarousel = $(".js-universities-carousel")
  , social = $(".js-social")
  , header = $(".header")
  , $window = $(window)
  , windowHeight = $window.height()
  , endHeight = $window.height();
menuButton.click(function() {
    menu.addClass("active"),
    body.addClass("hide-overflow")
}),
closeMenuButton.click(function() {
    menu.removeClass("active"),
    body.removeClass("hide-overflow")
});
var settings = function(e, s) {
    return {
        autoplay: !0,
        autoplaySpeed: e,
        arrows: !1,
        easing: "ease",
        pauseOnFocus: !1,
        pauseOnHover: !1,
        speed: 1e3,
        swipe: !1,
        touchMove: !1,
        fade: !0,
        dots: !0,
        appendDots: $(s)
    }
};
mainCarousel.slick(settings(3e5, ".section-1")),
testimonialsCarousel.slick(settings(3e5, ".testimonials-section")),
universitiesCarousel.slick(settings(1e4, ".universities-section")),
$window.on("scroll", function() {
    $(this).scrollTop() > windowHeight ? (social.removeClass("start"),
    header.addClass("minimal")) : (social.addClass("start"),
    header.removeClass("minimal")),
    endHeight = $(document).height() - windowHeight - $(".footer").outerHeight(),
    $(this).scrollTop() > endHeight ? social.addClass("end") : social.removeClass("end")
}).on("resize", function() {
    windowHeight = $(this).height()
});
