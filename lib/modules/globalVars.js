/*
* ---
* GLOBAL VARIABLES
* ---
*
* Sets up global variables for use by other modules.
* I'm trying to be fairly rigorous in documenting these since they're
* generally bad practice.
*
*/

/*
* CSRF token variable
* ---
*
* CodePen uses a meta tag to defend against XSRF.
*
* This variable grabs that tag's content to allow POST requests
* which are required to change settings/save Pens/etc. 
*
*/
var csrfToken = $("meta[name='csrf-token']").attr("content");


/*
* Base URL variable
* ---
*
* Sets the base URL to be used with AJAX requests
* (it can vary due to https/non-https pages).
*
*/
var baseUrl = window.location.origin + "/";


/*
* Init Data Variable
* ---
*
* Grabs a copy of the init-data hidden input that's used on all CodePen pages.
*
* Awkwardly, these are actually merged into the window object by CodePen but
* this is an easier way to get organized access to everything.
*
* The JSON parsing gets incredibly awkward... Would prefer something easier.
*/
var initData = (function(){
  var data = $("#init-data").val();
  data = data.replace(/\"\{/g, '{') // Strips quotes from curly brackets
             .replace(/\}\"/g, '}')
             .replace(/"\[/g, '[') // Strips quotes from square brackets
             .replace(/\]\"/g, ']')
             .replace(/\\\"/g, '\"') // Strips the first layer of slashes
             .replace(/\\\"/g, '\"'); // Strips the second layer of slashes
  return JSON.parse(data);
})();


// Sends initData off to init.js since content scripts can't access the window object.
// This allows conditional loading of modules based on initData.
var sendDataToContentScript = new CustomEvent("init-data-ready", {detail: initData});
window.dispatchEvent(sendDataToContentScript);
