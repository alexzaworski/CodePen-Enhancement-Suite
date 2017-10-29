class PageActionListener {
  init() {
    chrome.tabs.onUpdated.addListener(function(id, info, tab) {
      if (tab.url.match(/^http(s)?:\/\/codepen.io/)) {
        chrome.pageAction.show(id);
      }
    });
  }
}

export default new PageActionListener();
