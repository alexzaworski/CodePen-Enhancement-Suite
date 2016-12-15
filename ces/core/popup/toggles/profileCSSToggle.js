var profileCSSToggle = (function() {
  // Wrapper function to distribute runtime messages to the active tab
  function sendToActiveTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

  var disableCSS = document.getElementById("disable-css");
  disableCSS.setAttribute("disabled", true);

  // Waits for INIT_DATA to be passed, then initializes everything accordingly
  chrome.runtime.onMessage.addListener(function(message) {
    if (message.method === "init-data-ready") {
      if (message.data.__pageType === "profile") {
        setEventListeners();
        setInitialState(message.data.__profiled.username);
      }
    }
  });

  // Requests INIT_DATA after the init-data-ready listener is set
  sendToActiveTab({method: "request-init-data"});

  function setEventListeners() {
    disableCSS.addEventListener("click", function() {
      sendToActiveTab({method: "disable-profile-css", data: disableCSS.checked});
    });
  }

  // Sets the initial state of the toggle based on the user's settings
  function setInitialState(username) {
    disableCSS.removeAttribute("disabled");
    chrome.storage.local.get("disabledProfiles", function(data) {
      if (!data.hasOwnProperty("disabledProfiles")) {
        return;
      }
      if (data.disabledProfiles.indexOf(username) != -1) {
        disableCSS.setAttribute("checked", true);
        sendToActiveTab("disable-profile-css");
      } else {
        disableCSS.removeAttribute("checked");
      }
    });
  }
})();
