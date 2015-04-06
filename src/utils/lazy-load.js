/**
 * Lazy load
 */
var TweenMax = require('TweenMax');
var forEach = require('forEach');
var _this;

var LazyLoad = function(container) {
  _this = this;

  this.init(container);
};
LazyLoad.prototype = {
  init: function(container) {
    this.targets = container.querySelectorAll('[data-src]');

    if (this.targets.length > 0) {
      this.valid = true;
    }
  },

  check: function(){


  	forEach(this.targets, function(el,index){

  		if(el.getBoundingClientRect().top - window.innerHeight <= 0 && !el.getAttribute('data-loaded')){
  			console.log('change src');
  			el.setAttribute('data-loaded', true);
  			el.src = el.getAttribute('data-src');

  			el.addEventListener('load', function(){
  				console.log('loaded');
  			})
  		}

  	});

  }
}

module.exports = LazyLoad;
