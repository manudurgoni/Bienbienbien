'use strict';


var Stats = require('stats-js');
var raf = require('component-raf');

module.exports = {
  bind: function(value) {
    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 1000;

    document.body.appendChild(this.stats.domElement);
    raf(this.update.bind(this));
  },

  update: function() {
    this.stats.begin();

    // monitored code goes here

    this.stats.end();

    raf(this.update.bind(this));
  }
};
