'use strict';

var Q = require('q');

module.exports = {
  /**
   * Get a json file from url
   * @param  String url
   * @return a promise with the response
   */
  getJson: function(url) {
    var deferred = Q.defer();

    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {

      if (req.status == 200) {

        deferred.resolve(JSON.parse(req.response));

      } else {

        deferred.reject(Error(req.statusText));

      }

    };

    req.onerror = function() {
      deferred.reject(Error("Erreur réseau"));
    };

    req.send();
    return deferred.promise;
  },

  /**
   * Load an array of json file
   * @param  {Array} urls 
   * @return a promise with the response
   */
  getJsons: function(urls, prout, clavie) {
    var self = this;
    var arr = [];
    for (var i = 0; i < urls.length; i++) {
      arr.push(this.getJson(urls[i]));
    };

    return Q.all(arr);
  }

};
