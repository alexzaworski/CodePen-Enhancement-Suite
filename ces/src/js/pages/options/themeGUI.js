import presets from 'js/utils/theme_utils/presets';
import dom from 'js/utils/dom';
import ColorHandler from 'js/pages/options/colorHandler';
import storage from 'js/utils/storage';
import { localMessenger as messenger } from 'js/utils/messenger';

class ThemeGUI {
  init(theme) {
    const { light, elements, lastSaved = false } = theme;
    this.savedTheme = theme;
    this.presets = presets;
    this.lastSaved = lastSaved;
    this.light = light;

    this.setupUIEls();
    this.setupListeners();
    this.handleLightStatus(light);
    this.displaySaveTime();

    this.colorHandler = new ColorHandler(elements, this.colorControlsWrap);
  }

  handleLightStatus(isLight) {
    this.lightThemeToggle.prop('checked', isLight);
    this.setPageBackground(isLight);
  }

  setupUIEls() {
    this.lightThemeToggle = dom.get('#base-ui');
    this.pageWrap = dom.get('#page-wrap');
    this.fauxToggleLabels = dom.getAll('.base-ui__label');
    this.presetSelect = dom.get('#presets');
    this.presetLoad = dom.get('#load-preset');
    this.colorControlsWrap = dom.get('#color-controls');
    this.styleEl = dom.get('#theme-styles');
    this.saveButton = dom.get('#save');
    this.lastSavedEl = dom.get('#last-saved');
    this.saveInfo = dom.get('#save-info');
    this.revertButton = dom.get('#revert');
    this.exportButton = dom.get('#export-json');
    this.importButton = dom.get('#import-json');
    this.importInput = dom.get('#import-input');
    this.setupPresetSelect();
  }

  setPageBackground(isLight) {
    this.pageWrap.toggleClass('light', isLight);
  }

  displaySaveTime() {
    const { lastSaved, lastSavedEl, saveInfo } = this;
    if (!lastSaved) {
      return;
    }
    saveInfo.rmClass('save-info--hidden');
    const newSaved = lastSavedEl.clone();
    newSaved.html(`Saved @ ${lastSaved}`);
    lastSavedEl.replace(newSaved);
    this.lastSavedEl = newSaved;
  }

  setupListeners() {
    const {
      lightThemeToggle,
      fauxToggleLabels,
      presetLoad,
      saveButton,
      revertButton,
      exportButton,
      importButton,
      importInput
    } = this;

    // this doesn't work if I add it as an event listener,
    // dunno why.
    window.onbeforeunload = () => this.hasUnsavedChanges();

    lightThemeToggle.on('click', () => {
      this.light = !this.light;
      this.setPageBackground(this.light);
    });

    fauxToggleLabels.forEach(label => {
      label.on('click', () => {
        lightThemeToggle.click();
      });
    });

    presetLoad.on('click', () => this.loadFromPreset());
    saveButton.on('click', () => this.saveTheme());
    revertButton.on('click', () => location.reload());
    exportButton.on('click', () => this.exportJSON());
    importButton.on('click', () => importInput.click());
    importInput.on('change', () => this.importJSON());

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

  exportJSON() {
    const { colorHandler, light } = this;

    const exportData = JSON.stringify({
      elements: colorHandler.getElementBasics(),
      light
    });

    dom
      .create('a', {
        download: 'ces_theme.json',
        href: `data:text/json;charset=utf-8,${encodeURIComponent(exportData)}`
      })
      .appendTo(dom.body)
      .click()
      .remove();
  }

  importJSON() {
    const setupFR = () => {
      const fr = new FileReader();
      fr.onload = () => {
        this.setTheme(JSON.parse(fr.result));
      };
      this.fr = fr;
      return fr;
    };

    const { importInput } = this;

    // can't assign via default assignment/destructuring due to bug in
    // current version of uglify used in uglify-webpack-plugin
    const fr = this.fr || setupFR();

    const file = importInput.prop('files')[0];
    fr.readAsText(file);
  }

  loadFromPreset() {
    const { presetSelect, presets } = this;
    const value = presetSelect.prop('value');
    this.setTheme(presets[value]);
  }

  setTheme({ elements, light }) {
    const { colorHandler } = this;
    this.light = light;
    this.handleLightStatus(light);
    colorHandler.setTo(elements);
    this.updateStyles();
  }

  saveTheme() {
    const { colorHandler, light } = this;
    const elements = colorHandler.getElementBasics();
    this.lastSaved = String(new Date()).substr(4, 20);
    this.displaySaveTime();

    const toSave = {
      elements,
      light,
      lastSaved: this.lastSaved
    };

    storage.set('custom-editor-theme', toSave);
    this.savedTheme = toSave;
  }

  hasUnsavedChanges() {
    const { colorHandler, light, savedTheme } = this;
    const elements = colorHandler.getElementBasics();
    const { elements: savedEls, light: savedLight } = savedTheme;

    const keysToCheck = ['color', 'master', 'italic', 'underline'];

    const elementsMatch = elements.every(element => {
      const { prettyName } = element;
      const ogElement = savedEls.find(el => el.prettyName === prettyName);
      return keysToCheck.every(key => {
        return ogElement[key] === element[key];
      });
    });

    return light === savedLight && elementsMatch ? null : true;
  }

  updateStyles() {
    const { colorHandler, styleEl } = this;
    styleEl.text(colorHandler.getElementCSS());
  }

  setupPresetSelect() {
    const { presetSelect, presets } = this;
    let html = '';
    for (const preset in presets) {
      html += dom.create('option').text(preset).outerHTML();
    }
    presetSelect.html(html);
  }
}

export default new ThemeGUI();
