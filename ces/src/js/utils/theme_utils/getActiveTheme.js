import storage, { Storage } from 'js/utils/storage';
import { defaultPreset } from './presets';
import migrateOldTheme from './migrateOldTheme';
import mergeThemeWithGlobals from './mergeThemeWithGlobals';

const local = new Storage('local');

export default () => new Promise((resolve) => {
  storage
    .get('custom-editor-theme')
    .then(mergeThemeWithGlobals)
    .catch(handleOldTheme)
    .then(resolve);
});

const handleOldTheme = () => {
  return new Promise(resolve => {
    // Attempts to grab all the old storage keys from custom themes
    // (from pre-1.0.0)
    const oldThemeParts = [
      'cmElements',
      'cmLastSaved',
      'cmIsLightTheme'
    ].map(key => local.get(key));

    Promise.all(oldThemeParts)
      // If they're there we need to migrate the user's existing theme
      // to the newer storage format, then serve it
      .then(response => migrateOldTheme(...response))
      .then(mergeThemeWithGlobals)
      .then(resolve)
      // Otherwise we can serve the default theme
      .catch(() => resolve(defaultPreset));
  });
};
