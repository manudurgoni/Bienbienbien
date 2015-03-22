'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
// var PreloadJS = require('preloadjs');

var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';


module.exports = {
  inherit: true,
  replace: true,
  template: require('./post.html'),

  data: function() {
    return {
      post: null
    };
  },

  created:function(){
    this.getPost();

  },

  ready: function() {

  	console.log('ready');
  	window.addEventListener('load',function(){
  		console.log('loaded');

  	},false);

  },

  beforeDestroy: function() {},

  methods: {
  	init: function(){
  		var self = this;
  		setTimeout(function(){
  			var iframes = self.$el.querySelectorAll('iframe');
  			console.log(iframes);

  			// var tl = TimelineMax();
  			
  			TweenMax.set(iframes,{
  				autoAlpha:0,
  				display:'none'
  			});

  		},100);
  	},

    getPost: function() {
    	var self = this;
    	if(this.posts){
      	this.post = this.posts.filter(this.filterBySlug)[0];
      	this.init();
    	}else{
    		DataManager.getJson(get_posts_url).then(function(response){
          self.posts = response.posts;
          self.post = self.posts.filter(self.filterBySlug)[0];
          self.init();
        });
    	}

      // console.log(this.post);

    },

    filterBySlug: function(element) {
      if (element.slug === this.$data.$routeParams.slug) {
        return true;
      }

    }
  }
};
