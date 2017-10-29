import CESModule from './core/CESModule';
import dom from '../utils/dom';

export default class ResizePreviews extends CESModule {
  constructor() {
    super();
    this.conditions = {
      isPage: ['pen']
    };
  }

  go() {
    this.setupEls();
    this.dragState = {
      dragging: false,
      startX: 0,
      offsetX: 0,
      initialWidth: 0
    };

    this.waitForIframeLoad().then(() => {
      this.initResize();
    });
  }

  setupEls() {
    this.resizeBar = this.buildResizeBar();
    this.resizeWrap = this.buildResizeWrap();
    this.resultDiv = dom.get('#result_div');
    this.widthReadout = dom.get('#width-readout');
    this.dragCover = dom.get('#editor-drag-cover');
    this.resultIframe = dom.get('.result-iframe');
  }

  buildResizeWrap() {
    return dom.create('div', {
      class: 'result box',
      id: 'ces__resize'
    });
  }

  buildResizeBar() {
    return dom.create('div', {
      class: 'ces__resize-bar'
    });
  }

  // The Pen preview frame is actually totally replaced when the
  // source is determined, so we need to wait for that to happen
  // before we can make DOM changes.
  waitForIframeLoad() {
    return new Promise(resolve => {
      (function checkIfReady() {
        const iframe = dom.get('.result-iframe');
        if (iframe.attr('src')) {
          resolve();
        } else {
          window.requestAnimationFrame(checkIfReady);
        }
      })();
    });
  }

  initResize() {
    const { resultDiv, resizeBar, resizeWrap } = this;
    resultDiv.rmClass('result').wrap(resizeWrap).after(resizeBar);
    resizeBar.on('mousedown', e => {
      e.preventDefault();
      this.startDrag(e);
    });
  }

  updateDragState(dragState) {
    this.dragState = Object.assign(this.dragState, dragState);
  }

  startDrag(e) {
    const { widthReadout, resultDiv, dragCover } = this;

    widthReadout.addClass('visible');

    this.updateDragState({
      startX: e.pageX,
      dragging: true,
      initialWidth: resultDiv.width()
    });

    dragCover.css('display', 'block');
    const dragListenerOff = dom.onOff('mousemove', e => {
      this.drag(e);
    });

    const stopListenerOff = dom.onOff('mouseup', () => {
      stopListenerOff();
      dragListenerOff();
      this.stopDrag();
    });

    window.requestAnimationFrame(() => {
      this.animate();
    });
  }

  drag(e) {
    this.updateDragState({
      offsetX: this.dragState.startX - e.pageX
    });
  }

  stopDrag() {
    const { widthReadout, dragCover, dragState } = this;

    window.setTimeout(() => {
      if (!dragState.dragging) {
        widthReadout.rmClass('visible');
      }
    }, 1000);

    dragCover.css('display', 'none');

    this.updateDragState({
      dragging: false,
      offsetX: 0
    });
  }

  animate() {
    const { dragState, resultDiv, widthReadout } = this;

    if (dragState.dragging) {
      const newWidth = dragState.initialWidth - dragState.offsetX;
      resultDiv.width(this.clampResultDivWidth(newWidth));
      widthReadout.html(`${resultDiv.width()}px`);
      window.requestAnimationFrame(() => {
        this.animate();
      });
    }
  }

  clampResultDivWidth(width) {
    const { resizeBar } = this;
    const maxWidth = window.innerWidth - resizeBar.width();

    // http://stackoverflow.com/a/11409944
    width = Math.min(Math.max(width, 0), maxWidth);
    return `${width}px`;
  }
}
