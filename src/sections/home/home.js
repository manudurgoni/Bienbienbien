'use strict';

var TweenMax = require('TweenMax');



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
        var tl = new TimelineMax();
        tl.set(el, {
          display: 'none',
          autoAlpha: 0,
          y: -30
        }).to(el,0.7,{
          display: 'block',
          autoAlpha:1,
          y:0,
          delay:1,
          onComplete: function() {
            done();
          }
        });

        // TweenMax.set(el.querySelectorAll('iframe'), {
        //  display:'none'
        // })
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
    // this.fetchData();
  },

  ready: function() {},

  beforeDestroy: function() {},

  methods: {

  }
};
