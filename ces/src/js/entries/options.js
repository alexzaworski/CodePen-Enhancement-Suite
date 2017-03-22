import getPartial from 'js/utils/getPartial';
import dom from 'js/utils/dom';
import themeGUI from 'js/pages/options/themeGUI';
import presets from 'js/utils/theme_utils/presets';
import ensureSyncStorage from 'js/utils/ensureSyncStorage';
import getActiveTheme from 'js/utils/theme_utils/getActiveTheme';

const prepPage = () => {
  const preview = dom.get('#preview');
  getPartial('theme-preview').then(r => preview.html(r));
};

const initGUI = () => {
  getActiveTheme().then(theme => themeGUI.init(theme, presets));
};

ensureSyncStorage().then(() => {
  prepPage();
  initGUI();
});
