var disableCss = document.getElementById("disable-css");
disableCss.setAttribute("disabled", true);

// Wrapper function to distribute runtime messages to the active tab
function sendToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// Waits for initData to be passed, then initializes everything accordingly
chrome.runtime.onMessage.addListener(function(message){
  if (message.method === "init-data-ready") {
    if (message.data.__pageType === "profile") {
      setEventListeners();
      setInitialState(message.data.__profiled.username);
    }
  }
});


// Requests initData after the init-data-ready listener is set
sendToActiveTab({method:"request-init-data"});


function setEventListeners() {
  disableCss.addEventListener("click", function(){
    if (disableCss.checked) {
      sendToActiveTab({method:"disable-profile-css"});
    }
    else {
      sendToActiveTab({method:"enable-profile-css"});
    }
  });
}


// Sets the initial state of the toggle based on the user's settings
function setInitialState(username) {
  disableCss.removeAttribute("disabled");
  chrome.storage.sync.get("disabledProfiles", function(data){
    if (!data.hasOwnProperty("disabledProfiles")){
      return;
    }
    if (data.disabledProfiles.indexOf(username) != -1 ) {
      disableCss.setAttribute("checked", true);
      sendToActiveTab("disable-profile-css");
    }
    else {
      disableCss.removeAttribute("checked");
    }
  });
}