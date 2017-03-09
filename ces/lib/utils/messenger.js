class Messenger {
  constructor () {
    this.callbacks = {};
    this.send = chrome.tabs ? this.sendToTab : this.sendGeneralMessage;
  }

  on (method, callback) {
    this.callbacks[method] = callback;
  }

  sendGeneralMessage (method, data) {
    chrome.runtime.sendMessage({method, data});
  }

  sendToTab (method, data) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (tabs.length) {
        const tabID = tabs[0].id;
        chrome.tabs.sendMessage(tabID, {method, data});
      }
    });
  }

  initPoll () {
    chrome.runtime.onMessage.addListener(message => {
      const { method, data } = message;
      if (typeof this.callbacks[method] === 'function') {
        this.callbacks[method](data);
      }
    });
  }
}

export default new Messenger();
