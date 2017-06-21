import { getCSS } from 'js/utils/loadCSS';

const getColorFromMaster = (master, elements) => {
  const masterEl = elements.find(el => el.prettyName === master);
  return masterEl.color || getColorFromMaster(masterEl.master, elements);
};

export const buildElementCSS = elements => {
  let styles = '';
  elements.forEach(element => {
    const {
      selector,
      prop = 'color',
      color,
      master,
      italic,
      underline
    } = element;
    styles += `${selector}{`;
    styles += `${prop}:${color || getColorFromMaster(master, elements)};`;
    styles += italic ? 'font-style:italic;' : '';
    styles += underline ? 'text-decoration:underline;' : '';
    styles += '}';
  });
  return styles;
};

export default theme => {
  const { light, elements } = theme;
  let styles = buildElementCSS(elements);

  const basePromise = getCSS(
    'content/modules/custom_themes/base'
  ).then(base => {
    styles = base + styles;
  });

  const lightPromise = light
    ? getCSS('content/modules/custom_themes/light').then(light => {
      styles = light + styles;
    })
    : Promise.resolve();

  return new Promise(resolve => {
    Promise.all([basePromise, lightPromise]).then(() => resolve(styles));
  });
};
