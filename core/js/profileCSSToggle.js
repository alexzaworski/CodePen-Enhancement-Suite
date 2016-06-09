var profileCSSToggle = (function(){
  var disableCSS = document.getElementById("disable-css");
  disableCSS.setAttribute("disabled", true);

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
    disableCSS.addEventListener("click", function(){
      if (disableCSS.checked) {
        sendToActiveTab({method:"disable-profile-css"});
      }
      else {
        sendToActiveTab({method:"enable-profile-css"});
      }
    });
  }


  // Sets the initial state of the toggle based on the user's settings
  function setInitialState(username) {
    disableCSS.removeAttribute("disabled");
    chrome.storage.sync.get("disabledProfiles", function(data){
      if (!data.hasOwnProperty("disabledProfiles")){
        return;
      }
      if (data.disabledProfiles.indexOf(username) != -1 ) {
        disableCSS.setAttribute("checked", true);
        sendToActiveTab("disable-profile-css");
      }
      else {
        disableCSS.removeAttribute("checked");
      }
    });
  }
})();