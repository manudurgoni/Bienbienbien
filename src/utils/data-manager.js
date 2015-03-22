'use strict';

var Q = require('q');



module.exports = {
  getJson: function(url) {
    // Renvoie une nouvelle promesse.
    var deferred = Q.defer();

    // Fais le boulot XHR habituel
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // Ceci est appelé même pour une 404 etc.
      // aussi vérifie le statut
      if (req.status == 200) {
        // Accomplit la promesse avec le texte de la réponse
        deferred.resolve(JSON.parse(req.response));
      } else {
        // Sinon rejette avec le texte du statut
        // qui on l’éspère sera une erreur ayant du sens
        deferred.reject(Error(req.statusText));
      }
    };

    // Gère les erreurs réseau
    req.onerror = function() {
      deferred.reject(Error("Erreur réseau"));
    };

    // Lance la requête
    req.send();
    return deferred.promise;
  },

  getJsons: function(urls) {
  	var self = this;
  	var arr = [];
  	for (var i = 0; i < urls.length; i++) {
  		arr.push(this.getJson(urls[i]));
  	};

    return Q.all(arr);
  }

};
