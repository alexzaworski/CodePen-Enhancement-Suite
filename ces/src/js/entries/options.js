import CodeMirror from 'codemirror';

import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/markdown/markdown';

import dom from 'js/utils/dom';
import presets from 'js/utils/theme_utils/presets';
import ensureSyncStorage from 'js/utils/ensureSyncStorage';
import getActiveTheme from 'js/utils/theme_utils/getActiveTheme';

import themeGUI from 'js/pages/options/themeGUI';
import {html, css, js} from 'js/pages/options/codemirror-snippets';

const createCM = ({mode, selector, value}) => {
  return CodeMirror(dom.get(selector).node, {
    value,
    mode,
    lineNumbers: true,
    foldGutter: true,
    matchBrackets: true,
    matchTags: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineWrapping: true,
  });
};

const initCodeMirror = () => {
  createCM({
    mode: 'text/x-markdown',
    selector: '.box-html',
    value: html,
  });

  createCM({
    mode: 'text/x-scss',
    selector: '.box-css',
    value: css,
  });

  createCM({
    mode: 'text/javascript',
    selector: '.box-js',
    value: js,
  });
};

const initGUI = () => {
  getActiveTheme().then(theme => themeGUI.init(theme, presets));
};

ensureSyncStorage().then(() => {
  initCodeMirror();
  initGUI();
});
