/*
* ---
* GLOBALs
* ---
*/

var CES_GLOBALS = {};

/*
* CSRF Token
* ---
*
* CodePen uses a meta tag to defend against XSRF.
* This variable grabs that tag's content to allow POST requests
* which are required to change settings/save Pens/etc.
*
*/
CES_GLOBALS.CSRF_TOKEN = $("meta[name='csrf-token']").attr("content");

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
CES_GLOBALS.INIT_DATA = (function() {
  var data = $("#init-data").val();
  var parsedData = $.parseJSON(data);
  for (var key in parsedData) {
    var prop = parsedData[key];
    if (needsParsing(prop)) {
      parsedData[key] = $.parseJSON(prop);
    }
  }

  // Checks if a prop is valid JSON,
  // and if it's not parses it again
  function needsParsing(prop) {
    if ("string" == typeof prop) {
      var t = prop.substring(0, 1);
      if ("[" === t || "{" === t) {
        return true;
      }
    }
    return false;
  }

  // Sends INIT_DATA off to init.js since content scripts can't access the window object.
  // This allows conditional loading of modules based on INIT_DATA.
  var sendDataToContentScript = new CustomEvent("init-data-ready", {detail: parsedData});
  window.dispatchEvent(sendDataToContentScript);

  return parsedData;
})();

// Small utility to shortcut the AJAX requests needed to
// save/update stuff on CodePen.

// URL should be the relative path of the request,
// KEY should be the key of the data,
// VALUE should be the raw JSON data that you're sending.
CES_GLOBALS.CP = function(url, key, value, callback) {
  $.ajax({
    url: url,
    method: "POST",
    headers: {
      "X-CSRF-Token": CES_GLOBALS.CSRF_TOKEN,
    },
    data: key + "=" + encodeURIComponent(JSON.stringify(value)),
    complete: callback
  });
};

CES_GLOBALS.IS_HTTPS = function() {
  return window.location.protocol === "https:";
};

// Grabs the absolute path of a file via the message API.
// REQUESTEDURL is the relative path of the file,
// CALLBACK is... self explanatory. Fires once the URL is received.
CES_GLOBALS.REQUEST_EXTENSION_URL = function(requestedUrl, callback) {
  window.addEventListener("receivedUrl", function handleUrl(e) {
    window.removeEventListener("receivedUrl", handleUrl);
    callback(e.detail);
  });
  var requestExtensionUrl = new CustomEvent("requestExtensionUrl", {detail: requestedUrl});
  window.dispatchEvent(requestExtensionUrl);
};

// Appends a stylesheet to the head of the document.
// URL is the absolute path of the stylesheet.
CES_GLOBALS.APPEND_STYLESHEET = function(url) {
  var link = $("<link>");
  link.attr("type", "text/css");
  link.attr("rel", "stylesheet");
  link.attr("href", url);
  $("head").append(link);
};

// Binds to CodePen's internal pubhub dealio.
// I abstracted this into my own function incase it changes
// or this strategy stops being viable.
CES_GLOBALS.ON_PEN_SAVE = function(callback) {
  Hub.sub("pen-saved", callback);
};

// Uses CodePen's internal modal function which means
// I don't need to handle closing the modal or any of that
// nonsense which is preeeetty nice.
CES_GLOBALS.THROW_ERROR_MODAL = function(message) {
  CES_GLOBALS.REQUEST_EXTENSION_URL("modules/html/error-modal.html", function(response) {
    var errorModal = $("<div>").load(response, function() {
      errorModal.find("#ces__error-message").html(message);
      $.showModal(errorModal[0].innerHTML);
    });
  });
};

// http://stackoverflow.com/a/9251169
CES_GLOBALS.ESCAPE_HTML = (function() {
  var escape = document.createElement("textarea");
  return function(html) {
    escape.textContent = html;
    return escape.innerHTML;
  };
})();
