'use strict';

var Vue = require('vue');
var raf = require('component-raf');
var TweenMax = require('TweenMax');
var CUtils = require('../utils/canvas-utils.js');


module.exports = {
  bind: function() {
    var _this = this;


    this.ctx = this.el.getContext('2d');
    this.img = new Image();
    this.el.style.imageRendering = 'pixelated';

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.img.crossOrigin = 'Anonymous';

    this.img.onload = function() {
      _this.resizeCanvas();
    };

    this.handlerResize = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.handlerResize, true);

  },

  update: function(data) {
    this.img.src = data.url;

    this.size = {
      value: data.size || 10
    };

  },

  unbind: function() {
    window.removeEventListener('resize', this.handlerResize, true);
    this.el.remove();
  },

  pixelate: function() {

    var w = this.el.width;
    var h = this.el.height;

    var imageData = this.ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    for (var x = 0; x < w; x += this.size.value) {
      for (var y = 0; y < h; y += this.size.value) {

        var index = (x + y * imageData.width) * 4;

        var r = data[index + 0];
        var g = data[index + 1];
        var b = data[index + 2];


        // draw pixel block
        for (var n = 0; n < this.size.value; n++) {
          for (var m = 0; m < this.size.value; m++) {
            if (x + m < w) {
              var blockIndex = ((w * (y + n)) + (x + m)) * 4;

              data[blockIndex + 0] = r;
              data[blockIndex + 1] = g;
              data[blockIndex + 2] = b;
            }
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

  },

  resizeCanvas: function() {
    var size = {};
    if (this.el.parentNode.offsetWidth === 0 || this.el.parentNode.offsetHeight === 0) {
      size.w = this.el.parentNode.parentNode.offsetWidth;
      size.h = this.el.parentNode.parentNode.offsetHeight;
    } else {
      size.w = this.el.parentNode.offsetWidth;
      size.h = this.el.parentNode.offsetHeight;
    }

    this.el.width = size.w;
    this.el.height = size.h;

    CUtils.drawImageProp(this.ctx, this.img);

    this.pixelate();


  }

};
