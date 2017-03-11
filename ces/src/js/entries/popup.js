import '../../css/popup.scss';
import dom from '../utils/dom';
import messenger from '../utils/messenger';
import toggle from '../pages/popup/toggle';

messenger.send('popup-toggle-ready');

toggle({
  el: dom.get('#disable-css'),
  initMessage: 'profile-css-data',
  sendMessage: 'disable-profile-css',
  disable: true
});
