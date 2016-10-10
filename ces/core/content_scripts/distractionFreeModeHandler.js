var distractionFreeHandler = (function() {
  window.addEventListener("init-data-ready", function(e) {
    INIT_DATA = e.detail;
    if (INIT_DATA.__pageType != "pen") {
      return;
    }
    addListeners();
  });
  function addListeners() {
    window.addEventListener("request-distraction-free", function() {
      chrome.storage.local.get("distractionFree", function(r) {
        if (r.distractionFree === true) {
          sendStatus(true);
        } else {
          sendStatus(false);
          if (r.distractionFree === undefined) {
            chrome.storage.local.set({"distractionFree": false});
          }
        }
      });
    });

    window.addEventListener("distraction-free-update", function(e) {
      setStatus(e.detail);
    });
  }

  function sendStatus(status) {
    var statusEvent = new CustomEvent("distraction-free-enabled", {detail: status});
    window.dispatchEvent(statusEvent);
  }
  function setStatus(status) {
    chrome.storage.local.set({"distractionFree": status});
  }
})();
