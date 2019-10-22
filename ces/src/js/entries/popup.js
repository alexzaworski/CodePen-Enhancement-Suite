import dom from '../utils/dom';
import messenger from '../utils/messenger';
import toggle from '../pages/popup/toggle';

messenger.sendToTab('popup-toggle-ready');

toggle({
  el: dom.get('#disable-css'),
  initialStateMessage: 'profile-css-state',
  onToggleMessage: 'disable-profile-css',
});

toggle({
  el: dom.get('#enable-theme'),
  toggleKey: 'enable-custom-theme',
});

dom.get('#options-link').on('click', e => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});
