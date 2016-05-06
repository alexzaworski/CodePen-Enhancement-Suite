/*
* ---
* Kicks everything off yeeeee
* ---
*/

// Helper function to load modules as needed.
//
// Since this appends scripts *after* all of CodePen's page scripts,
// we get access to some nice stuff like JQuery without having
// to load it ourselves.
function loadModule(scriptName, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = chrome.extension.getURL('lib/modules/' + scriptName + '.js');
  scriptEl.addEventListener('load', callback, false);
  document.body.appendChild(scriptEl);
}


styleEl = document.createElement("link")
styleEl.setAttribute("rel", "stylesheet")
styleEl.setAttribute("type", "text/css")
styleEl.setAttribute("href", chrome.extension.getURL("lib/css/ces_lib.css"));
document.head.appendChild(styleEl);


// First loads modules that don't depend on the current page.
loadModule("globalVars");
loadModule("utilScripts");


// The Global Variables module includes some initialization data
// that is needed to conditionally load other modules, so we need to wait
// for that event to fire and then we can keep doin' our thing.
window.addEventListener("initDataMessage", function(evt) {
  initData = evt.detail;
  loadConditionalModules();
});


// Handles the conditional loading of modules that
// aren't needed on all pages.
function loadConditionalModules() {
  if (initData.__pageType === "profile") {
    loadModule("hideProfileCss");
  }
  if (initData.__pageType === "pen") {

    // Only loads if the user owns the Pen they're viewing (and they're logged in).
    if ( initData.__pen.user_id === initData.__user.id && initData.__user.id != 1 ) {
      loadModule("cesSave");
      loadModule("customPenSlugs");
      loadModule("editorSettings");
    }
    loadModule("resizablePreviews");
  }
}


// Starts an event listener that waits for requests for 
// absolute paths.
window.addEventListener("requestExtensionUrl", function(evt) {
  url = evt.detail;
  var urlResponse = new CustomEvent("receivedUrl", {detail: chrome.extension.getURL(url)});
  window.dispatchEvent(urlResponse);
});