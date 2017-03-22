import renderTemplate from 'js/utils/renderTemplate';
import dom from 'js/utils/dom';
import { localMessenger as messenger } from 'js/utils/messenger';

export default class ThemeEl {
  constructor (settings, template) {
    // Settings include:
    // - color
    // - description
    // - italic
    // - prettyName
    // - selector
    // - underline

    Object.assign(this, settings);
    this.template = template;
  }

  init (container, allEls) {
    this.setupEls(allEls);
    this.appendToDOM(container);
  }

  setupEls (allEls) {
    // color is only set to a default to avoid warnings when initially
    // rendering controls that have a master instead of a color set.
    const { color = '#000000', prettyName, template, description = '' } = this;

    const html = renderTemplate({ color, prettyName, description }, template);
    const el = dom.create('div', { class: 'themeEl' }).html(html);
    this.domEl = el;
    this.colorEl = el.get('.themeEl__color');
    this.selectEl = el.get('select');
    this.fauxEl = el.get('.themeEl__fauxColor');
    this.fontControls = el.get('.themeEl__font-controls');
    this.italicControl = el.get('.themeEl__font-control--italic');
    this.underlineControl = el.get('.themeEl__font-control--underline');
    this.advancedButton = el.get('.themeEl__settings');
    this.setupElSelect(allEls);
    this.addListeners();
    this.initFontControls();
  }

  initFontControls () {
    const {
      fontControls,
      prop = 'color'
    } = this;
    if (prop !== 'color') {
      fontControls.remove();
    } else {
      this.setFontControlClasses();
    }
  }

  setFontControlClasses () {
    const {
      italicControl,
      underlineControl,
      italic = false,
      underline = false
    } = this;
    italicControl.toggleClass('active', italic);
    underlineControl.toggleClass('active', underline);
  }

  addListeners () {
    const {
      selectEl,
      colorEl,
      advancedButton,
      italicControl,
      underlineControl
    } = this;

    colorEl.on('change', e => {
      selectEl.prop('value', 'None');
      this.unSync();
      this.updateColor(e.target.value);
    });

    selectEl.on('change', e => {
      const { value } = e.target;
      messenger.request('element-color', value).then(color => {
        color
          ? this.syncTo({ prettyName: value, color })
          : this.unSync();
      });
    });

    advancedButton.on('click', () => {
      advancedButton.toggleClass('active');
    });

    italicControl.on('click', () => {
      italicControl.toggleClass('active');
      this.italic = !this.italic;
      this.sendStyleUpdate();
    });

    underlineControl.on('click', () => {
      underlineControl.toggleClass('active');
      this.underline = !this.underline;
      this.sendStyleUpdate();
    });
  }

  sendStyleUpdate () {
    messenger.send('style-update');
  }

  setupElSelect (allEls) {
    const { selectEl } = this;
    let html = selectEl.html();

    allEls.forEach(el => {
      const { prettyName } = this;
      const { prettyName: elName } = el;
      if (elName !== prettyName) {
        html += dom
          .create('option')
          .text(elName)
          .outerHTML();
      }
    });

    selectEl.html(html);
  }

  syncTo (master) {
    const { selectEl } = this;
    const { prettyName, color } = master;
    this.unSync();
    selectEl.prop('value', prettyName);
    this.currentMaster = prettyName;
    this.updateColor(color);
    this.masterListener = messenger.on(prettyName, color => {
      this.updateColor(color);
    });
  }

  unSync () {
    const { masterListener, currentMaster } = this;
    messenger.off(currentMaster, masterListener);
    this.currentMaster = null;
    this.masterListener = null;
  }

  updateColor (color) {
    const { prettyName, fauxEl, colorEl } = this;

    this.color = color;
    messenger.send(prettyName, color);
    this.sendStyleUpdate();

    if (fauxEl && colorEl) {
      fauxEl.css('background', color);
      colorEl.prop('value', color);
    }
  }

  reset (newSettings) {
    const { selectEl } = this;
    const {
      color,
      master = null,
      underline,
      italic
    } = newSettings;

    this.unSync();
    selectEl.prop('value', 'None');
    this.master = master;
    this.updateColor(color);

    this.italic = italic;
    this.underline = underline;
    this.setFontControlClasses();
  }

  appendToDOM (parent) {
    parent.append(this.domEl);
  }
}
