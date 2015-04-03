'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
var resizeMixin = require('vue-resize-mixin');
var forEach = require('forEach');
var Vue = require('vue');

var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';
var _this;


module.exports = {
  inherit: true,
  replace: true,
  template: require('./post.html'),

  mixins: [resizeMixin],

  events: {
    'resize': 'onResize'
  },

  data: function() {
    return {
      post: null,
    };
  },

  created: function() {
    _this = this;
    this.getPost();
  },

  ready: function() {
    var tl = new TimelineMax();
    tl.set(this.$$.inner, {
      autoAlpha: 0,
      scale:0.99,
      y: 50
    });

    // Background animation
    this.backgroundDiv = this.$$.background.querySelector('div');
    
    tl.set(this.backgroundDiv, {
      autoAlpha: 0,
      scale: 1.05,
      backgroundImage: 'url(' + this.post.thumbnail_images.cover.url + ')'
    }).to(this.backgroundDiv, 1,{
      autoAlpha:1,
      scale:1,
      ease: Cubic.easeInOut
    });

    setTimeout(function() {
      _this.init();
    }, 1000);

  },

  beforeDestroy: function() {},

  transitions: {
    appear: {
      enter: function(el, done) {
        done();
      },
      leave: function(el, done) {
        var tl = new TimelineMax();
        console.log(_this.backgroundDiv,el.querySelector('.inner'));

        tl.to(_this.backgroundDiv, 1, {
          autoAlpha: 0,
          ease: Cubic.easeInOut
        }).to(el.querySelector('.inner'), 1, {
          scale:0.99,
          autoAlpha: 0,
          onComplete: function() {
            done();
          }
        },'-=0.8');
      }
    }
  },

  methods: {

    init: function() {
      if (_this.$$.content.querySelectorAll('iframe').length) {
        _this.appendElement(_this.post.title, _this.post.custom_fields.surtitre, _this.post.content);
        _this.loadIframes(_this.$$.content.querySelectorAll('iframe'));
      } else {
        _this.appendElement(_this.post.title, _this.post.custom_fields.surtitre, _this.post.content);
        _this.showContent();
      }
    },

    appendElement: function(title, subtitle, content) {
      _this.$$.title.innerHTML = title;
      _this.$$.subtitle.innerHTML = subtitle;
      _this.$$.content.innerHTML = content;

    },

    onResize: function(event) {
      var width = event.width;
      var height = event.height;

      _this.$$.background.style.height = height + 'px';


      var h = (!this.addHeight)?300:0;

      var paddingTop = height - this.$$.titleBlock.offsetHeight - 80 + h;
      if (paddingTop > 0) {
        this.$el.querySelector('div.inner').style.paddingTop = paddingTop + 'px';
        this.$emit('contentResized');
      }
    },

    loadIframes: function(iframes) {
      var self = this;
      var i = 0;
      forEach(iframes, function(iframe, index) {
        iframe.addEventListener('load', function() {
          i++;

          if (i === iframes.length) {
            self.showContent();
          }

        }, false);
      });
    },

    showContent: function() {
      window.dispatchEvent(new Event('resize'));
      var tl = new TimelineMax();
      tl.set(this.$$.titleBlock,{
        height:'+=300',
        y:300
      }).to(this.$$.inner, 1, {
        autoAlpha: 1,
        scale:1,
        y: 0,
        delay: 1.5,
        
        // ease: Cubic.easeOut
      })
      .to(this.$$.titleBlock, 0.7,{
        height:'-=300',
        y:0,
        onComplete: function(){
          _this.addHeight = true;
          _this.$emit('viewContentLoaded');
        }
      }, '-=1');
    },



    /**
     * Get a post from slug
     * @return {[type]} [description]
     */
    getPost: function() {

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
