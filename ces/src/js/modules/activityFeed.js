import CESModule from './core/CESModule';
import dom from '../utils/dom';
import storage from '../utils/storage';
import initData from '../utils/initData';

export default class ActivityFeed extends CESModule {
  constructor () {
    super();
    this.storageKey = this.setupStorageKey('activity-feed-1.0.0');
    this.conditions = {
      selectorExists: '.header-activity-button'
    };
  }

  go () {
    fetch('/activity/header/', { credentials: 'include' })
    .then(response => response.text())
    .then(activity => this.parseActivity(activity))
    .then(activity => {
      storage.get(this.storageKey)
      .then(oldActivity => this.handleActivity(activity, oldActivity))
      .catch(() => this.updateStorage(activity));
    });
  }

  handleActivity (newActivity, oldActivity) {
    const newJSON = JSON.stringify(newActivity);
    const oldJSON = JSON.stringify(oldActivity);
    const isNewActivity = newJSON !== oldJSON;
    if (isNewActivity) {
      this.handleNewActivity(newActivity);
    }
  }

  handleNewActivity (activity) {
    const button = dom.get('.header-activity-button');
    button
      .addClass('ces__new-notification')
      .one('click', () => {
        button.rmClass('ces__new-notification');
        this.updateStorage(activity);
      });
  }

  updateStorage (activity) {
    return storage.set(this.storageKey, activity);
  }

  setupStorageKey (base) {
    const { __user: user } = initData;
    const { username, current_team_id } = user;
    return `${base}-${username}-${current_team_id}`; // eslint-disable-line camelcase
  }

  parseActivity (activityResponse) {
    const json = JSON.parse(activityResponse);
    const activityHTML = dom.create('div').html(json.html);
    const activity = [];
    activityHTML.getAll('.activity-list .activity').forEach(item => {
      const name = item.get('.activity-name').html().replace(/\s/g, '');
      const action = item.get('.activity-action').html().replace(/\s/g, '');
      const thing = item.get('.activity-thing').html().replace(/\s/g, '');
      activity.push(`${name}-${action}-${thing}`);
    });
    return activity;
  }
}
