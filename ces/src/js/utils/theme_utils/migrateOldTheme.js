import storage from '../storage';

export default (elements, lastSaved, isLightTheme) => {
  elements = elements.map(element => {
    const {
      color,
      italic,
      master,
      prettyName,
      underline
    } = element;

    const newEl = {
      prettyName,
      underline,
      italic
    };

    // legacy themes used IDs to assign master values
    const id = prettyNameToId(prettyName);
    // they also assigned a master no matter what (defaulting to
    // self), so only masters that don't match IDs are relevant
    if (id !== master) {
      newEl.master = idToName(id, elements);
    } else {
      newEl.color = color;
    }
    return newEl;
  });

  const theme = {
    elements,
    light: isLightTheme,
    lastSaved: lastSaved
  };

  return new Promise(resolve => {
    storage
      .set('custom-editor-theme', theme)
      .then(() => resolve(theme));
  });
};

const idToName = (id, elements) => {
  for (const element of elements) {
    const { prettyName } = element;
    if (prettyNameToId(prettyName) === id) {
      return prettyName;
    }
  }
};

const prettyNameToId = name => name.toLowerCase().replace(/\s/g, '_');
