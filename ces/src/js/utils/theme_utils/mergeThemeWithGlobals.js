import elementGlobals from './elementGlobals';

export default (theme) => {
  const { elements } = theme;
  const mergedElements = [];
  for (const elKey in elementGlobals) {
    const { globals, fallback } = elementGlobals[elKey];
    const themeElement = elements.find(el => el.prettyName === elKey);
    if (!themeElement) {
      mergedElements.push(Object.assign(fallback, globals, { prettyName: elKey }));
    } else {
      mergedElements.push(Object.assign(themeElement, globals));
    }
  }
  theme.elements = mergedElements;
  return theme;
};
