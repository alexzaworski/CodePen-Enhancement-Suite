// Responsible for enabling the Page Action on codepen domains

chrome.tabs.onUpdated.addListener(function(id, info, tab){
  var domain = tab.url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
  if (domain === "codepen.io") {
    chrome.pageAction.show(id);
  }
});
