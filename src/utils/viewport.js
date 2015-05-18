'use strict';

module.exports = function(axis) {
  var client, inner;
  var docElem = window.document.documentElement;
  if (axis === 'x') {
    client = docElem['clientWidth'];
    inner = window['innerWidth'];
  } else if (axis === 'y') {
    client = docElem['clientHeight'];
    inner = window['innerHeight'];
  }

  return client < inner ? inner : client;
};
