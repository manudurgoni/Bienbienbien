'use strict';

var TweenMax = require('TweenMax');

module.exports = {
    inherit: true,
    replace: true,
    template: require('./home.html'),

    data: function() {
      return {
        posts:[{
            "title":"hello"
        },{
            "title":"Hey dude!"
        }]
      };
    },

    ready: function() {
        // console.log('home is ready');
        console.log(this);

        

    },

    beforeDestroy: function() {
        console.log('kill home');

        // tlHome.reverse();
    },

    methods: {

    }
};
