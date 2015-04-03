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
    this.heightLayerMenu = 0;

    Vue.nextTick(function() {
      _this.ready();
    });
  },

  unbind: function() {
    // do clean up work
    this.vs = null;
    raf.cancel(this.moveRaf);
    this.moveRaf = null;

    if (this.cover !== undefined) {
      // TweenMax.to(this.cover, 1, {
      //   force3D: true,
      //   // y: 0,
      //   ease: Cubic.easeInOut
      // });
    }
  },


  onResize: function(event) {
    this.contentHeight = this.content.offsetHeight;
  },

  /**
   * When all is really ready :-)
   */
  ready: function() {
    var _this = this;

    this.content = this.el.querySelector(this.target);

    this.menuBtn = document.querySelector('.menu-button');
    this.menuBtnHeight = this.menuBtn.offsetHeight;
    this.menuBtnBlackLayer = this.menuBtn.querySelector('.black');

    if (this.el.classList.contains('single-post')) {
      this.cover = document.querySelector('.background-post');
      this.contentPost = this.el.querySelector('.inner div.content');

    }



    this.vm.$on('viewContentLoaded', function() {
      _this.contentHeight = _this.content.offsetHeight;
      _this.createVS();
    })

    this.vm.$on('contentResized', function() {
      _this.contentHeight = _this.content.offsetHeight;
    })
  },

  /**
   * Create our Virtual Scroll
   */
  createVS: function() {
    var _this = this;

    this.vs = new VirtualScroll();
    var vsOptions = {
      keyStep: 100,
      target: this.el
    };

    this.vs.options(vsOptions);

    this.vs.on(function(e) {
      _this.targetY += e.deltaY;
      _this.targetY = Math.max((_this.contentHeight - window.innerHeight) * -1, _this.targetY);
      _this.targetY = Math.min(0, _this.targetY);
    });

    this.move();
  },

  move: function() {
    this.moveRaf = raf(this.move.bind(this));

    this.currentY += ((this.targetY - this.currentY)) * this.ease;

    TweenMax.set(this.content, {
      force3D: true,
      y: this.currentY
    });

    if (this.cover !== undefined) {
      if (this.currentY < -(this.contentPost.offsetTop - this.menuBtnHeight - this.menuBtn.offsetTop)) {
        this.heightLayerMenu += ((this.targetY - this.currentY)) * this.ease;

        TweenMax.set(this.menuBtnBlackLayer, {
          height: Math.min(Math.max(-this.heightLayerMenu, 0), this.menuBtnHeight)
        });
      } else {
        this.heightLayerMenu = 0;
        TweenMax.set(this.menuBtnBlackLayer, {
          height: 0
        });
      }

      TweenMax.set(this.cover, {
        force3D: true,
        y: this.currentY / 5
      });
    }

  }
};
