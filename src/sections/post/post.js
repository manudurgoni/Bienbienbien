'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
var loaderMixin = require('vue-loader-mixin');
var forEach = require('forEach');

var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';


module.exports = {
  inherit: true,
  replace: true,
  template: require('./post.html'),

  mixins: [loaderMixin],

  events: {
    'load:progress': 'onLoadProgress',
    'load:complete': 'onLoadComplete'
  },

  // Static manifest
  manifest: [

  ],

  data: function() {
    return {
      post: null,
      tests: {
        iframeLoaded: false,
        imgLoaded: false
      }
    };
  },

  created: function() {
    this.getPost();

    // this.$options.manifest = [
    //   // 'https://www.youtube.com/embed/qPeb0X4IRWI?feature=oembed',
    //   'http://wp.bienbienbien.dev/wp-content/uploads/2015/03/1661407765931.jpg',
    //   'http://wp.bienbienbien.dev/wp-content/uploads/2015/03/complot.jpg'
    // ];
  },

  ready: function() {
    // this.load();
    // 
    var self = this;
    var content = document.createElement('div');
    content.innerHTML = this.post.content;


    setTimeout(function() {
      if (content.querySelectorAll('iframe').length) {
        self.loadIframes(content.querySelectorAll('iframe'));
      } else {
        self.showContent();
      }
      self.$el.appendChild(content);

    }, 1000);






    // content.onload = function(){
    // 	console.log('yao');
    // }

    // this.post.content = content;

    // content.$appendTo('content');

  },

  beforeDestroy: function() {},

  transitions: {
    appear: {
      enter: function(el, done) {
        TweenMax.set(el, {
          display: 'none',
          autoAlpha: 0,
          y: -30
        });

        // TweenMax.set(el.querySelectorAll('iframe'), {
        // 	display:'none'
        // })
        done();
      },
      leave: function(el, done) {
        var tl = new TimelineMax();
        tl.to(el, 1, {
          autoAlpha: 0,
          y: 30,
          onComplete: function() {
            done();
          }
        });
      }
    }
  },

  methods: {

    onLoadProgress: function(event) {
      this.progress = event.progress;

      console.log(this.progress);
    },

    onLoadComplete: function(event) {
      this.progress = 1;
      // You can use the load:complete event with the `wait-for` directive
    },

    loadIframes: function(iframes) {
      var self = this;
      var i = 0;
      forEach(iframes, function(iframe, index) {
        // iframe.style.display = 'none';
        iframe.addEventListener('load', function() {
          console.log(i);
          i++;

          if (i === iframes.length) {
            console.log('done');
            self.showContent();
          }

        }, false);
      });
    },

    showContent: function() {
      console.log(this.$el);
      TweenMax.to(this.$el, 1, {
        display: 'block',
        autoAlpha: 1,
        y: 0,
        delay: 1
      });
    },

    /**
     * Get a post from slug
     * @return {[type]} [description]
     */
    getPost: function() {
      var self = this;

      if (this.posts) {
        this.post = this.posts.filter(this.filterBySlug)[0];
      }
    },

    filterBySlug: function(element) {
      if (element.slug === this.$data.$routeParams.slug) {
        return true;
      }

    }
  }
};
