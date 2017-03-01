/*
* ---
* GLOBALs
* ---
*/

var CES = {};

if (window.jQuery) {
  init();
} else {
  var scriptEl = document.createElement('script');
  document.body.appendChild(scriptEl);
  scriptEl.addEventListener('load', init);
  scriptEl.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js';
}

function init () {
  /*
  * Init Data
  * ---
  *
  * Grabs a copy of the init-data hidden input that's used on all CodePen pages.
  *
  * Awkwardly, these are actually merged into the window object by CodePen but
  * this is an easier way to get access to everything.
  *
  * The JSON parsing gets incredibly awkward... Would prefer something easier.
  */
  CES.initData = (function () {
    var data = $('#init-data').val();
    var parsedData = $.parseJSON(data);
    for (var key in parsedData) {
      var prop = parsedData[key];
      if (needsParsing(prop)) {
        parsedData[key] = $.parseJSON(prop);
      }
    }

    // Checks if a prop is valid JSON,
    // and if it's not parses it again
    function needsParsing (prop) {
      if (typeof prop === 'string') {
        var t = prop.substring(0, 1);
        if (t === '[' || t === '{') {
          return true;
        }
      }
      return false;
    }

    // Sends initData off to init.js since content scripts can't access the window object.
    // This allows conditional loading of modules based on initData.
    var sendDataToContentScript = new CustomEvent('init-data-ready', {detail: parsedData});
    window.dispatchEvent(sendDataToContentScript);

    return parsedData;
  })();

  // Small utility to shortcut the AJAX requests needed to
  // save/update stuff on CodePen.

  // URL should be the relative path of the request,
  // KEY should be the key of the data,
  // VALUE should be the raw JSON data that you're sending.
  CES.cpPost = function (url, key, value, callback) {
    $.ajax({
      url: url,
      method: 'POST',
      headers: {
        'X-CSRF-Token': $("meta[name='csrf-token']").attr('content')
      },
      data: key + '=' + encodeURIComponent(JSON.stringify(value)),
      complete: callback
    });
  };

  // Grabs the absolute path of a file via the message API.
  // requestedUrl is the relative path of the file,
  CES.requestExtensionURL = function (requestedUrl, callback) {
    window.addEventListener('receivedUrl', function handleUrl (e) {
      window.removeEventListener('receivedUrl', handleUrl);
      callback(e.detail);
    });
    var requestExtensionUrl = new CustomEvent('requestExtensionUrl', {detail: requestedUrl});
    window.dispatchEvent(requestExtensionUrl);
  };
}
