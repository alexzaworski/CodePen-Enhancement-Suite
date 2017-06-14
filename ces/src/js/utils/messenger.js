class Messenger {
  constructor(local = false) {
    this.local = local;
    this.methods = {};
    this.initPoll();
  }

  on(method, callback) {
    const { methods } = this;
    const callbacks = methods[method] || [];
    const id = callbacks.length;
    callbacks.push({ fn: callback, id });
    this.methods[method] = callbacks;
    return id;
  }

  off(method, id) {
    const { methods } = this;
    const callbacks = methods[method];
    if (!callbacks) return;
    callbacks.forEach((callback, index) => {
      if (id === callback.id) {
        callbacks.splice(index, 1);
      }
    });
    this.methods[method] = callbacks;
  }

  send(method, data) {
    const { local } = this;
    if (local) {
      const event = new CustomEvent('ces-messenger', {
        detail: { method, data }
      });
      window.dispatchEvent(event);
    } else {
      chrome.runtime.sendMessage({ method, data });
    }
  }

  sendToTab(method, data) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length) {
        const tabID = tabs[0].id;
        chrome.tabs.sendMessage(tabID, { method, data });
      }
    });
  }

  sendGlobal(method, data) {
    this.send(method, data);
    if (chrome.tabs) {
      this.sendToTab(method, data);
    }
  }

  // Fires an event and waits for a response from  a listener set up
  // by Messenger.onRequest()
  //
  // Returns a promise that will resolve once the listener is
  // responded to.
  //
  // Unfulfilled requests will retry every 100ms, configurable
  // with the `retry` argument.
  //
  // Note: currently the toggles in the page action actively
  // rely on the retry functionality. It's hacky in general
  // and should probaly be pulled out, but careful not to
  // break them!
  request(method, data, retry = 100) {
    const requestMethod = `request-${method}`;
    const responseMethod = `response-${method}`;
    let retryInterval;
    return new Promise(resolve => {
      const id = this.on(responseMethod, response => {
        const { requester, data } = response;
        if (requester === id) {
          this.off(responseMethod, id);
          clearInterval(retryInterval);
          resolve(data);
        }
      });

      const sendFunc = () =>
        this.sendGlobal(requestMethod, { data, requester: id });

      if (retry > 0) {
        retryInterval = setInterval(sendFunc, retry);
      } else {
        sendFunc();
      }
    });
  }

  // Creates a special handler that waits for requests from
  // Messenger.request(), then fires a callback. Callback return
  // values can either be synchronous functions or Promises.
  // Synchronus functions will be made thenable via Promise.resolve().
  //
  // Only one onRequest handler should be set up for any given method.
  onRequest(method, callback) {
    const { methods } = this;
    const requestMethod = `request-${method}`;
    const responseMethod = `response-${method}`;

    if (methods[requestMethod] !== undefined) {
      console.warn(`Handler for '${method}' already exists.`);
      return;
    }

    this.on(requestMethod, request => {
      const { data, requester } = request;
      Promise.resolve(callback(data)).then(response => {
        this.sendGlobal(responseMethod, { data: response, requester });
      });
    });
  }

  initPoll() {
    const { local } = this;
    if (local) {
      window.addEventListener('ces-messenger', e => {
        this.fireCallback(e.detail);
      });
    } else {
      chrome.runtime.onMessage.addListener(message => {
        this.fireCallback(message);
      });
    }
  }

  fireCallback({ method, data }) {
    const { methods } = this;
    const callbacks = methods[method];
    if (callbacks !== undefined) {
      callbacks.forEach(callback => {
        callback.fn(data);
      });
    }
  }
}

export const localMessenger = new Messenger(true);
export default new Messenger();
