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
var DataManager = require('../utils/data-manager');

var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';
var api = require('../components/slack/tk');
var get_slack_posts = 'https://slack.com/api/channels.history?token='+api.tk+'&channel=C024YKWRU';

/*
    Plugins, lib config...
 */
require('./imports');

function init() {
  var app = new Vue({
    el: 'body',
    data: function() {
      return {
        posts: null,
        msgs:null
      };
    },

    routes: {
      '/': {
        componentId: 'home-section',
        isDefault: true
      },
      '/article/:slug': {
        componentId: 'post-section'
      },
      '/about': {
        componentId: 'about-section'
      }
    },

    components: {
      /* COMPONENTs */
      'slack-component': require('../components/slack/slack'),

      /* SECTIONS */
      'home-section': require('../sections/home/home'),
      'about-section': require('../sections/about/about'),
      'post-section': require('../sections/post/post')
    },

    created: function() {
      this.fetchData();
    },

    ready: function() {

    },

    methods: {
      fetchData: function() {
        var self = this;


        DataManager.getJsons([get_posts_url, get_slack_posts]).then(function(response){
          console.log("loading done");
          self.posts = response[0].posts;
          self.msgs = response[1].messages;
        });
        
      }
    }
  });
}

window.onload = init;
