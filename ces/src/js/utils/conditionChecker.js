import initData from './initData';
import dom from './dom';

class ConditionChecker {
  check(conditions) {
    let passes = true;
    const keys = Object.keys(conditions);
    for (const key of keys) {
      const testFn = this[key];
      if (typeof testFn !== 'function') {
        console.error(`Invalid condition: ${key}`);
        passes = false;
      } else {
        passes = testFn.call(this, conditions[key]);
      }
      if (!passes) {
        break;
      }
    }
    return passes;
  }

  isPage(pages) {
    const {__pageType: pageType} = initData;
    const pageRegex = new RegExp(`^${pageType}$`);
    return pages.some(page => page.match(pageRegex));
  }

  selectorExists(selector) {
    return dom.exists(selector, true);
  }

  isLoggedIn(status = true) {
    const isLoggedIn = initData.__user.id !== 1;
    return status === isLoggedIn;
  }

  isGridView(status = true) {
    const isGridView = initData.hasOwnProperty('__pages');
    return status === isGridView;
  }

  ownsItem(status = true) {
    const userID = initData.__user.id;
    const ownerID = initData.__item.user_id;
    const isOwner = this.isLoggedIn() && userID === ownerID;
    return status === isOwner;
  }
}

export default new ConditionChecker();
