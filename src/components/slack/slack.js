'use strict';

var api = require('./tk');

var apiURL = 'https://slack.com/api/channels.history?token='+api.tk+'&channel=C024YKWRU';

module.exports = {
  inherit: true,
  replace: true,
  template: require('./slack.html'),

  data: function() {
    return {
      msgs: null
    };
  },

  created: function(){
    this.fetchData();
    console.log('created');

  },

  ready: function() {

  },

  beforeDestroy: function() {

  },

  methods: {
    fetchData: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', apiURL)
      xhr.onload = function() {
        console.log(self);
        var json = JSON.parse(xhr.responseText);
        self.msgs = json.messages;
        console.log(self.msgs)
      }
      xhr.send()
    }
  }
};
