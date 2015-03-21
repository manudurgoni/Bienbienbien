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

/*
    Plugins, lib config...
 */
require('./imports');

function init() {
    var app = new Vue({
        el: 'body',
        data: {

        },

        routes: {
          '/': {
            componentId: 'home-section',
            isDefault: true
          },
          '/about': {
            componentId: 'about-section'
          }
        },

        components: {
            /* COMPONENTs */
            'header-component': require('../components/header/header'),

            /* SECTIONS */
            'home-section': require('../sections/home/home'),
            'about-section': require('../sections/about/about')
        },

        ready: function() {

        },

        methods: {

        }
    });
}

window.onload = init;
