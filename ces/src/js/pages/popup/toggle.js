import messenger from 'js/utils/messenger';
import storage from 'js/utils/storage';

/*
 * Important thing!
 * ===
 * There's an active bug with the way toggles are initialized.
 * Currently they INCORRECTLY assume that the content scripts will have
 * been loaded and parsed before the user opens the page action. That
 * is _usually_ the case but not _always_.
 *
 * In order to mitigate that there is a retry interval on
 * `messenger.request` that will cause the request to fire again if it
 * isn't fulfilled quickly enough. Usually that's enough to sidestep
 * any bugs but if someone manages to load the page and then both open
 * the page action _and_ click on one of the toggles before the request
 * is fulfilled things can break.
 *
 * That's a dumb fix but it was easy to implement and I just wanna get
 * things shipped. The correct way would be to set up some listeners
 * that can confirm that both the page action and toggle have both loaded
 * before attempting to do anything.
 */

export default ({ el, initialStateMessage, onToggleMessage, toggleKey }) => {
  if (toggleKey) {
    storage.get(toggleKey, false).then(isChecked => {
      addStorageListeners(el, toggleKey);
      setInitialState(el, isChecked);
    });
  }

  if (initialStateMessage) {
    el.attr('disabled', true);
    messenger.request(initialStateMessage).then(isChecked => {
      addMessengerListeners(el, onToggleMessage);
      setInitialState(el, isChecked);
    });
  }
};

const setInitialState = (el, state) => {
  el.attr('disabled', null);
  el.prop('checked', state);
};

const addMessengerListeners = (el, onToggleMessage) => {
  el.on('click', () => {
    messenger.sendToTab(onToggleMessage, el.prop('checked'));
  });
};

const addStorageListeners = (el, toggleKey) => {
  el.on('click', () => {
    storage.get(toggleKey, false).then(value => {
      const newValue = !value;
      storage.set(toggleKey, newValue).then(() => {
        messenger.sendToTab(toggleKey, newValue);
      });
    });
  });
};
