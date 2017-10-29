import dom from './dom';

let initData = dom.exists('#init-data');

// Checks if a prop is parsed JSON, and if it's not parses it again
//
// (this is weird but it's literally how CodePen handles it as well sooo...)
function needsParsing(prop) {
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

  // stupid hack to add a page type to Project pages, since that's not
  // in there by default.
  if (initData.__pageType === undefined) {
    if (initData.__INITIAL_STATE__ !== undefined) {
      initData.__pageType = 'project';
    }
  }
}

export default initData;
