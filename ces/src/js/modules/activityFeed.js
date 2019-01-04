import CESModule from './core/CESModule';
import dom, { Doc } from '../utils/dom';
import storage from '../utils/storage';
import initData from '../utils/initData';
import cpAjax from '../utils/cpAjax';

const bell = `
<svg class="ces__activity-bell" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 47" height="46" width="47">
  <defs>
    <clipPath id="clapper-mask"><path d="M3 39v8h40v-8s-4 2.2-20 2.2S3 39 3 39z"/></clipPath>
  </defs>
  <path class="ces__activity-bell-dome" d="M35.8 16.8c0-5.7-3.7-10.5-8.9-12.2.1-.2.1-.4.1-.6 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 .2 0 .4.1.6-5.2 1.7-8.9 6.5-8.9 12.2C10.2 30 3 30 3 36c0 1 0 3 20 3s20-2 20-3c0-6-7.2-6-7.2-19.2z"/>
  <g clip-path="url(#clapper-mask)"><g class="ces__activity-bell-clapper">
    <circle cx="23" cy="41" r="6"/>
  </g>
</svg>
`;

const drawerItemSelector = '.your-links-menu .drawer-button';

export default class ActivityFeed extends CESModule {
  constructor() {
    super();
    this.storageKey = this.setupStorageKey('activity-feed-1.0.0');
    this.conditions = {
      selectorExists: drawerItemSelector
    };
  }

  go() {
    cpAjax
      .post('/graphql', {
        type: 'json',
        body: [
          {
            operationName: null,
            variables: {},
            query: '{recentActivities}'
          }
        ]
      })
      .then(r => r.json())
      .then(([{ data: { recentActivities } }]) => {
        return this.parseActivity(recentActivities);
      })
      .then(activity => {
        storage
          .get(this.storageKey)
          .then(oldActivity => this.handleActivity(activity, oldActivity))
          .catch(() => this.updateStorage(activity));
      });
  }

  handleActivity(newActivity, oldActivity) {
    const newJSON = JSON.stringify(newActivity);
    const oldJSON = JSON.stringify(oldActivity);
    const isNewActivity = newJSON !== oldJSON;
    if (isNewActivity) {
      this.handleNewActivity(newActivity);
    }
  }

  handleNewActivity(activity) {
    // ... this can't be the easiest way to do this right?
    const parsedStr = new DOMParser().parseFromString(bell, 'text/xml');
    const bellEl = new Doc(parsedStr).get('svg');

    const activityButton = dom
      .getAll(drawerItemSelector)
      .find(n => n.text() === 'Activity');

    if (!activityButton) return;

    activityButton.append(bellEl);

    activityButton.one('click', () => {
      bellEl.remove();
      this.updateStorage(activity);
    });
  }

  updateStorage(activity) {
    return storage.set(this.storageKey, activity);
  }

  setupStorageKey(base) {
    const { __user: user } = initData;
    const { username, current_team_id } = user;
    return `${base}-${username}-${current_team_id}`; // eslint-disable-line camelcase
  }

  parseActivity(activityResponse) {
    const activityHTML = dom.create('div').html(activityResponse);
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
