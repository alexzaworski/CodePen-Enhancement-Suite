// Adds a GUI to enable users to toggle JS on/off
// in Pen previews. The handling of the query parameter
// is done by CodePen, this just makes it a bit easier.
//
// Pretty much all of this is straightforward. Leverages a tiny
// URL parsing library I nabbed off stackoverflow.

var previewJSToggle = (function() {

  var disableJS = document.getElementById("disable-js");
  setInitialState();
  disableJS.addEventListener("click", function() {
    if (disableJS.checked) {
      disablePreviewJS();
    } else {
      enablePreviewJS();
    }
  });

  function setInitialState() {
    chrome.tabs.getSelected(function(tab) {
      disableJS.checked = URLParser(tab.url).hasParam("turn_off_js");
    });
  }

  function disablePreviewJS() {
    chrome.tabs.getSelected(function(tab) {
      var url = URLParser(tab.url);
      if (!url.hasParam("turn_off_js")) {
        url = url.setParam("turn_off_js", true);
        chrome.tabs.update({url: url});
      }
    });
  }

  function enablePreviewJS() {
    chrome.tabs.getSelected(function(tab) {
      var url = URLParser(tab.url);
      if (url.hasParam("turn_off_js")) {
        url = url.removeParam("turn_off_js");
        chrome.tabs.update({url: url});
      }
    });
  }

  // ...Didn't want to deal with this nonsense,
  // cleaned up this guy's (already small) library:
  // http://stackoverflow.com/a/12397882
  //
  // Certainly isn't optimal but it will work for now.
  function URLParser(u) {
    var path = "";
    var query = "";
    var hash = "";
    var params;

    if (u.indexOf("#") > 0) {
      hash = u.substr(u.indexOf("#") + 1);
      u = u.substr(0 , u.indexOf("#"));
    }

    if (u.indexOf("?") > 0) {
      path = u.substr(0 , u.indexOf("?"));
      query = u.substr(u.indexOf("?") + 1);
      params = query.split("&");
    } else {
      path = u;
    }

    return {
      setParam: function(name, value) {
        query = "";
        params = params || [];
        params.push(name + "=" + value);
        params.forEach(function(param) {
          if (query.length > 0) { query += "&"; }
          query += param;
        });
        if (query.length > 0) { query = "?" + query; }
        if (hash.length > 0) { query = query + "#" + hash; }
        return path + query;
      },
      hasParam: function(name) {
        if (!params) {
          return;
        }
        for (var i = 0; i < params.length; i++) {
          var pair = params[i].split("=");
          if (decodeURIComponent(pair[0]) == name) { return true; }
        }
        return false;
      },
      removeParam: function(name) {
        query = "";
        if (params) {
          var newparams = [];
          params.forEach(function(param) {
            var pair = param.split("=");
            if (decodeURIComponent(pair[0]) != name) {
              newparams.push(param);
            }
          });
          params = newparams ;
          params.forEach(function(param) {
            if (query.length > 0) { query += "&"; }
            query += param;
          });
        }
        if (query.length > 0) { query = "?" + query; }
        if (hash.length > 0) { query = query + "#" + hash; }
        return path + query;
      },
    };
  }
})();
