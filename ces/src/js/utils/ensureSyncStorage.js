import storage, { Storage } from 'js/utils/storage';

const syncKey = 'is-sync';

const keysToMigrate = [
  { oldKey: 'disable-patch-notes' },
  { oldKey: 'has-loaded-before' },
  {
    oldKey: 'disabledProfiles',
    newKey: 'disabled-profiles'
  },
  {
    oldKey: 'distractionFree',
    newKey: 'distraction-free'
  },
  {
    oldKey: 'cmCustomThemeEnabled',
    newKey: 'custom-theme-enabled'
  }
];

export default () => {
  return new Promise(resolve => {
    storage.get(syncKey).catch(migrateStorage).then(resolve);
  });
};

const migrateStorage = () => {
  const local = new Storage('local');
  return local
    .get()
    .then(migrateKeys)
    .then(newStorage => storage.set(newStorage));
};

const migrateKeys = oldStorage => {
  const newStorage = {};
  newStorage[syncKey] = true;

  keysToMigrate.forEach(key => {
    const { oldKey, newKey = oldKey } = key;
    const value = oldStorage[oldKey];
    if (value !== undefined) newStorage[newKey] = value;
  });

  return newStorage;
};
