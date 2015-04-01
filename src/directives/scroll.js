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

    Vue.nextTick(function() {
      _this.ready();
    });

    // Vue.$on('slackImgsLoaed',function(){
    //   console.log('slackImgsLoaed')
    // })

  },

  /**
   * When all is really ready :-)
   */
  ready: function() {
    var _this = this;

    this.content = this.el.querySelector(this.target);
    console.log(this.el)
    

    this.vm.$on('viewContentLoaded',function(){
      console.log('viewContentLoaded')
      _this.contentHeight = _this.content.offsetHeight;
      _this.createVS();
    })



    // var imgs = this.el.querySelectorAll('img');
    // var imgLoaded = 0;
    // forEach(imgs, function(img, i) {
    //   // console.log(img);
    //   img.addEventListener('load', function() {
    //     imgLoaded++;

    //     if (imgLoaded === imgs.length - 1) {
    //       _this.vm.$broadcast('slackImgsLoaed');
    //       console.log('slackImgsLoaed')
    //     }
    //   });


    // });




    
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


    this.tamere();
  },

  tamere: function() {
    raf(this.tamere.bind(this));

    this.currentY += (this.targetY - this.currentY) * this.ease;

    TweenMax.set(this.content, {
      force3D: true,
      y: this.currentY
    });

  }
};
