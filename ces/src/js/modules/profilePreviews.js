import CESModule from './core/CESModule';
import initData from '../utils/initData';
import inPageContext from '../utils/inPageContext';
import dom, { Doc } from '../utils/dom';
import conditionChecker from '../utils/conditionChecker';
import escapeHTML from 'escape-html';
import getPartial from '../utils/getPartial';
import renderTemplate from '../utils/renderTemplate';

const HANDLED_DATA_ATTR = 'ces-handled-preview';

export default class ProfilePreview extends CESModule {
  constructor() {
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

  go() {
    this.selector = this.getSelector(initData.__pageType);
    this.setBodyListener();
    if (conditionChecker.isGridView()) {
      this.subscribeToGrid();
    }
  }

  getSelector(pageType) {
    const selectors = {
      default: '.user a span',
      pen: '.comment-username, .pen-owner-name, .item-owner-link',
      full: '.item-owner-link',
      project: '.item-owner-link',
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

  subscribeToGrid() {
    // Add a listener to the window object since we can actually interact with
    // that from a content script
    dom.window.on('grid-changed', () => {
      this.clearPreviews();
    });

    // Then within the context of the page, listen for CodePen's internal Hub
    // events and replay them as custom events
    inPageContext(() => {
      Hub.sub('grid-changed', function() {
        window.dispatchEvent(new CustomEvent('grid-changed'));
      });
    });
  }

  clearPreviews() {
    dom.getAll(`[${HANDLED_DATA_ATTR}]`).forEach(el => {
      el.attr(HANDLED_DATA_ATTR, 'false');
    });

    dom.getAll('.ces__profile-preview').forEach(preview => {
      preview.remove();
    });
  }

  setBodyListener() {
    dom.body.on('mouseover', event => {
      const el = dom.fromNative(event.target);

      if (!el.matches(this.selector)) return;
      if (el.attr(HANDLED_DATA_ATTR) === 'true') return;

      el.attr(HANDLED_DATA_ATTR, 'true');
      new Preview(el);
    });
  }
}

class Preview {
  constructor(profileLink) {
    this.profileLink = profileLink;

    // due to specific quirks of Codepen's markup we can't
    // delegate a listner directly on the <a/> inside some
    // blocks of markup, and get stuck hitting a span instead.
    //
    // to counteract that we're allowing spans to match
    // as links sometimes so we'll need to handle that case here.
    const href = profileLink.attr('href') || profileLink.parent().attr('href');

    const origin = location.origin;
    this.profileURL = href.includes(origin) ? href : origin + href;

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

    this.startDisplayTimer();
  }

  parseProfilePage(profilePage) {
    const doc = new Doc(
      new DOMParser().parseFromString(profilePage, 'text/html')
    );

    const profile = {
      name: doc.get('#profile-name-header').text().trim(),
      username: doc.get('#profile-username').text().trim().substring(1), // removes '@'
      avatar: doc.get('#profile-image').attr('src'),
      followers: doc.get('#followers-count').text(),
      following: doc.get('#following-count').text()
    };

    profile.isPro = !!profile.name.match(/PRO$/);
    if (profile.isPro) {
      profile.name = profile.name.replace(/PRO$/, '').trim();
    }

    return profile;
  }

  mapPensToProfile(profile) {
    return new Promise(resolve => {
      fetch(`${this.profileURL}/popular/feed`)
        .then(response => response.text())
        .then(pens => this.parsePens(pens, profile.username))
        .then(pens => {
          profile.pens = pens;
          resolve(profile);
        });
    });
  }

  parsePens(penPage, username) {
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

  mapProfileToTemplate(profile, previewEl) {
    return new Promise(resolve => {
      getPartial('templates/profile-popover')
        .then(templateHTML =>
          this.fillTemplate(profile, previewEl, templateHTML)
        )
        .then(mergedTemplate => resolve(mergedTemplate));
    });
  }

  fillTemplate(profile, previewEl, templateHTML) {
    const { profileURL } = this;

    const {
      name,
      isPro,
      username,
      avatar,
      followers,
      following,
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
  }

  addPensToPreview(preview, pens) {
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

  startDisplayTimer() {
    this.displayTimer = setTimeout(() => {
      this.display();
    }, 1000);
  }

  stopDisplayTimer() {
    clearTimeout(this.displayTimer);
  }

  display() {
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

  hide() {
    this.previewEl.rmClass('active');
  }

  position() {
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

  addListeners() {
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
      el
        .on('mouseenter', () => {
          clearTimeout(timer);
        })
        .on('mouseleave', () => {
          timer = setTimeout(() => {
            this.stopDisplayTimer();
            this.hide();
          }, 0);
        });
    });
  }
}
