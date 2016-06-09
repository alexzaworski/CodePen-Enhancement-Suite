/*
* ---
* Acts as the middle ground between the Page Action logic (core/js/popup.js) and 
* the profile css module (lib/modules/hideProfileCSS.js)
* ---
*/

var profileCSSHandler = (function(){
  var disabledProfiles = [],
      user;

  // Needs to have access to the initData object in order to determine
  // if all of the profile-related listeners etc need to be enabled
  window.addEventListener("init-data-ready", function() {
    
    // If we're not on a profile page we can just bail and skip doing anything else
    if (initData.__pageType != "profile") {
      return;
    }

    // Otherwise record what profile we're currently viewing
    // and handle things accordingly
    user = initData.__profiled.username;
    setRuntimeListeners();
    setUpDisabledProfiles();
    
  });


  // Grabs an array of usernames that represents the profiles
  // which currently have their styles disabled.
  function setUpDisabledProfiles() {
    chrome.storage.sync.get("disabledProfiles", function(data){
      if (data.hasOwnProperty("disabledProfiles")) {
        disabledProfiles = data.disabledProfiles;
      }
    });
  }


  // This listens for requests from the Hide Profile CSS module,
  // which is solely responsible for enabling/disabling the css on the page
  // and has no knowledge of which profiles are/arent' currently disabled
  //
  // This is basically called as soon as the module is done loading
  // so it can remove the CSS immediately. This needs to be done this way since
  // the Page Action popup won't do anything until it's actually clicked
  // by the user (ie the CSS won't be removed at all until the user takes action).
  window.addEventListener("request-css-event", function(){;
    if (isProfileCSSDisabled(user, disabledProfiles)) {
        sendDisableCSSEvent();
    }
  })


  // Sets up the onMessage listeners that interact with the Page Action popup.
  //
  // This essentially acts as the bridge between the popup and the actual DOM--
  // the messages relayed to the Hide Profile CSS module which then strips
  // or adds the style tags accordingly.
  function setRuntimeListeners() {
    chrome.runtime.onMessage.addListener(function(message){
      if (message.method === "disable-profile-css") {
        sendDisableCSSEvent();
        addToDisabledProfiles(user, disabledProfiles);
      }
      if (message.method === "enable-profile-css" ) {
        sendEnableCSSEvent();
        removeFromDisabledProfiles(user, disabledProfiles);
      }
      if (message.method === "request-init-data") {
        prepareInitDataForPopup();
      }
    });
  }


  // Sends a copy of initData to the Page Action popup.
  //
  // It really feels like there ought to be a better way to handle this
  // but I'm not sure what it is.
  function prepareInitDataForPopup() {
    var initDataReady = {
      method: "init-data-ready",
      data: initData
    }
    chrome.runtime.sendMessage(initDataReady);
  }


  // Adds a username to the array of profiles
  // that have their CSS disabled, then saves to
  // Chrome's storage for later access.
  function addToDisabledProfiles() {
    if (disabledProfiles.indexOf(user) === -1) {
      disabledProfiles.push(user);
    }
    chrome.storage.sync.set({"disabledProfiles":disabledProfiles});
  }


  // Exact opposite of the above.
  function removeFromDisabledProfiles () {
    var index = disabledProfiles.indexOf(user);
    if (index != -1) {
      disabledProfiles.splice(index, 1);
    }
    chrome.storage.sync.set({"disabledProfiles":disabledProfiles});
  }

  function isProfileCSSDisabled() {
    return (disabledProfiles.indexOf(user) != -1);
  }


  // These functions both dispatch events
  // which the Hide Profile CSS module listens for
  // in order to know when to make DOM changes
  function sendDisableCSSEvent() {
    var disableCSS = new CustomEvent("disable-css");
    window.dispatchEvent(disableCSS);
  }

  function sendEnableCSSEvent() {
    var enableCSS = new CustomEvent("enable-css");
    window.dispatchEvent(enableCSS);
  }
})();
