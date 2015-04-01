'use strict';

var Vue = require('vue');
var raf = require('component-raf');
var VirtualScroll = require('../utils/virtual-scroll.js');
var TweenMax = require('TweenMax');
var forEach = require('forEach');



module.exports = {
  bind: function(value) {
    var _this = this;

    this.ease = 0.1;
    this.currentY = 0;
    this.targetY = 0;
    this.target = this.expression;
    if (this.el.classList.contains('single-post')) {
      this.cover = document.querySelector('.background-home');
    }




    Vue.nextTick(function() {
      _this.ready();
    });
  },

  /**
   * When all is really ready :-)
   */
  ready: function() {
    var _this = this;

    this.content = this.el.querySelector(this.target);
    

    this.vm.$on('viewContentLoaded', function() {
      _this.contentHeight = _this.content.offsetHeight;
      _this.createVS();
    })
  },

  /**
   * Create our Virtual Scroll
   */
  createVS: function() {
    var _this = this;

    var vs = new VirtualScroll();
    var vsOptions = {
      keyStep: 100,
      target: this.el
    };

    vs.options(vsOptions);

    vs.on(function(e) {
      _this.targetY += e.deltaY;
      _this.targetY = Math.max((_this.contentHeight - window.innerHeight) * -1, _this.targetY);
      _this.targetY = Math.min(0, _this.targetY);
    });

    this.move();
  },

  move: function() {
    raf(this.move.bind(this));

    this.currentY += (this.targetY - this.currentY) * this.ease;

    TweenMax.set(this.content, {
      force3D: true,
      y: this.currentY
    });

    if (this.cover!==undefined) {
      TweenMax.set(this.cover, {
        force3D: true,
        y: this.currentY / 5
      });
    }

  }
};
