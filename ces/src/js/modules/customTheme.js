import CESModule from 'js/modules/core/CESModule';
import dom from 'js/utils/dom';
import storage from 'js/utils/storage';
import messenger from 'js/utils/messenger';
import buildCSS from 'js/utils/theme_utils/buildCSS';
import getActiveTheme from 'js/utils/theme_utils/getActiveTheme';

export default class CustomTheme extends CESModule {
  constructor() {
    super();
    this.originalThemeSelector = '[href*="assets/editor/themes"]';
    this.conditions = {
      selectorExists: this.originalThemeSelector
    };
  }

  go() {
    this.pageWrap = dom.exists('.page-wrap');
    this.ogWrapClass = this.pageWrap ? this.pageWrap.classes() : '';
    this.ogTheme = dom.get(this.originalThemeSelector);
    this.styleEl = dom.create('style');
    storage
      .get('enable-custom-theme')
      .catch(() => false)
      .then(enabled => this.init(enabled));
  }

  init(enabled) {
    this.enabled = enabled;
    this.setupThemeStyles(enabled);
    messenger.on('enable-custom-theme', enabled => this.handleChange(enabled));
  }

  setupThemeStyles(enabled) {
    const { styleEl } = this;
    getActiveTheme().then(theme => {
      this.theme = theme;
      buildCSS(theme).then(css => {
        styleEl.html(css);
        if (enabled) this.enableTheme();
      });
    });
  }

  enableTheme() {
    const { ogTheme, styleEl } = this;
    ogTheme.remove();
    styleEl.appendTo(dom.get('head'));
    this.enabled = true;
    this.addWrapClasses();
  }

  disableTheme() {
    const { ogTheme, styleEl } = this;
    ogTheme.appendTo(dom.get('head'));
    styleEl.remove();
    this.enabled = false;
    this.removeWrapClasses();
  }

  addWrapClasses() {
    const { pageWrap, theme } = this;
    const { light } = theme;
    if (!pageWrap) return;
    pageWrap.classes(`page-wrap ces-theme ${light ? 'ces-light-theme' : ''}`);
  }

  removeWrapClasses() {
    const { pageWrap, ogWrapClass } = this;
    if (!pageWrap) return;
    pageWrap.classes(ogWrapClass);
  }

  handleChange(enabled) {
    if (enabled) {
      this.enableTheme();
    } else {
      this.disableTheme();
    }
  }
}
