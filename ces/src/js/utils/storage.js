export class Storage {
  constructor (area) {
    this.store = chrome.storage[area];
  }

  get (key = null) {
    return new Promise((resolve, reject) => {
      this.store.get(key, (response) => {
        if (key === null) {
          resolve(response);
        } else if (response.hasOwnProperty(key)) {
          resolve(response[key]);
        } else {
          reject();
        }
      });
    });
  }

  set (key, data) {
    return new Promise(resolve => {
      let storageObject = {};

      if (typeof key === 'string') {
        storageObject[key] = data;
      } else if (typeof key === 'object') {
        storageObject = key;
      }

      this.store.set(storageObject, resolve);
    });
  }
}

export default new Storage('sync');
