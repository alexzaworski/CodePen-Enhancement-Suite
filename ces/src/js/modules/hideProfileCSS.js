import CESModule from './core/CESModule';
import dom from '../utils/dom';
import messenger from '../utils/messenger';
import storage from '../utils/storage';
import initData from '../utils/initData';

export default class HideProfileCSS extends CESModule {
  constructor () {
    super();
    this.conditions = {
      isPage: ['profile']
    };
  }

  go () {
    storage.get('disabledProfiles')
    .then(profiles => {
      return new Set(profiles);
    }, () => {
      return new Set();
    }).then((profiles) => {
      this.initWithProfiles(profiles);
    });
  }

  initWithProfiles (profiles) {
    this.disabledProfiles = profiles;
    this.profile = initData.__profiled.username;
    this.style = dom.get('style');
    this.head = dom.get('head');
    this.addRuntimeListeners();
  }

  addRuntimeListeners () {
    messenger.on('disable-profile-css', (isDisabled) => {
      if (isDisabled) {
        this.removeStyle();
        this.addToDisabledProfiles();
      } else {
        this.appendStyle();
        this.removeFromDisabledProfiles();
      }
    });
  }

  removeFromDisabledProfiles () {
    const { profile, disabledProfiles } = this;
    disabledProfiles.delete(profile);
    this.saveProfilesToStorage(disabledProfiles);
  }

  addToDisabledProfiles () {
    const { profile, disabledProfiles } = this;
    disabledProfiles.add(profile);
    this.saveProfilesToStorage(disabledProfiles);
  }

  saveProfilesToStorage () {
    const { disabledProfiles } = this;
    storage.set('disabledProfiles', [...disabledProfiles]);
  }

  removeStyle () {
    this.style.remove();
  }

  appendStyle () {
    this.head.append(this.style);
  }

}
