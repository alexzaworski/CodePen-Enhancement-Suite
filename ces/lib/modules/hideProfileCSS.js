import CESModule from '../core/CESModule';
import dom from '../utils/dom';

export default class HideProfileCSS extends CESModule {
  constructor () {
    super();
    this.conditions = {
      isPage: ['profile']
    };
  }

  go () {
    this.style = dom.get('style');
    this.head = dom.get('head');
    this.addWindowListeners();
  }

  addWindowListeners() {
    dom.window.on('disable-css', this.removeStyle.bind(this));
    dom.window.on('enable-css', this.appendStyle.bind(this));
  }

  removeStyle() {
    this.style.remove();
  }

  appendStyle() {
    this.head.append(this.style);
  }

}
