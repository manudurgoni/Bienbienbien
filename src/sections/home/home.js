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
    this.menuBtn = document.querySelector('.menu-button');
    this.menuBtnBlackLayer = this.menuBtn.querySelector('.black');
    this.articles = this.$el.querySelectorAll('.post');

    tl.set(this.$el, {
        autoAlpha: 1,
        xPercent: -50,
      }).set(this.articles, {
        autoAlpha: 0,
        y: -30,
      })
      .to(this.menuBtnBlackLayer, 0.5, {
        height: 0,
      }, '+=1')
      .to(this.articles, 1, {
        autoAlpha: 1,
        y: 0,
        onComplete:function(){
          _this.$emit('viewContentLoaded');
        }
      }, '+=0.5');


  },

  beforeDestroy: function() {},

  methods: {

  }
};
