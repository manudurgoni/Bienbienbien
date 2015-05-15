'use strict';

var Vue = require('vue');
var raf = require('component-raf');
var TweenMax = require('TweenMax');
var CUtils = require('../utils/canvas-utils.js');
var _this;


module.exports = {
  isLiteral: true,
  bind: function() {

    _this = this;
    this.size = {
      value: 7
    };

    Vue.nextTick(function() {
      _this.ready();
    });
  },

  ready: function() {
    this.ctx = this.el.getContext('2d');
    this.img = new Image();

    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.el.style.imageRendering = 'pixelated';


    this.img.src = this.vm.background.background_url;
    this.img.crossOrigin = 'Anonymous';

    this.img.onload = function() {

      _this.onResize();
      _this.pixelate();

    };

    window.addEventListener('resize', this.onResize.bind(this), false);
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

  onResize: function() {
    this.el.width = document.querySelector('.section').offsetWidth;
    this.el.height = window.innerHeight - 75;

    CUtils.drawImageProp(this.ctx, this.img);

    // this.pixelate();

  }

};
