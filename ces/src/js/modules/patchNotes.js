import CESModule from 'js/modules/core/CESModule';
import storage from 'js/utils/storage';
import dom from 'js/utils/dom';
import getPartial from 'js/utils/getPartial';

// Not actually in sync with the most up-to-date patch,
// only incremented when the current version should display
// patch notes (major releases, significant bug fixes)
const currentPatch = '1.0.0';
const patchNoteKey = `${currentPatch}-patch-notes`;

// Note: never ever change this to a different name, you'll bypass the setting
// and serve patch notes to people who disabled them which is super obnoxious
const disableKey = 'disable-patch-notes';

const hasLoadedKey = 'has-loaded-before';

export default class PatchNotes extends CESModule {
  constructor() {
    super();
  }

  go() {
    Promise.all([
      this.checkIfNotesDisabled(),
      this.checkIfHasLoaded(),
      this.checkIfNotesSeen()
    ]).then(([isDisabled, hasLoaded, isSeen]) => {
      if (!hasLoaded) {
        storage.set({
          [hasLoadedKey]: true,
          [patchNoteKey]: true
        });
      } else if (!isDisabled && !isSeen) {
        this.setupModal().then(() => this.setupButtons());
      }
    });
  }

  checkIfNotesDisabled() {
    return new Promise(resolve => {
      storage.get(disableKey, false).then(resolve);
    });
  }

  checkIfNotesSeen() {
    return new Promise(resolve => {
      storage.get(patchNoteKey, false).then(resolve);
    });
  }

  checkIfHasLoaded() {
    return new Promise(resolve => {
      storage.get(hasLoadedKey, false).then(resolve);
    });
  }

  setupModal() {
    return new Promise(resolve => {
      getPartial('patch-notes').then(html => {
        this.modal = dom.create('div').html(html).appendTo(dom.body);
        resolve();
      });
    });
  }

  setupButtons() {
    dom.get('#ces__hide-forever').on('click', () => {
      storage.set(disableKey, true);
      this.removeModal();
    });

    dom.get('#ces__dismiss').on('click', () => {
      storage.set(patchNoteKey, true);
      this.removeModal();
    });
  }

  removeModal() {
    this.modal.remove();
  }
}
