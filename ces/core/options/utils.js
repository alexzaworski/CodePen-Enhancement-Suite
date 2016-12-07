var escapeHTML = (function() {
  "use strict";
  var escape = document.createElement("textarea");
  return function(html) {
    escape.textContent = html;
    return escape.innerHTML;
  };
})();

var pubsub = (function() {
  "use strict";
  var topics = {};
  var subUid = -1;
  var subscribe = function(topic, func) {
    if (!topics[ topic ]) {
      topics[ topic ] = [];
    }
    var token = (++subUid).toString();
    topics[ topic ].push({
      token: token,
      func: func
    });
    return token;
  };

  var publish = function(topic, args) {
    if (!topics[ topic ]) {
      return false;
    }
    setTimeout(function() {
      var subscribers = topics[ topic ];
      var len = subscribers ? subscribers.length : 0;
      while (len--) {
        subscribers[ len ].func(args);
      }
    }, 0);
  };

  var unsubscribe = function(token) {
    for (var m in topics) {
      if (topics[ m ]) {
        for (var i = 0, j = topics[ m ].length; i < j; i++) {
          if (topics[ m ][ i ].token === token) {
            topics[ m ].splice(i, 1);
            return token;
          }
        }
      }
    }
    return false;
  };

  var reset = function() {
    topics = {};
    subUid = -1;
  };

  return {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    reset: reset
  };
}());
