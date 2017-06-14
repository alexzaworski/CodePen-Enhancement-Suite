import dom from 'js/utils/dom';

export const appendCSS = css => {
  dom.create('style').html(css).appendTo(dom.get('head'));
};

export const getCSS = name => {
  const url = chrome.runtime.getURL(`/dist/css/${name}.css`);
  return fetch(url).then(response => response.text());
};

export default name =>
  new Promise(resolve => {
    getCSS(name).then(appendCSS).then(resolve);
  });
