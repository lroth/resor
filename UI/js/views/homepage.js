/* global App */
(function($, App, window, undefined) {
    var animation = function() {

        var controller;
        // if (Modernizr.touch) {
        //         // init the controller
        //         controller = new ScrollMagic({
        //             container: "#animation"
        //         });

        //         var myScroll;
        //             // wrap for iscroll
        //             $("body")
        //                 .wrapInner('<div class="scrollContent"></div>')
        //                 .wrapInner('<div class="scrollContainer" id="wrapper"></div>');

        //             // add iScroll
        //             // myScroll = new IScroll('#wrapper', { useTransform: true, useTransition: false, probeType: 3});
        //             myScroll = new IScroll('#wrapper', {scrollX: false, scrollY: true, scrollbars: false, useTransform: false, useTransition: false, probeType: 3});

        //             // myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true });

        //             // update container on scroll
        //             myScroll.on("scroll", function () {
        //                 controller.update();
        //             });

        //             // overwrite scroll position calculation to use child's offset instead of parents scrollTop();
        //             controller.scrollPos(function () {
        //                 return -myScroll.y;
        //             });

        //     }
        controller = new ScrollMagic();

        // build tween
        var tween               = TweenMax.to("#cross", 0.5, {rotation: 135, ease: Linear.easeNone});
        var tween_opacity_cross = TweenMax.to("#cross", 0.5, {opacity: 0});
        var tween_opacity_dark  = TweenMax.to("#cross-dark", 0.5, {opacity: 1});

        // build scene
        var scene = new ScrollScene({triggerElement: "#cross", offset: 150, duration: 690})
                        .setPin("#cross")
                        .setTween(tween)
                        .addTo(controller);

        // switch crosses
        var scene = new ScrollScene({triggerElement: "#cross", offset: 790, duration: 50})
                        .setTween(tween_opacity_cross)
                        .addTo(controller);
                        // .addIndicators();
        var scene = new ScrollScene({triggerElement: "#paper", offset: 330, duration: 40})
                        .setTween(tween_opacity_dark)
                        .addTo(controller);
                        // .addIndicators();

        //show paper
        var scene = new ScrollScene({triggerElement: "#paper", offset: 330, duration: 2000})
                        .setPin("#paper")
                        .addTo(controller);
                        // .addIndicators();

        //hide default info
        var tween_hide_default = TweenMax.to("#default-container", 0.2, {opacity: 0});
        new ScrollScene({triggerElement: "#animation", offset: 900, duration: 100})
                        .setTween(tween_hide_default)
                        .addTo(controller);



        // show brain
        var tween_show_brain = TweenMax.to("#brain, #brain-container", 0.5, {opacity: 1});
        var scene = new ScrollScene({triggerElement: "#animation", offset: 900, duration: 200})
                        .setTween(tween_show_brain)
                        .addTo(controller);
                        // .addIndicators();

        // hide brain
        var tween_hide_brain = TweenMax.to("#brain-container", 0.5, {opacity: 0});
        new ScrollScene({triggerElement: "#animation", offset: 1400, duration: 200})
                        .setTween(tween_hide_brain)
                        .addTo(controller);

        //rotate the cross
        // var tween_show_brain = TweenMax.to("#brain", 0.5, {opacity: 1});
        var tween_cross      = TweenMax.to("#cross-dark", 0.5, {rotation: 90, ease: Linear.easeNone});
        var tween_anatomy    = TweenMax.to(".anatomy", 0.5, {rotation: -90, ease: Linear.easeNone});
        var tween_show_mouth = TweenMax.to("#mouth, #mouth-container", 0.5, {opacity: 1});
        new ScrollScene({triggerElement: "#animation", offset: 1400, duration: 200})
                        .setTween(tween_cross)
                        .addTo(controller);
        new ScrollScene({triggerElement: "#animation", offset: 1400, duration: 200})
                        .setTween(tween_anatomy)
                        .addTo(controller);
        new ScrollScene({triggerElement: "#animation", offset: 1400, duration: 200})
                        .setTween(tween_show_mouth)
                        .addTo(controller);
        // hide mouth
        var tween_hide_mouth = TweenMax.to("#mouth-container", 0.5, {opacity: 0});
        new ScrollScene({triggerElement: "#animation", offset: 1900, duration: 200})
                        .setTween(tween_hide_mouth)
                        .addTo(controller);

        var tween_cross   = TweenMax.to("#cross-dark", 0.5, {rotation: 180, ease: Linear.easeNone});
        var tween_anatomy = TweenMax.to(".anatomy", 0.5, {rotation: -180, ease: Linear.easeNone});
        var tween_show_hand = TweenMax.to("#hand, #hand-container", 0.5, {opacity: 1});
        new ScrollScene({triggerElement: "#animation", offset: 1900, duration: 200})
                        .setTween(tween_cross)
                        .addTo(controller);
        new ScrollScene({triggerElement: "#animation", offset: 1900, duration: 200})
                        .setTween(tween_anatomy)
                        .addTo(controller);
        new ScrollScene({triggerElement: "#animation", offset: 1900, duration: 200})
                        .setTween(tween_show_hand)
                        .addTo(controller);

        // hide hand
        var tween_hide_hand = TweenMax.to("#hand-container", 0.5, {opacity: 0});
        new ScrollScene({triggerElement: "#animation", offset: 2400, duration: 200})
                        .setTween(tween_hide_hand)
                        .addTo(controller);

        var tween_cross      = TweenMax.to("#cross-dark", 0.5, {rotation: 270, ease: Linear.easeNone});
        var tween_anatomy    = TweenMax.to(".anatomy", 0.5, {rotation: -270, ease: Linear.easeNone});
        var tween_show_heart = TweenMax.to("#heart, #heart-container", 0.5, {opacity: 1});
        new ScrollScene({triggerElement: "#animation", offset: 2400, duration: 200})
                        .setTween(tween_cross)
                        .addTo(controller);
        new ScrollScene({triggerElement: "#animation", offset: 2400, duration: 200})
                        .setTween(tween_anatomy)
                        .addTo(controller);
                        // .addIndicators();
        new ScrollScene({triggerElement: "#animation", offset: 2400, duration: 200})
                        .setTween(tween_show_heart)
                        .addTo(controller);
    }

    //if on desktop - launch it
    if (!App.isMobile()) {
        animation();
    };


})(jQuery, App, window);
