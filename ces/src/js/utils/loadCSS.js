import dom from 'js/utils/dom';

export const appendCSS = css => {
  dom
    .create('style')
    .html(css)
    .appendTo(dom.get('head'));
};

export const prependCSS = css => {
  dom
    .create('style')
    .html(css)
    .prependTo(dom.get('head'));
};

export const getCSS = name => {
  const url = chrome.runtime.getURL(`/dist/css/${name}.css`);
  return fetch(url).then(response => response.text());
};

export default (name, opts = {}) => new Promise(resolve => {
  const { prepend = false } = opts;
  const attachFunc = prepend ? prependCSS : appendCSS;
  getCSS(name).then(attachFunc);
});
