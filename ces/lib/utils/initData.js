import dom from './dom';

let initData = dom.exists('#init-data');

// Checks if a prop is valid JSON,
// and if it's not parses it again
function needsParsing (prop) {
  if (typeof prop === 'string') {
    var char = prop.substring(0, 1);
    if (char === '[' || char === '{') {
      return true;
    }
  }
  return false;
}

if (initData) {
  initData = JSON.parse(initData.attr('value'));
  for (const key in initData) {
    const prop = initData[key];
    if (needsParsing(prop)) {
      initData[key] = JSON.parse(prop);
    }
  }
}

export default initData;
