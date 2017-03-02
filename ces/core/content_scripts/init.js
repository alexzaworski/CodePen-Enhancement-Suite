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
function loadModule (scriptName, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = chrome.extension.getURL('modules/js/' + scriptName + '.js');
  scriptEl.addEventListener('load', callback, false);
  document.body.appendChild(scriptEl);
}

var styleEl = document.createElement('link');
styleEl.setAttribute('rel', 'stylesheet');
styleEl.setAttribute('type', 'text/css');
styleEl.setAttribute('href', chrome.extension.getURL('modules/css/modules.css'));
document.head.appendChild(styleEl);

// First loads modules that don't depend on the current page.
loadModule('globals');

var initData;

// The Global Variables module includes some initialization data
// that is needed to conditionally load other modules, so we need to wait
// for that event to fire and then we can keep doin' our thing.
window.addEventListener('init-data-ready', function (e) {
  initData = e.detail;
  loadConditionalModules();
});

// Handles the conditional loading of modules that
// aren't needed on all pages.
function loadConditionalModules () {
  if (document.getElementById('activity-dropdown')) {
    loadModule('activityFeed');
  }

  if (!initData.hasOwnProperty('__pageType')) {
    return;
  }
  if (initData.__pageType.match(/^(home|pen|posts|collection|details|explore-pens|explore-posts|explore-collections|full|activity)$/)) {
    loadModule('profilePreviews');
  }

  if (initData.__pageType === 'profile') {
    loadModule('hideProfileCSS');
  }

  if (initData.__pageType.match(/^(pen|details|posts)$/)) {
    loadModule('commentPreviews');
  }

  if (initData.__pageType === 'pen') {
    loadModule('distractionFreeMode');
    loadModule('recentPensTypeahead');
    loadModule('resizablePreviews');

    // Only loads if the user owns the Pen they're viewing (and they're logged in).
    // Technically could be loaded regardless of whether or not the person owns the Pen,
    // but that would require some UI changes since there's no save button in that case.
    //
    // CMD-S would still work but that causes a fork if you're viewing someone else's Pen.
    // Eventually it would be good to sort all of that out.
    if (initData.__item.user_id === initData.__user.id && initData.__user.id !== 1) {
      loadModule('editorSettings');
    }
  }
}

// Starts an event listener that waits for requests for
// absolute paths.
window.addEventListener('requestExtensionUrl', function (e) {
  var url = e.detail;
  var urlResponse = new CustomEvent('receivedUrl', {detail: chrome.runtime.getURL(url)});
  window.dispatchEvent(urlResponse);
});
