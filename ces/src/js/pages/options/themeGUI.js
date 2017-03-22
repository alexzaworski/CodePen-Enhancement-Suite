import presets from 'js/utils/theme_utils/presets';
import dom from 'js/utils/dom';
import ColorHandler from 'js/pages/options/colorHandler';
import storage from 'js/utils/storage';
import { localMessenger as messenger } from 'js/utils/messenger';

class ThemeGUI {
  init (theme) {
    const { light, elements, lastSaved = false } = theme;
    this.lastSaved = lastSaved;
    this.presets = presets;
    this.setupUIEls();
    this.setupListeners();
    this.light = light;
    this.handleLightStatus(light);
    this.ColorHandler = new ColorHandler(elements, this.colorControlsWrap);
  }

  handleLightStatus (isLight) {
    this.lightThemeToggle.prop('checked', isLight);
    this.setPageBackground(isLight);
  }

  setupUIEls () {
    this.lightThemeToggle = dom.get('#base-ui');
    this.pageWrap = dom.get('#page-wrap');
    this.fauxToggleLabels = dom.getAll('.base-ui__label');
    this.presetSelect = dom.get('#presets');
    this.presetLoad = dom.get('#load-preset');
    this.colorControlsWrap = dom.get('#color-controls');
    this.styleEl = dom.get('#theme-styles');
    this.saveButton = dom.get('#save');
    this.setupPresetSelect();
  }

  setPageBackground (isLight) {
    this.pageWrap.toggleClass('light', isLight);
  }

  setupListeners () {
    const {
      lightThemeToggle,
      fauxToggleLabels,
      presetLoad,
      saveButton
    } = this;

    lightThemeToggle.on('click', e => {
      this.light = !this.light;
      this.setPageBackground(this.light);
    });

    fauxToggleLabels.forEach(label => {
      label.on('click', () => {
        lightThemeToggle.click();
      });
    });

    presetLoad.on('click', () => {
      const { presetSelect, ColorHandler, presets } = this;
      const value = presetSelect.prop('value');
      const { elements, light } = presets[value];
      this.light = light;
      this.handleLightStatus(light);
      ColorHandler.setTo(elements);
      this.updateStyles();
    });

    saveButton.on('click', () => {
      const { ColorHandler, light } = this;
      const elements = ColorHandler.getElementBasics();
      storage.set('custom-editor-theme', { elements, light });
    });

    messenger.on('style-update', () => {
      // This can get fired a whole bunch of times at once, especially
      // when changing presets. We throttle just a tiny bit to avoid
      // updating the dom an obnoxious amount.
      //
      // We still want snappy responses to changing values though so
      // the timeout shouldn't be higher than a few MS.
      const { pendingUpdate } = this;
      clearTimeout(pendingUpdate);
      this.pendingUpdate = setTimeout(() => {
        this.updateStyles();
      }, 10);
    });
  }

  updateStyles () {
    const { ColorHandler, styleEl } = this;
    styleEl.text(ColorHandler.getElementCSS());
  }

  setupPresetSelect () {
    const { presetSelect, presets } = this;
    let html = '';
    for (const preset in presets) {
      html += dom
        .create('option')
        .text(preset)
        .outerHTML();
    }
    presetSelect.html(html);
  }
}

export default new ThemeGUI();
