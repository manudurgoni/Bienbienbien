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

//Wordpress
var get_posts_url = 'http://wp.bienbienbien.dev/api/get_posts/';

//Slack
var get_slack_posts = 'http://wp.bienbienbien.dev/wp-admin/admin-ajax.php?action=get_messages_from_channel&channel_id=C024YKWRU';
var get_slack_members = 'http://wp.bienbienbien.dev/wp-admin/admin-ajax.php?action=get_all_members';
var datas = {};


/*
    Plugins, lib config...
 */
require('./imports');

function init() {
  var app = new Vue({
    el: 'body',
    data: function() {
      return {
        posts: datas.posts,
        msgs: datas.msgs
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

    filters:{
      'formatTimestamp': require('../filters/formatTimestamp/formatTimestamp')
    },

    created: function() {},

    ready: function() {},

    methods: {}
  });
}

function loadData() {
  DataManager.getJsons([get_posts_url, get_slack_posts, get_slack_members]).then(function(response) {
    datas.posts = response[0].posts;
    datas.msgs = response[1].data.messages;
    datas.members = response[2].data.members;
    init();
  });
};

window.onload = function() {

  loadData();

};
