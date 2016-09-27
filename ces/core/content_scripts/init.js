/*
* ---
* Kicks everything off
* ---
*/

// Helper function to load modules as needed.
//
// Since this appends scripts *after* all of CodePen's page scripts,
// we get access to some nice stuff like JQuery without having
// to load it ourselves.
function loadModule(scriptName, callback) {
  var scriptEl = document.createElement("script");
  scriptEl.src = chrome.extension.getURL("modules/js/" + scriptName + ".js");
  scriptEl.addEventListener("load", callback, false);
  document.body.appendChild(scriptEl);
}

styleEl = document.createElement("link");
styleEl.setAttribute("rel", "stylesheet");
styleEl.setAttribute("type", "text/css");
styleEl.setAttribute("href", chrome.extension.getURL("modules/css/modules.css"));
document.head.appendChild(styleEl);

// First loads modules that don't depend on the current page.
loadModule("globals");

var INIT_DATA;

// The Global Variables module includes some initialization data
// that is needed to conditionally load other modules, so we need to wait
// for that event to fire and then we can keep doin' our thing.
window.addEventListener("init-data-ready", function(e) {
  INIT_DATA = e.detail;
  loadConditionalModules();
});

// Handles the conditional loading of modules that
// aren't needed on all pages.
function loadConditionalModules() {
  if (document.getElementById("activity-dropdown")) {
    loadModule("activityFeed");
  }

  if (!INIT_DATA.hasOwnProperty("__pageType")) {
    return;
  }
  if (!!INIT_DATA.__pageType.match(/^(home|pen|posts|collection|details|explore-pens|explore-posts|explore-collections|full|activity)$/)) {
    loadModule("profilePreviews");
  }

  if (INIT_DATA.__pageType === "profile") {
    loadModule("hideProfileCSS");
  }

  if (!!INIT_DATA.__pageType.match(/^(pen|details|posts)$/)) {
    loadModule("commentPreviews");
  }

  if (INIT_DATA.__pageType === "pen") {
    loadModule("recentPensTypeahead");
    loadModule("resizablePreviews");
    // Only loads if the user owns the Pen they're viewing (and they're logged in).
    if (INIT_DATA.__pen.user_id === INIT_DATA.__user.id && INIT_DATA.__user.id != 1) {
      loadModule("editorSettings");
    }
  }
}

// Starts an event listener that waits for requests for
// absolute paths.
window.addEventListener("requestExtensionUrl", function(e) {
  url = e.detail;
  var urlResponse = new CustomEvent("receivedUrl", {detail: chrome.extension.getURL(url)});
  window.dispatchEvent(urlResponse);
});
