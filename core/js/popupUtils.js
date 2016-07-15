// Wrapper function to distribute runtime messages to the active tab
function sendToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}
