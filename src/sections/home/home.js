'use strict';

var TweenMax = require('TweenMax');
var DataManager = require('../../utils/data-manager');
var CubeManager = require('../../utils/cubes-manager');
var resizeMixin = require('vue-resize-mixin');
var conf = require('../../boot/conf.js');
var forEach = require('forEach');

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
    return {
      allIsLoaded: false
    };
  },

  transitions: {
    appear: {
      enter: function(el, done) {
        var tl = new TimelineMax();

        /*tl.to(this.background.first_background_div, 0.2,{
            scale: 1.05,
            ease: Cubic.easeInOut,
          })
          .to(this.background.first_background_div, 1, {
            scale: 1,
            ease: Cubic.easeInOut,
            onComplete: function() {
              done();
            }
          });*/

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

        // CubeManager.showCubes(this.loading.loadingCubes, 0.4, 1, 0, 0, function() {
        //   CubeManager.rotateCubes(_this.loading.cubes, 0.7, 180, undefined, 1, 0.5, 0.1, 1);
        // });


      }
    }
  },

  created: function() {
    _this = this;

    //Background vars
    this.tlBackground = new TimelineMax();
    this.timeoutBg = null;

    if (this.paginate.currentPage === this.paginate.nbPages) {
      this.allIsLoaded = true;
    }
  },

  ready: function() {
    var tl = new TimelineMax();
    this.menuBtn = document.querySelector('.menu-component__bar__button');
    this.menuBtnBlackLayer = this.menuBtn.querySelector('.black');
    this.articles = this.$el.querySelectorAll('.post');

    if (!this.allIsLoaded) {
      this.initTimelineMoreBtn();
    }

    tl.set(this.$el, {
        autoAlpha: 1,
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
      });

  },

  beforeDestroy: function() {},

  methods: {
    onResize: function(event) {
      this.$emit('contentResized');
    },

    /**
     * More button
     */
    initTimelineMoreBtn: function() {
      this.moreBtnHoverTl = new TimelineMax({
        'paused': true
      });

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


      this.moreBtnClickTl = new TimelineMax({
        'paused': true
      });
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
        .to(this.$$.moreBtn.querySelector('.dot'), 1.5, {
          rotation: 360,
          repeat: -1,
          ease: Linear.easeNone
        }, '-=0.4');
    },

    moreBtnOnMouseEnter: function(e) {

      this.moreBtnHoverTl.play();
    },

    moreBtnOnMouseLeave: function() {

      if (!this.moreBtnClicked) {
        this.moreBtnHoverTl.reverse();
      }
    },

    moreBtnOnClick: function(e) {

      if (this.paginate.currentPage < this.paginate.nbPages) {
        this.moreBtnClicked = true;
        this.moreBtnHoverTl.play();
        this.moreBtnClickTl.play();

        this.paginate.currentPage++;

        DataManager.getJsons([get_posts_url + '?page=' + this.paginate.currentPage]).then(function(response) {

          TweenMax.delayedCall(2, function() {
            // _this.moreBtnClickTl.reverse();
            // _this.moreBtnHoverTl.reverse();

            _this.moreBtnClickTl.pause();

            var tl = new TimelineMax();
            tl.to(_this.$$.moreBtn.querySelector('.dot'), 0.8, {
                scale: 0,
                rotation: 0,
                onComplete: function() {
                  _this.moreBtnHoverTl.reverse();
                  _this.moreBtnClicked = false;
                  _this.moreBtnClickTl.seek(0);
                }
              })
              .to(_this.$$.moreBtn.querySelectorAll('.bar'), 0.8, {
                scale: 1,
                autoAlpha: 1,
                onComplete: function() {
                  forEach(response[0].posts, function(newPost, index) {
                    _this.addPost(newPost);
                  });
                }
              }, '-=0.5')

            // .to(this.$$.moreBtn.querySelectorAll('.bar'), 0.5, {
            //   scale: 0.3,
            //   autoAlpha: 0
            // })

            // .to(this.$$.moreBtn.querySelector('.dot'), 2, {
            //   rotation: 360,
            //   repeat: -1,
            //   ease: Linear.easeNone
            // }, '-=0.4');
          });
        });
      } else {
        TweenMax.to(this.$$.moreBtn, 0.8, {
          y: 50,
          autoAlpha: 0,
          onComplete: function() {
            _this.allIsLoaded = true;
          }
        });
      }
    },

    addPost: function(newPost) {
      this.posts.push(newPost);
      this.$emit('contentResized');
    }
  }
};
