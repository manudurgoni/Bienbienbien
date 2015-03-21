'use strict';

/*
    IMPORTS

    Holdall for plugins and conf
    to avoid polluting the main.
 */

var Vue = require('vue'),
    viewport = require('../directives/viewport'),
    route = require('vue-route'),
    TweenMax = require('TweenMax');

/*
    TweenMax
*/
TweenLite.defaultEase = Expo.easeOut; // So I don't have to write it every time

/*
    Vue plugins
 */
Vue.directive('viewport', viewport);
Vue.use(route);
Vue.config.debug = true;

Vue.transition('fade', {
    beforeEnter: function(el) {
        // a synchronous function called right before the
        // element is inserted into the document.
        // you can do some pre-styling here to avoid
        // FOC (flash of content).
    },
    enter: function(el, done) {
        // element is already inserted into the DOM
        // call done when animation finishes.

        var tl = new TimelineMax();
        tl.set(el, {
            autoAlpha: 0,
            y: -30
        }).to(this.$el, 1, {
            autoAlpha: 1,
            y: 0,
            onComplete:function(){
            	done();
            }
        });

        // $(el)
        //     .css('opacity', 0)
        //     .animate({
        //         opacity: 1
        //     }, 1000, done)
        //     // optionally return a "cancel" function
        //     // to clean up if the animation is cancelled
        // return function() {
        //     $(el).stop()
        // }
    },
    leave: function(el, done) {

    		var tl = new TimelineMax();
        tl.to(el, 1, {
            autoAlpha: 0,
            y: 30,
            onComplete:function(){
            	done();
            }
        });

        // same as enter
        // $(el).animate({
        //     opacity: 0
        // }, 1000, done)
        // return function() {
        //     $(el).stop()
        // }
    }
})
