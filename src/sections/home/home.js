'use strict';

var TweenMax = require('TweenMax');

var _this;

module.exports = {
  inherit: true,
  replace: true,
  template: require('./home.html'),

  data: function() {
    return {};
  },

  transitions: {
    appear: {
      enter: function(el, done) {
        done();
      },
      leave: function(el, done) {
        var tl = new TimelineMax();
        tl.to(el, 1, {
          autoAlpha: 0,
          y: 30,
          onComplete: function() {
            done();
          }
        });
      }
    }
  },

  created: function() {
    _this = this;

    //Background vars
    this.tlBackground = new TimelineMax();
    this.timeoutBg = null;
  },

  ready: function() {
    var tl = new TimelineMax();



    tl.set(this.$el, {
        autoAlpha: 0,
        y: -30,
        xPercent: -50,
      })
      .to(this.$el, 0.7, {
        autoAlpha: 1,
        y: 0,
        delay: 1,
        onComplete: function() {
          _this.$emit('viewContentLoaded');
        }
      });
  },

  beforeDestroy: function() {},

  methods: {
    getCover: function(item) {
      return item.getAttribute('data-cover');
    },

    toggleBackground: function(item, isEnter) {

      window.clearTimeout(this.timeoutBg);

      if (isEnter) {
        var cover = this.getCover(item.$el);

        this.tlBackground.set(this.background.last_background_div, {
          autoAlpha: 0,
          backgroundImage: 'url(' + cover + ')',
          scale: 1.02
        }).to(this.background.last_background_div, 0.5, {
          autoAlpha: 1,
          scale: 1,
          ease: Cubic.easeInOut,
          onComplete: function() {

          }
        }).set(this.background.first_background_div, {
          backgroundImage: 'url(' + cover + ')'
        })


      } else {
        this.timeoutBg = setTimeout(function() {
          _this.tlBackground.set(_this.background.first_background_div, {
              backgroundImage: 'url(' + _this.background.background_url + ')',
            })
            .to(_this.background.last_background_div, 0.6, {
              autoAlpha: 0,
              scale: 1.02,
              ease: Cubic.easeInOut
            }, '+=0.2');
        }, 500);

      }
    }
  }
};
