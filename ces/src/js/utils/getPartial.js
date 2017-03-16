export default (name) => new Promise(resolve => {
  const url = chrome.runtime.getURL(`/html_partials/${name}.html`);
  fetch(url)
    .then(response => response.text())
    .then(resolve);
});
