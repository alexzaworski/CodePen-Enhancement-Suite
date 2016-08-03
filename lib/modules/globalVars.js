/*
* ---
* GLOBAL VARIABLES
* ---
*
* Sets up global variables for use by other modules.
*
*/

/*
* CSRF token variable
* ---
*
* CodePen uses a meta tag to defend against XSRF.
* This variable grabs that tag's content to allow POST requests
* which are required to change settings/save Pens/etc.
*
*/
var CSRF_TOKEN = $("meta[name='csrf-token']").attr("content");

/*
* Init Data Variable
* ---
*
* Grabs a copy of the init-data hidden input that's used on all CodePen pages.
*
* Awkwardly, these are actually merged into the window object by CodePen but
* this is an easier way to get access to everything.
*
* The JSON parsing gets incredibly awkward... Would prefer something easier.
*/
var INIT_DATA = (function() {
  var data = $("#init-data").val();
  var parsedData = $.parseJSON(data);
  for (var key in parsedData) {
    var prop = parsedData[ key ];
    if (needsParsing(prop)) {
      parsedData[ key ] = $.parseJSON(prop);
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

