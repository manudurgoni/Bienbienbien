'use strict';

/*
    Patchwork - a gulp, npm, vue.js, node-sass boilerplate.
    2014 - Florian Morel, Guillaume Gouessan
*/

/*
    App entry point.

    Creates the top-most viewmodel,
    registers the routes,
    registers all components,
    and start on page load.
 */

var Vue = require('vue');
var forEach = require('forEach');
var DataManager = require('../utils/data-manager');
var CubeManager = require('../utils/cubes-manager');
var conf = require('./conf.js');
var Routes = require('./routes.js');

// Datas
var get_posts_url = conf.wp_url + '/api/get_posts/';
var get_categories = conf.wp_url + '/api/get_category_index/';
var get_pages = conf.wp_url + '/api/get_page_index/';
var get_background_url = conf.wp_url + '/wp-admin/admin-ajax.php?action=get_custom_background_infos';

var get_slack_posts = conf.wp_url + '/wp-admin/admin-ajax.php?action=get_messages_from_channel&channel_id=C024YKWRU';
var get_slack_members = conf.wp_url + '/wp-admin/admin-ajax.php?action=get_all_members';
// var get_slack_posts = '/assets/data/channel.json';
// var get_slack_members = '/assets/data/members.json';
var datas = {};

// Dom
// var transitionShape = document.querySelector('.loader');
// var loadingCubes = document.querySelector('.cubes.loading');
// var cubes = loadingCubes.querySelectorAll('.cube');



/*
    Plugins, lib config...
 */
require('./imports');

function init() {
  var app = new Vue({
    el: 'body',
    data: function() {
      return {
        paginate: {
          currentPage: 1,
          nbPages: datas.nbPages
        },
        posts: datas.posts,
        msgs: datas.msgs,
        categories: datas.categories,
        pages: datas.pages,
        members: datas.members,
        background: {
          background_url: '',
          background_home: datas.background_url,
        }
      };
    },

    routes: Routes,

    components: {
      /* COMPONENTs */
      'slack-component': require('../components/slack/slack'),
      'menu-component': require('../components/menu/menu'),
      'background-component': require('../components/background/background'),

      /* SECTIONS */
      'home-section': require('../sections/home/home'),
      'about-section': require('../sections/about/about'),
      'post-section': require('../sections/post/post')
    },

    directives: {
      'scroll': require('../directives/scroll.js'),
      'stats': require('../directives/stats.js'),
      'pixelate': require('../directives/pixelate.js')
    },

    filters: {
      'formatTimestamp': require('../filters/formatTimestamp/formatTimestamp'),
      'formatDate': require('../filters/formatDate/formatDate')
    },

    created: function() {},

    ready: function() {},

    methods: {

    }
  });
}


function createBackground() {
  var globalDiv = document.querySelector('body .global');

  var bgDiv = document.createElement('div');
  bgDiv.className = 'background-home';
  globalDiv.insertBefore(bgDiv, globalDiv.firstChild);

  for (var i = 0; i < 2; i++) {
    var div = document.createElement('div');

    if (i === 0) {
      div.style.backgroundImage = 'url(' + datas.background_url + ')';
    }

    bgDiv.appendChild(div);
  };

};

function loadData() {
  DataManager.getJsons([get_posts_url, get_slack_posts, get_slack_members, get_background_url, get_categories, get_pages]).then(function(response) {
    datas.nbPages = response[0].pages;
    datas.posts = response[0].posts;
    datas.msgs = response[1].data.messages;
    datas.members = response[2].data.members;
    datas.background_url = response[3].url;
    datas.categories = response[4].categories;
    datas.pages = response[5].pages;

    // createBackground();
    init();

    var tlTransitionShape = new TimelineMax();


    /*if (conf.dev) {
      loadingCubes.classList.add('hide');
      tlTransitionShape.set(transitionShape, {
        display: 'none'
      });
    } else {

      TweenMax.delayedCall(2, function() {
        loadingCubes.classList.add('hide');
      });

      // CubeManager.rotateCubes(cubes, 1.2, 180, undefined, 1, 0.5, 0.1, 1, function(){
      //   CubeManager.hideCubes(loadingCubes, 0.4, 1);
      // });

      tlTransitionShape.to(transitionShape, 1.4, {
        xPercent: 100,
        ease: Expo.easeInOut,
        onComplete:function(){
          document.body.removeChild(transitionShape);
        }
      }, '+=1.6');
    }*/
  });
};


// window.addEventListener('load', loadData);
window.addEventListener('DOMContentLoaded', loadData);
