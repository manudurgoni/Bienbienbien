'use strict';

var TweenMax = require('TweenMax');
var forEach = require('forEach');
var resizeMixin = require('vue-resize-mixin');
var breakpoints = require('../../utils/breakpoints');

var _this;


module.exports = {
  inherit: true,
  template: require('./menu.html'),

  mixins: [resizeMixin],

  events: {
    'resize': 'onResize'
  },

  data: function() {
    return {
      categories:this.categories,
      pages:this.pages
    };
  },

  created: function() {
    _this = this;
    this.menuOpen = false;

  },

  ready: function() {
    //dom element
    var slackComponent = document.querySelector('.slack-component');
    var globalContent = document.querySelector('.global');

    // Slide timeline
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
      .to(this.$$.navbar, 0.6, {
        x: -290,
        ease: Cubic.easeInOut
      }, '-=0.6');

    // In out animation
    this.$root.$on('menuOut', function() {
      _this.out();
      if (_this.menuOpen) {
        _this.toggleMenu();
      }
    });

    this.$root.$on('menuIn', function() {
      _this.in();
    });
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
    },

    onResize: function(event) {
      var width = event.width;
      var height = event.height;
    },

    in : function() {
      this.tl = new TimelineMax({
        force3D: true
      });

      this.tl.staggerTo(this.$$.button.querySelectorAll('span'), 1.2, {
          y: 0,
          ease: Power4.easeInOut,
        }, -0.05, 0);
    },

    out: function() {
      this.tl = new TimelineMax({
        force3D: true
      });

      this.tl.staggerTo(this.$$.button.querySelectorAll('span'), 1, {
          y: -75,
          ease: Expo.easeInOut,
        }, 0.05)

    },

  }
};
