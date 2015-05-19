'use strict';

var moment = require('moment');


module.exports = function(date) {
  var date = new Date(date);

  moment.locale('fr');
  console.log(moment(date).format("h:mm a"));
  return moment().format('LL');
};
