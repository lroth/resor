/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2014-04-16
 * Time: 13:30:31
 * Contact: song.chen@qunar.com
 */
// reload page if viewport is changed
var currentViewport = "";
var screens             = [];
screens.push({ name: 'tablet', from: 640, to: 900 });
screens.push({ name: 'mobile', from: 400, to: 640 });
screens.push({ name: 'small-mobile', from: 0, to: 400 });

//App definition
var App = (function ($, undefined) {
    var mobileNav     = $('.mobile-menu');
    var nav           = $('#mainnav');
    var navpos        = nav.offset();
    var mainOffset    = $('section[role="main"]').offset();
    var slider        = $('#fixed-slider');
    var sliderContent = $(slider.find('.content'));
    var sliderNav     = $(slider.find('.next, .prev'));
    var handle        = $('.handle a');
    var animate       = false;
    var current       = 0;
    var currentList   = null;
    var currentLists  = $('.slider-list');
    var spinner       = new Spinner().spin();
    var currentListIndex = 0;

    var showSlider = function(element) {
        var navOffset = nav.offset().top - $(window).scrollTop();

        var animateNav = function() {
            current     = $(element.parent()).index();
            currentList = $(element.closest('.slider-list'));
            currentListIndex = currentList.index() - currentLists.slice(0, currentList.index()).filter(':hidden').length;
            currentLists  = $('.slider-list').filter(':visible');

            fillSlider($(element.find('.slider-content')));

            var items = $(currentList.find('div.slider-content'));

            if (items.length > 1 || currentLists.length > 1) {
                sliderNav.show();
            }

            nav.animate({ top: $(window).height() - navOffset - nav.height() }, 1000, function() {
                nav.addClass('bottom fixed');
                nav.next().css('margin-top', nav.height())
                nav.css('top', '');
                fixedNavigation();
                if (App.isMobile()) {
                    mobileNav.slideUp();
                }
                $('body').toggleClass('noscroll');
                // $("body").css("height", $(window).height());
                // $("body").css("overflow", "hidden");
                animate = false;
            });

            slider.animate({'margin-top': '0'}, 1000);
        }

        if (navOffset > 0) {
            nav.animate({ top: navOffset * -1 }, 250, function() {
                animateNav();
            });
        } else {
            animateNav();
        }
    }

    var hideSlider = function() {
        if (!animate) {
            animate = true;
            var navOffset = mainOffset.top - $(window).scrollTop();

            nav.animate({ bottom: $(window).height() - nav.height() }, 1000, function() {
                nav.removeClass('bottom');
                nav.css('bottom', '');
                handle.unbind('click');
                bindScrollHandle();

                if (navOffset > 0) {
                    nav.animate({'top': navOffset - nav.height()}, 250, function() {
                        nav.removeClass('fixed');
                        nav.css('top', '');
                        nav.next().css('margin-top', 0);
                        fixedNavigation();

                        animate = false;
                    });
                } else {
                    animate = false;
                }
            });

            slider.animate({'margin-top': $(window).height() * -1}, 1000, function() {
                    slider.css('margin-top', '-999%');
                    $('body').toggleClass('noscroll');
                    // $("body").css("height", 'auto');
                    // $("body").css("overflow", "auto");
                    if (App.isMobile()) {
                        mobileNav.slideDown();
                    }
            });
        }
    }

    var fillSlider = function(element) {
        $(sliderContent).prepend(spinner.el);
        var $image = $($(element).html());

        $('<img src="' + $image.data('src') +'"/>').load(function() {
            if (typeof($(currentList).data('with-info')) !== 'undefined') {
                $(sliderContent).html($($(currentList).find('.slider-content-info')).html());
                $(slider).css('background-image', 'url("' + $image.data('src') + '")');
            } else {
                $image.hide().attr('src', $image.data('src')).load(function() {
                    //reposition it
                    $(this).css({
                        'position': 'absolute',
                        'bottom': 145,
                        'left': ($(window).width() - $(this).width()) / 2
                    });
                    // console.log($(this).width());
                    // console.log($(this).height());
                    $(this).fadeIn();
                });
                $(sliderContent).html($image);
            }
        });
    }

    var fixedSlider = function() {
        $('.slider-list > div > a').bind('click', function() {
            if (!animate) {
                animate = true;
                slider.css('margin-top', $(window).height() * -1);
                slider.attr('class', 'fixed-slider ' + $(this).data('type'));
                handle.unbind('click');
                handle.bind('click', function() {
                    hideSlider();

                    return false;
                });

                showSlider($(this));
            }

            return false;
        });

        sliderNav.bind('click', function() {
            var items = $(currentList.find('div.slider-content'));

            if ($(this).hasClass('next')) {
                if (current + 1 < items.length) {
                    current++;
                } else {
                    current = 0;
                    (currentListIndex + 1 < currentLists.length ? currentListIndex++ : currentListIndex = 0);
                    currentList = $(currentLists[currentListIndex]);
                    items = $(currentList.find('div.slider-content'));
                }
            } else {
                if (current > 0) {
                    current--;
                } else {
                    (currentListIndex > 0 ? currentListIndex-- : currentListIndex = currentLists.length - 1);
                    currentList = $(currentLists[currentListIndex]);
                    items = $(currentList.find('div.slider-content'));
                    current = items.length - 1;
                }
            }

            fillSlider($(items.eq(current)));

            return false;
        });
    }

    var processNavigation = function() {
        if ($(window).scrollTop() > navpos.top) {
            nav.addClass('fixed');
            nav.next().css('margin-top', nav.height());
        } else {
            if (!nav.hasClass('bottom')) {
                nav.removeClass('fixed');
                nav.next().css('margin-top', 0);
            };
       }
    }

    var bindScrollHandle = function() {
        handle.bind('click', function(e) {
            $('html, body').animate({
                scrollTop: nav.next().offset().top
            }, 500);

            e.preventDefault();
        });
    }

    var fixedNavigation = function() {
        $(window).bind('scroll', function() {
            processNavigation();
        });
    };

    var isMobile = function() {
        // return false;
        // console.log($(window).width());
        return ($(window).width() < screens[1].to);
        // return (!!('ontouchstart' in window) // works on most browsers
        //     || !!('onmsgesturechange' in window) // works on ie10
        //     || !!($(window).width() < 700)); // dev debug mode
    };

    var isTouch = function() {
        return (!!('ontouchstart' in window) || !!('onmsgesturechange' in window));
    };

    return {
        isTouch: function() {
            return isTouch();
        },

        isMobile: function() {
            return isMobile();
        },

        //main method to initiate template pages
        init: function () {
            //call local function
            if (!isMobile()) {
                fixedNavigation();
            };
            fixedSlider();
            bindScrollHandle();

            if ($('.bxslider-partners').length) {
                $('.bxslider-partners').bxSlider({
                    'touchEnabled': true,
                    'pager': true,
                    'controls': false,
                    'adaptiveHeight': true
                });
            };

            if (isMobile() && $('.bxslider').length) {
                // hacky way to enable touchstart in android chrome
                var el = document.getElementsByTagName("body")[0];
                el.addEventListener("touchstart", function() { return true }, false);
                $('.bxslider').bxSlider({
                    'touchEnabled': true,
                    'pager': true,
                    'controls': false,
                    'adaptiveHeight': true
                });
            }

            if (isTouch()) {
                // console./log(isTouch)
                $('.show-on-touch').css('display', 'block');

                //don't bounce
                document.addEventListener('touchmove', function(event) {
                   if(event.target.parentNode.className.indexOf('fixed-slider') != -1
                || event.target.className.indexOf('fixed-slider') != -1 ) {
                    event.preventDefault(); }
                }, false);
            };
        },

        open: function (url)
        {
            window.location.href = url;
        }
    };

}(jQuery));

//App initialize
jQuery(document).ready(function(){
    App.init();

    var setBodyClass = function(noreload) {
        for (var i = screens.length - 1; i >= 0; i--) {
            var item = screens[i];
            if ($(window).width() < item.to && $(window).width() > item.from && !$('body').hasClass(item.name)) {
                $('body').removeClass().addClass(item.name);
                //reload only on breakpoints
                if (noreload !== false) {
                    window.location.reload();
                };
            };
        };
    };

    setBodyClass(false);
    $(window).resize(setBodyClass);

    // (function(doc) {

    //     var addEvent = 'addEventListener',
    //         type = 'gesturestart',
    //         qsa = 'querySelectorAll',
    //         scales = [1, 1],
    //         meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

    //     function fix() {
    //         meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    //         doc.removeEventListener(type, fix, true);
    //     }

    //     if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    //         fix();
    //         scales = [.25, 1.6];
    //         doc[addEvent](type, fix, true);
    //     }

    // }(document));
});


