'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
var CubeManager = require('../../utils/cubes-manager');
var resizeMixin = require('vue-resize-mixin');
var conf = require('../../boot/conf.js');

var get_posts_url = conf.wp_url + '/api/get_posts/';

var _this;

module.exports = {
  inherit: true,
  replace: true,
  template: require('./home.html'),

  mixins: [resizeMixin],

  events: {
    'resize': 'onResize'
  },

  data: function() {
    return {};
  },

  transitions: {
    appear: {
      enter: function(el, done) {
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
        this.$dispatch('menuOut');

        CubeManager.showCubes(this.loading.loadingCubes, 0.4, 1, 0, 0, function() {
          CubeManager.rotateCubes(_this.loading.cubes, 0.7, 180, undefined, 1, 0.5, 0.1, 1);
        });


        // tlTransitionShape.to(this.loading.transitionShape, 1.4, {
        //   xPercent: 100,
        //   ease: Expo.easeInOut,
        // }, '+=4');
      }
    }
  },

  created: function() {
    _this = this;

    //Background vars
    this.tlBackground = new TimelineMax();
    this.timeoutBg = null;
  },

  ready: function() {
    var tl = new TimelineMax();
    this.menuBtn = document.querySelector('.menu-button');
    this.menuBtnBlackLayer = this.menuBtn.querySelector('.black');
    this.articles = this.$el.querySelectorAll('.post');

    tl.set(this.$el, {
        autoAlpha: 1,
        xPercent: -50,
      }).set(this.articles, {
        autoAlpha: 0,
        y: -30,
      })
      .to(this.menuBtnBlackLayer, 0.5, {
        height: 0,
      }, '+=1')
      .to(this.articles, 1, {
        autoAlpha: 1,
        y: 0,
        onComplete: function() {
          _this.$emit('viewContentLoaded');
          _this.$dispatch('menuIn');

        }
      }, '+=0.5');

  },

  beforeDestroy: function() {},

  methods: {
    onResize: function(event) {
      this.$emit('contentResized');
    },

    /**
     * More button
     */
    moreBtnOnMouseEnter: function(e) {

      this.moreBtnHoverTl = new TimelineMax();

      this.moreBtnHoverTl.to(this.$$.moreBtn.querySelector('.circle-1'), 0.6, {
          scale: 0.8,
          ease: Expo.easeInOut
        })
        .to(this.$$.moreBtn.querySelector('.circle-2'), 0.7, {
          scale: 1.5,
          ease: Expo.easeInOut
        }, '-=0.5')
        .to(this.$$.moreBtn.querySelector('.bar-1'), 0.8, {
          rotation: 90,
          ease: Cubic.easeInOut
        }, '-=1')
        .to(this.$$.moreBtn.querySelector('.bar-2'), 0.8, {
          rotation: 180,
          ease: Cubic.easeInOut
        }, '-=0.9');
    },

    moreBtnOnMouseLeave: function() {

      if (!this.moreBtnClicked) {
        this.moreBtnHoverTl.reverse();
      }
    },

    moreBtnOnClick: function(e) {
      this.moreBtnClicked = true;

      this.moreBtnClickTl = new TimelineMax();
      this.moreBtnClickTl
        .set(this.$$.moreBtn.querySelector('.dot'), {
          scale: 0,
          display: 'block',
          yPercent: -50,
          xPercent: 0,
        })
        .to(this.$$.moreBtn.querySelectorAll('.bar'), 0.5, {
          scale: 0.3,
          autoAlpha: 0
        })
        .to(this.$$.moreBtn.querySelector('.dot'), 0.5, {
          scale: 1,
        }, '-=0.4')
        .to(this.$$.moreBtn.querySelector('.dot'), 2, {
          rotation: 360,
          repeat: -1,
          ease: Linear.easeNone
        }, '-=0.4');

      console.log(get_posts_url);

      if (this.paginate.currentPage < this.paginate.nbPages) {
        this.paginate.currentPage++;

        console.log(get_posts_url+'?page='+this.paginate.currentPage);
        DataManager.getJsons([get_posts_url+'?page='+this.paginate.currentPage]).then(function(response) {
          _this.posts = response[0].posts;
          _this.moreBtnClickTl.pause();
          console.log(_this.posts);
        });
      }


    }
  }
};
