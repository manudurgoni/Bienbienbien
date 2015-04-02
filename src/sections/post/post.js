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

    TweenMax.set(this.$el, {
      autoAlpha: 0,
      y: 30
    });

    this.backgroundDiv = this.$$.background.querySelector('div');
    this.backgroundDiv.style.backgroundImage = 'url(' + this.post.thumbnail_images.cover.url + ')';

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

        tl.to(_this.backgroundDiv, 0.6, {
          autoAlpha: 0,
          scale: 1.02,
          ease: Cubic.easeInOut
        }, '+=0.2').to(el, 1, {
          autoAlpha: 0,
          // y: 30,
          onComplete: function() {
            done();
          }
        });
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

      var paddingTop = height - this.$$.titleBlock.offsetHeight - 20;
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
      tl.set(this.$$.content, {
        display: 'block',
        autoAlpha: 1,
      }).to(this.$el, 1, {
        autoAlpha: 1,
        y: 0,
        delay: 1.5
      })
      .to(this.$$.content, 0.5, {
        autoAlpha: 1,
        onComplete: function() {
          _this.$emit('viewContentLoaded');
        }
      });
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
