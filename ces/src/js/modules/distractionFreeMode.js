import CESModule from './core/CESModule';
import dom from '../utils/dom';
import inPageContext from '../utils/inPageContext';
import storage from '../utils/storage';

export default class DistractionFreeMode extends CESModule {
  constructor() {
    super();
    this.conditions = {
      isPage: ['pen'],
    };
  }

  go() {
    storage
      .get('distraction-free')
      .then(isDistractionFree => this.init(isDistractionFree))
      .catch(() => this.init(false));
  }

  init(isDistractionFree) {
    const toggleWrapper = this.buildToggleWrapper();
    const label = this.buildLabel();
    const input = this.buildInput(isDistractionFree);
    toggleWrapper.append(input).append(label);
    input.on('change', () => {
      this.handleInputChange(input);
    });

    dom
      .await('.editor-layout-buttons')
      .then(buttons => buttons.before(toggleWrapper));

    if (isDistractionFree) {
      this.setDistractionFreeMode(true);
    }
  }

  buildToggleWrapper() {
    return dom.create('div', {
      class: 'ces__fancy-checkbox__wrapper ces__clearfix',
    });
  }

  buildInput(isChecked) {
    return dom
      .create('input', {
        type: 'checkbox',
        class: 'ces__fancy-checkbox ces__fancy-checkbox--light',
        id: 'distraction-free-mode',
      })
      .attr('checked', isChecked ? 'checked' : null);
  }

  buildLabel() {
    return dom
      .create('label', {
        for: 'distraction-free-mode',
      })
      .text('Distraction Free Mode');
  }

  handleInputChange(input) {
    const checked = input.prop('checked');
    this.setDistractionFreeMode(checked);
  }

  setDistractionFreeMode(state) {
    dom.body.toggleClass('distraction-free-mode', state);
    storage.set('distraction-free', state);
    if (state) {
      this.forceEditorsToAdjust();
    }
  }

  forceEditorsToAdjust() {
    inPageContext(() => {
      CP.codeEditorResizeController.onWindowResize();
    });
  }
}
