import dom from './dom';

// Appends a function to the DOM, giving it access to the page's
// window object rather than using the sandboxed context of the
// content script.

export default (fn, ...args) => {
  args = args.map(arg => JSON.stringify(arg));
  dom.create('script').html(`(${fn})(${args})`).appendTo(dom.body).remove();
};
