/*
* ---
* UTILITY FUNCTIONS
* ---
*
* Should generally be prefixed with "u_"
*
*/


// Small utility to shortcut the AJAX requests needed to
// save/update stuff on CodePen.

// URL should be the relative path of the request,
// KEY should be the key of the data,
// VALUE should be the raw JSON data that you're sending.
var u_CP = function(url, key, value, callback) {
  $.ajax({
    url: url,
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    data: key + "=" + encodeURIComponent(JSON.stringify(value)),
    complete: callback
  })
}


// Returns TRUE if currently using https
var u_isHttps = function() {
  return window.location.protocol === "https:"
}


// Grabs the absolute path of a file via the message API.
// REQUESTEDURL is the relative path of the file,
// CALLBACK is... self explanatory. Fires once the URL is received.
var u_requestExtensionUrl = function(requestedUrl, callback){
  window.addEventListener("receivedUrl", function handleUrl(evt) {
    window.removeEventListener("receivedUrl", handleUrl);
    callback(evt.detail);
  });
  var requestExtensionUrl = new CustomEvent("requestExtensionUrl", {detail: requestedUrl});
  window.dispatchEvent(requestExtensionUrl);
}


// Appends a stylesheet to the head of the document.
// URL is the absolute path of the stylesheet.
var u_appendStylesheet = function(url) {
  var link = $("<link>");
  link.attr("type", "text/css");
  link.attr("rel", "stylesheet");
  link.attr("href", url);
  $("head").append(link);
}


// Binds to CodePen's internal pubhub dealio.
// I abstracted this into my own function incase it changes
// or this strategy stops being viable.
var u_onPenSave = function(callback) {
  Hub.sub("pen-saved", callback)
}


// Uses CodePen's internal modal function which means
// I don't need to handle closing the modal or any of that
// nonsense which is preeeetty nice.
var u_throwErrorModal = function(message) {
  u_requestExtensionUrl("lib/html/error-modal.html", function(response){
    var errorModal = $("<div>").load(response, function(){
      errorModal.find("#ces__error-message").html(message);
      $.showModal(errorModal[0].innerHTML);
    });
  })
}

// http://stackoverflow.com/a/9251169
var u_escapeHTML = (function() {
  var escape = document.createElement('textarea');
  return function(html) {
    escape.textContent = html;
    return escape.innerHTML;
  }
})();
