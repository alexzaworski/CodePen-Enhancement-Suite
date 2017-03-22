import CESModule from './core/CESModule';
import initData from '../utils/initData';
import inPageContext from '../utils/inPageContext';
import dom, { Doc } from '../utils/dom';
import conditionChecker from '../utils/conditionChecker';
import escapeHTML from 'escape-html';
import getPartial from '../utils/getPartial';
import renderTemplate from '../utils/renderTemplate';
import cpAjax from '../utils/cpAjax';

export default class ProfilePreview extends CESModule {
  constructor () {
    super();
    this.conditions = {
      isPage: [
        'home',
        'pen',
        'project',
        'posts',
        'collection',
        'details',
        'explore-pens',
        'explore-posts',
        'explore-collections',
        'explore-projects',
        'full',
        'activity'
      ]
    };
  }

  go () {
    this.selector = this.getSelector(initData.__pageType);
    this.updateProfileLinks();
    if (conditionChecker.isGridView()) {
      this.subscribeToGrid();
    }
  }

  getSelector (pageType) {
    const selectors = {
      default: '.user a',
      pen: '.pen-owner-link, .comment-username, .pen-owner-name',
      full: '.pen-owner-link',
      project: '.pen-owner-link',
      // nth-of-type makes sure the link to the user's blog isn't also included
      // (they have the same class applied)
      posts: '.author-link:nth-of-type(2), .comment-username',

      details: '.comment-username, .pen-owner-name, .user-name.module',
      collection: '.username, .author-link',

      // needs to be :first-of-type so it doesn't pick up the link to the
      // pen/post/whatever.
      activity: '.activity-name:first-of-type'
    };
    return selectors[pageType] || selectors.default;
  }

  subscribeToGrid () {
    // Add a listener to the window object since we can actually interact with
    // that from a content script
    dom.window.on('grid-changed', () => {
      this.updateProfileLinks();
    });

    // Then within the context of the page, listen for CodePen's internal Hub
    // events and replay them as custom events
    inPageContext(() => {
      Hub.sub('grid-changed', function () {
        window.dispatchEvent(new CustomEvent('grid-changed'));
      });
    });
  }

  updateProfileLinks () {
    const profileLinks = dom.getAll(this.selector);
    const currentPreviews = dom.getAll('.ces__profile-preview');
    currentPreviews.forEach(preview => {
      preview.remove();
    });
    profileLinks.forEach(link => {
      link.one('mouseover', () => {
        const preview = new Preview(link);
        preview.startDisplayTimer();
      });
    });
  }
}

class Preview {
  constructor (profileLink) {
    this.profileLink = profileLink;

    const href = profileLink.attr('href');
    const origin = location.origin;
    this.profileURL = href.includes(origin)
      ? href
      : origin + href;

    this.previewEl = dom.create('div', { class: 'ces__profile-preview' });

    fetch(this.profileURL, { credentials: 'include' })
      .then(response => response.text())
      .then(profilePage => this.parseProfilePage(profilePage))
      .then(profile => this.mapPensToProfile(profile))
      .then(profile => this.mapProfileToTemplate(profile, this.previewEl))
      .then(() => {
        dom.body.append(this.previewEl);
        this.addListeners();
      });
  }

  parseProfilePage (profilePage) {
    const doc = new Doc(new DOMParser().parseFromString(profilePage, 'text/html'));

    const profile = {
      name: doc.get('#profile-name-header').text().trim(),
      username: doc.get('#profile-username').text().trim().substring(1), // removes '@'
      avatar: doc.get('#profile-image').attr('src'),
      followers: doc.get('#followers-count').text(),
      following: doc.get('#following-count').text(),
      isFollowing: !doc.exists('#follow-this-user:not([style="display: none;"])', true)
    };

    profile.isPro = !!profile.name.match(/PRO$/);
    if (profile.isPro) {
      profile.name = profile.name.replace(/PRO$/, '').trim();
    }

    return profile;
  }

  mapPensToProfile (profile) {
    return new Promise((resolve) => {
      fetch(`${this.profileURL}/popular/feed`)
        .then(response => response.text())
        .then(pens => this.parsePens(pens, profile.username))
        .then(pens => {
          profile.pens = pens;
          resolve(profile);
        });
    });
  }

  parsePens (penPage, username) {
    const xml = new Doc(new DOMParser().parseFromString(penPage, 'text/xml'));
    const pens = [];
    const items = xml.getAll('item');
    for (const item of items) {
      const pen = {
        title: item.get('title').html(),
        url: item.get('link').html()
      };

      pen.slug = pen.url.substr(pen.url.lastIndexOf('/') + 1);
      pen.iframe = dom.create('iframe', {
        src: `${location.protocol}//s.codepen.io/${username}/fullcpgrid/${pen.slug}`,
        'data-title': pen.title,
        sandbox: initData.__CPDATA.iframe_sandbox,
        scrolling: 'no',
        frameborder: '0',
        allowtransparency: 'true',
        class: 'ces__iframe'
      });

      pens.push(pen);
      if (pens.length >= 3) {
        break;
      }
    }
    return pens;
  }

  mapProfileToTemplate (profile, previewEl) {
    return new Promise(resolve => {
      getPartial('templates/profile-popover')
        .then(templateHTML => this.fillTemplate(profile, previewEl, templateHTML))
        .then(mergedTemplate => resolve(mergedTemplate));
    });
  }

  fillTemplate (profile, previewEl, templateHTML) {
    const { profileURL } = this;

    const {
      name,
      isPro,
      username,
      avatar,
      followers,
      following,
      isFollowing,
      pens
    } = profile;

    const pro = isPro
      ? dom
        .create('span', { class: 'ces__pro-badge badge badge-pro' })
        .html('PRO')
        .outerHTML()
      : '';

    const templateData = {
      pro,
      username,
      avatar,
      followers,
      following,
      profileURL,
      name: escapeHTML(name),
      followersURL: `${profileURL}/followers`,
      followingURL: `${profileURL}/following`
    };

    templateHTML = renderTemplate(templateData, templateHTML);

    previewEl.html(templateHTML);

    this.addPensToPreview(previewEl, pens);
    this.handleFollowButtons(previewEl, username, isFollowing);
  }

  addPensToPreview (preview, pens) {
    const pensWrapper = preview.get('.ces__profile__pens');

    pens.forEach(pen => {
      const { iframe, url, title } = pen;
      const wrapper = dom.create('div', { class: 'ces__pen' });
      const iframeWrap = dom
        .create('div', { class: 'ces__iframe-wrap' })
        .append(iframe);
      const titleWrap = dom
        .create('div', { class: 'ces__pen__title' })
        .html(escapeHTML(title));
      const penLink = dom.create('a', {
        class: 'ces__pen__link',
        href: url
      });

      wrapper
        .append(penLink)
        .append(iframeWrap)
        .append(titleWrap)
        .appendTo(pensWrapper);
    });
  }

  handleFollowButtons (preview, username, isFollowing) {
    const buttons = preview.get('.ces__profile__follow-buttons');

    if (conditionChecker.isLoggedIn(false) || initData.__user.username === username) {
      buttons.remove();
      return;
    }

    const followBaseURL = `follow/user/${username}`;
    const followers = preview.get('.ces__profile__followers-stat');
    const followButton = preview.get('.ces__follow-user');
    const unfollowButton = preview.get('.ces__unfollow-user');

    let state = isFollowing;
    let numFollowers = parseInt(followers.html());

    const setButtonClass = () => {
      buttons.toggleClass('ces__isFollowing', state);
    };
    setButtonClass();

    buttons.on('click', () => {
      state = !state;
      setButtonClass();
    });

    followButton.on('click', () => {
      numFollowers++;
      cpAjax.post(`${followBaseURL}/follow`);
      followers.html(numFollowers);
    });

    unfollowButton.on('click', () => {
      numFollowers--;
      cpAjax.post(`${followBaseURL}/unfollow`);
      followers.html(numFollowers);
    });
  }

  startDisplayTimer () {
    this.displayTimer = setTimeout(() => {
      this.display();
    }, 1000);
  }

  stopDisplayTimer () {
    clearTimeout(this.displayTimer);
  }

  display () {
    // Checking :hover is an attempt to fix a long-standing bug in
    // which profile previews would appear seamingly at random or in
    // the wrong spot. Obviously this is a bandage fix and doesn't
    // address the root cause which I'm assuming is related to the way
    // timeouts are handled.
    //
    // This is a holdover from before the es6 rewrite so it's possible
    // it's not necessary anymore but whatevs
    if (this.profileLink.matches(':hover')) {
      this.previewEl.addClass('active');
      this.position();
    }
  }

  hide () {
    this.previewEl.rmClass('active');
  }

  position () {
    const { profileLink, previewEl } = this;
    const { left, top } = profileLink.rect();
    const height = profileLink.height();
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    previewEl.css({
      left: `${left + scrollX}px`,
      top: `${top + scrollY + height}px`
    });
  }

  addListeners () {
    const { profileLink, previewEl } = this;

    profileLink.on('mouseenter', () => {
      this.startDisplayTimer();
    });

    // We need to wait until neither the profile link *nor* the
    // preview is hovered to  hide everything.
    //
    // By adding a 0ms timeout we prevent the preview from instantly
    // collapsing when the user moves their cursor from the link to
    // the preview.
    let timer = -1;
    [profileLink, previewEl].forEach(el => {
      el.on('mouseenter', () => {
        clearTimeout(timer);
      }).on('mouseleave', () => {
        timer = setTimeout(() => {
          this.stopDisplayTimer();
          this.hide();
        }, 0);
      });
    });
  }
}
