'use strict';

var TweenMax = require('TweenMax');
var forEach = require('forEach');
var resizeMixin = require('vue-resize-mixin');
var breakpoints = require('../../utils/breakpoints');

var _this;


module.exports = {
  inherit: true,
  replace: true,
  template: require('./background.html'),

  mixins: [resizeMixin],

  events: {
    'resize': 'onResize'
  },

  data: function() {
    return {};
  },

  created: function() {
    _this = this;

  },

  ready: function() {
    //dom element
    
  },

  beforeDestroy: function() {

  },

  methods: {

    onResize: function(event) {
      var width = event.width;
      var height = event.height;
    },


  }
};
