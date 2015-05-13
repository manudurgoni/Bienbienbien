'use strict';

var Vue = require('vue');
var raf = require('component-raf');
var VirtualScroll = require('../utils/virtual-scroll.js');
var LazyLoad = require('../utils/lazy-load.js');
var Breakpoints = require('../utils/breakpoints.js');
var TweenMax = require('TweenMax');
var forEach = require('forEach');
var _ = require('../utils/_.js');


module.exports = {
  bind: function(value) {
    var _this = this;

    this.ease = 0.3;
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


    this.menuBtn = document.querySelector('.menu-component__bar__button');
    this.menuBtnHeight = this.menuBtn.offsetHeight;
    this.menuBtnBlackLayer = this.menuBtn.querySelector('.black');

    if (this.el.classList.contains('single-post')) {
      this.cover = document.querySelector('.background-post');
      this.contentPost = this.el.querySelector('.inner div.content');

      //Listen beforeonchange
      this.vm.$on('post:exit', function(next) {

        if (_this.targetY === 0) {
          next();
        } else {
          _this.targetY = 0;
          setTimeout(function() {
            next();
          }, 1000);
        }

      });
    }



    this.vm.$on('viewContentLoaded', function() {
      _this.contentHeight = _this.content.offsetHeight;
      _this.createLZ();
      _this.createVS();

    });

    this.vm.$on('contentResized', function() {
      _this.contentHeight = _this.content.offsetHeight;
      _this.isPhablet = (window.innerWidth < Breakpoints.phablet) ? true : false;
    });



  },

  createLZ: function() {
    var _this = this;
    this.lz = new LazyLoad(_this.content);
  },

  /**
   * Create our Virtual Scroll
   */
  createVS: function() {
    var _this = this;
    this.vs = new VirtualScroll();
    var vsOptions = {
      keyStep: 200,
      target: this.el
    };

    // if (_this.cover !== undefined) {
    //   _this.el.focus();
    //   console.log('focus');
    // }

    this.vs.options(vsOptions);

    this.vs.on(function(e) {
      _this.targetY += e.deltaY;
      _this.targetY = Math.max((_this.contentHeight - window.innerHeight) * -1, _this.targetY);
      _this.targetY = Math.min(0, _this.targetY);


      if (_this.lz.valid) {
        _this.lz.check();
      }

    });



    this.move();
  },




  move: function() {
    this.moveRaf = raf(this.move.bind(this));

    this.currentY += _.roundThreeDigits(((this.targetY - this.currentY)) * this.ease);

    TweenMax.set(this.content, {
      force3D: true,
      y: this.currentY,
    });

    if (this.cover !== undefined) {



      if (this.currentY < -(this.contentPost.offsetTop - this.menuBtnHeight - this.menuBtn.offsetTop) && !this.isPhablet) {
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
