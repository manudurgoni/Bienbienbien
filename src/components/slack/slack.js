'use strict';

var TweenMax = require('TweenMax');


module.exports = {
  inherit: true,
  replace: true,
  template: require('./slack.html'),

  data: function() {
    return {

    };
  },

  created: function(){
  },

  ready: function() {

    var msgs = this.$el.querySelectorAll('li.msg');
    var tl = new TimelineMax();

    tl.set(msgs,{
      autoAlpha:0,
      x:-30
    })
    .staggerTo(msgs, 0.8, {
      autoAlpha:1,
      x:0,
      ease:Power3.easeInOut
    }, 0.2, '+= 2');


  },

  beforeDestroy: function() {

  },

  methods: {
    
  }
};
