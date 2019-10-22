import getPartial from 'js/utils/getPartial';
import ThemeEl from 'js/pages/options/themeEl';
import {localMessenger as messenger} from 'js/utils/messenger';
import {buildElementCSS} from 'js/utils/theme_utils/buildCSS';

export default class ColorHandler {
  constructor(elements, wrapper) {
    this.wrapper = wrapper;
    getPartial('templates/theme-element').then(template => {
      this.themeEls = this.createthemeEls(elements, template);
      this.setupListeners();
      this.initControls();
      this.bindMasters();
    });
  }

  createthemeEls(elements, template) {
    let controls = [];
    elements.forEach(element => {
      controls.push(new ThemeEl(element, template));
    });
    return controls;
  }

  bindMasters() {
    const {themeEls} = this;
    themeEls.forEach(control => {
      const {master} = control;
      if (master) {
        control.syncTo(this.getByName(master));
      }
    });
  }

  initControls() {
    const {themeEls, wrapper} = this;
    this.themeEls.forEach(control => {
      control.init(wrapper, themeEls);
    });
  }

  setupListeners() {
    messenger.onRequest('element-color', name => {
      const el = this.getByName(name);
      return el ? el.color : false;
    });
  }

  getByName(name) {
    const {themeEls} = this;
    return themeEls.find(el => el.prettyName === name);
  }

  getElementBasics() {
    // Things like prop/selector/etc all come from the global element
    // settings which means we don't need to save them to storage.
    return this.themeEls.map(element => {
      const {prettyName, color, master, underline, italic} = element;

      const basics = {prettyName};

      if (italic) {
        basics.italic = italic;
      }

      if (underline) {
        basics.underline = underline;
      }

      if (master) {
        basics.master = master;
      } else {
        basics.color = color;
      }

      return basics;
    });
  }

  getElementCSS() {
    return buildElementCSS(this.themeEls);
  }

  setTo(elements) {
    elements.forEach(element => {
      const {prettyName} = element;
      this.getByName(prettyName).reset(element);
    });
    this.bindMasters();
  }
}
