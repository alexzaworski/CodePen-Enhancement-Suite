class Storage {
  constructor (area) {
    this.store = chrome.storage[area];
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this.store.get(key, (response) => {
        if (response.hasOwnProperty(key)) {
          resolve(response.key);
        } else {
          reject();
        }
      });
    });
  }

  set (key, data) {
    return new Promise(resolve => {
      this.store.set({key: data}, resolve);
    });
  }
}

export default new Storage('local');
