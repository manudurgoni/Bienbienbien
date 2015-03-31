'use strict';

var TweenMax = require('TweenMax');
var forEach = require('forEach');

var self;
var regex_url_slack = /<(https?:\/\/[^\s]+)>/g;


module.exports = {
  inherit: true,
  replace: true,
  template: require('./slack.html'),

  data: function() {
    return {
      msgs:this.msgs
    };
  },

  created: function(){
    self = this;
    
    forEach(this.$data.msgs, function(msg,i){
      var userObj = self.findUserByID(msg.user);
      msg.user = {
        id:msg.user,
        real_name:userObj.real_name,
        avatar_url:userObj.profile.image_32
      }

      msg.text = msg.text.replace(regex_url_slack, '');
    });
  },

  ready: function() {

    var msgs = this.$el.querySelectorAll('li.msg');
    var tl = new TimelineMax();

    // tl.set(msgs,{
    //   autoAlpha:0,
    //   x:-30
    // })
    // .staggerTo(msgs, 0.6, {
    //   autoAlpha:1,
    //   x:0,
    //   ease:Power3.easeInOut
    // }, 0.13, '+= 1');


  },

  beforeDestroy: function() {

  },

  methods: {
    findUserByID:function($userID){

      var user = this.members.filter(function ( obj ) {
          return obj.id === $userID;
      })[0];
      return user;
    }

 
  }
};
