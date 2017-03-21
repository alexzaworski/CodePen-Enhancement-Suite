import messenger from '../../utils/messenger';

export default ({
  el,
  initMessage,
  sendMessage,
  disable = false
}) => {
  if (disable) { el.attr('disabled', true); }
  addListeners(el, sendMessage);
  messenger.on(initMessage, isChecked => {
    setInitialState(el, isChecked);
  });
};

const setInitialState = (el, state) => {
  el.attr('disabled', null);
  el.node.checked = state;
};

const addListeners = (el, sendMessage) => {
  el.on('click', () => {
    messenger.sendToTab(sendMessage, el.node.checked);
  });
};
