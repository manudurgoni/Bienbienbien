'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
var resizeMixin = require('vue-resize-mixin');
var forEach = require('forEach');
var Vue = require('vue');
var CubeManager = require('../../utils/cubes-manager');

var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';
var _this;


module.exports = {
  heightTitle: 500,
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
      scale: 0.99,
      y: 50
    });

    // Background animation
    this.backgroundDiv = this.$$.background.querySelector('div');

    tl.set(this.backgroundDiv, {
      autoAlpha: 0,
      scale: 1.05,
      backgroundImage: 'url(' + this.post.thumbnail_images.cover.url + ')'
    }).to(this.backgroundDiv, 1, {
      autoAlpha: 1,
      scale: 1,
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
        _this.$dispatch('menuOut');

        console.log(el);

        tl.to(el.querySelector('.background-post div'), 1, {
            autoAlpha: 0,
            scale: 0.95,
            ease: Cubic.easeInOut
          })
          .to(el.querySelector('.inner'), 0.5, {
            y: 200,
            ease: Cubic.easeInOut,
            
          }, '-=0.7')
          .to(el.querySelector('.title-block'), 0.6, {
            y: el.querySelector('.title-block').offsetHeight,
            autoAlpha: 0,
            ease: Cubic.easeInOut,
            onComplete: function() {
              done();
            }
          }, '-=0.7');


      }
    }
  },

  methods: {

    init: function() {
      // console.log(_this.post.content);
      var div = document.createElement('div');
      div.innerHTML = _this.post.content;

      if (div.querySelectorAll('iframe').length) {
        _this.replaceIframeSrc(div.querySelectorAll('iframe'));
        _this.appendElement(_this.post.title, _this.post.custom_fields.surtitre, div.innerHTML);
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


      var h = (!this.addHeight) ? this.$options.heightTitle : 0;
      var paddingTop = height - this.$$.titleBlock.offsetHeight - 80 + h;

      if (paddingTop > 0) {
        this.$el.querySelector('div.inner').style.paddingTop = paddingTop + 'px';
        this.$emit('contentResized');
      }
    },

    replaceIframeSrc: function(iframes) {
      var self = this;
      var i = 0;


      var tempDiv = document.createElement('div');
      tempDiv.id = 'iframes-loader';
      document.body.appendChild(tempDiv);

      forEach(iframes, function(iframe, index) {

        iframe.setAttribute('data-force-loading', iframe.src);
        var parent = iframe.parentNode;
        parent.classList.add('video-wrapping');

        var tempIframe = document.createElement('iframe');
        tempIframe.setAttribute('src', iframe.getAttribute('data-force-loading'));
        tempIframe.addEventListener('load', function() {
          i++;

          if (i === iframes.length) {

            setTimeout(function() {
              self.showContent();

            }, 500);
          }
        }, true);

        tempDiv.appendChild(tempIframe);
      });
    },

    showContent: function() {
      window.dispatchEvent(new Event('resize'));

      //el, duration, scale, y, delay, cb
      // this.loading.loadingCubes.classList.remove('show');
      // this.loading.loadingCubes.classList.add('hide');

      var tl = new TimelineMax();
      tl.set(this.$$.titleBlock, {
          height: '+=' + _this.$options.heightTitle,
          y: _this.$options.heightTitle
        })
        .to(this.$$.inner, 1, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          delay: 1.5,

          // ease: Cubic.easeOut
        })
        .to(this.$$.titleBlock, 1.2, {
          height: '-=' + _this.$options.heightTitle,
          y: 0,
          clearProps: 'height',
          onComplete: function() {
            _this.addHeight = true;
            _this.$dispatch('menuIn');
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
