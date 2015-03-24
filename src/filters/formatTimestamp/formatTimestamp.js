'use strict';

var moment = require('moment');

module.exports = function(timestamp) {
  var date = new Date(timestamp*1000);
  return moment(date).format("h:mm a");
};
