class Storage {
  constructor (area) {
    this.store = chrome.storage[area];
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this.store.get(key, (response) => {
        if (response.hasOwnProperty(key)) {
          resolve(response[key]);
        } else {
          reject();
        }
      });
    });
  }

  set (key, data) {
    return new Promise(resolve => {
      const storageObject = {};
      storageObject[key] = data;
      this.store.set(storageObject, resolve);
    });
  }
}

export default new Storage('local');
