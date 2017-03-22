import CESModule from './core/CESModule';
import { Doc } from '../utils/dom';
import inPageContext from '../utils/inPageContext';
import initData from '../utils/initData';

export default class RecentPensTypeahead extends CESModule {
  constructor () {
    super();
    this.conditions = {
      isPage: ['pen']
    };
  }

  go () {
    const feedURL = this.buildFeedURL();
    fetch(feedURL)
      .then(response => response.text())
      .then(data => this.parsePenData(data))
      .then(penObjects => this.setUpjQueryAjax(penObjects));
  }

  buildFeedURL () {
    const protocol = location.protocol;
    const username = initData.__user.username;
    return `${protocol}//codepen.io/${username}/public/feed`;
  }

  parsePenData (data) {
    const xml = new Doc(new DOMParser().parseFromString(data, 'text/xml'));
    const items = xml.getAll('item');
    const pens = items.map(item => this.penObjFromNode(item));
    return pens;
  }

  penObjFromNode (item) {
    const name = item
      .get('title')
      .html()
      .toLowerCase()
      .replace(/\s/g, '-');
    const value = item.get('link').html();
    const tokens = ['::']; // adds a cute 'lil shortcut to filter out Pens
    return {
      name,
      value,
      tokens
    };
  }

  // Hooks into $.ajaxSend within the full context of the page,
  // allowing us to modify the response of requests for typeahead data
  setUpjQueryAjax (pens) {
    inPageContext((pens) => {
      const dataFunc = (data) => {
        data = JSON.parse(data);
        return JSON.stringify([...data, ...pens]);
      };

      $(document).ajaxSend((event, jqxhr, settings) => {
        if (settings.url.match(/(cdncss_data|cdnjs_data)/) && pens) {
          settings.dataFilter = dataFunc;
        }
      });
    }, pens);
  }
}
