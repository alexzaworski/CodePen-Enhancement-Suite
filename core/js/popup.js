var disableCss = document.getElementById("disable-css");
disableCss.setAttribute("disabled", true);

function sendToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

chrome.runtime.onMessage.addListener(function(message){
  if (message.method === "init-data-ready") {
    if (message.data.__pageType === "profile") {
      setEventListeners();
      setInitialState(message.data.__profiled.username);
    }
  }
});
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