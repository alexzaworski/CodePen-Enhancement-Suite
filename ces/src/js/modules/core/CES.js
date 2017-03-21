import storage, { Storage } from '../../utils/storage';

class CES {
  constructor () {
    this.modules = [];
    this.hasMigratedKey = 'is-sync';
  }

  registerModule (Module) {
    this.modules.push(new Module());
  }

  init () {
    storage.get(this.hasMigratedKey)
    .catch(() => this.migrateStorage())
    .then(() => this.initModules());
  }

  initModules () {
    this.modules.forEach(module => {
      module.shouldInit() && module.go();
    });
  }

  migrateStorage () {
    // The extension used to use the local storagearea,
    // this moves everything from local to sync and
    // clears local.
    const local = new Storage('local');
    local.get().then(response => {
      response[this.hasMigratedKey] = true;
      storage.set(response);
      chrome.storage.local.clear();
    });
  }
}

export default new CES();
