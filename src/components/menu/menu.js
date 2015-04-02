'use strict';

var TweenMax = require('TweenMax');
var forEach = require('forEach');


var _this;


module.exports = {
  inherit: true,
  replace: true,
  template: require('./menu.html'),

  data: function() {
    return {};
  },

  created: function() {
    _this = this;
    this.menuOpen = false;

  },

  ready: function() {
    //dom element
    var slackComponent = document.querySelector('.slack-component');
    var globalContent = document.querySelector('.global');

    console.log()

    this.timelineMenu = new TimelineMax({
      'paused': true,
      force3D: true
    });

    this.timelineMenu.to(this.$$.panel, 0.6, {
        x: 0,
        ease: Cubic.easeInOut
      })
      .to([slackComponent, globalContent], 0.6, {
        x: -290,
        ease: Cubic.easeInOut
      }, '-=0.6')
      .to(this.$$.button, 0.6, {
        x: -290,
        ease: Cubic.easeInOut
      }, '-=0.6')


  },

  beforeDestroy: function() {

  },

  methods: {
    toggleMenu: function() {
      if (!this.menuOpen) {
        this.menuOpen = true;
        this.timelineMenu.play();
      } else {
        this.menuOpen = false;
        this.timelineMenu.reverse();
      }
    }
  }
};
