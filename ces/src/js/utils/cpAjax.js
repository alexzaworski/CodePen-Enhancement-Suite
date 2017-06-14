import dom from './dom';

class CPAjax {
  constructor() {
    this.csrf = dom.get('meta[name=csrf-token]').attr('content');
    this.types = {
      form: 'application/x-www-form-urlencoded; charset=UTF-8',
      json: 'application/json;charset=utf-8'
    };

    this.baseURL = `${location.origin}/`;
  }

  headers(type) {
    const headers = new Headers();
    headers.set('X-CSRF-Token', this.csrf);
    headers.set('Content-Type', this.types[type]);
    return headers;
  }

  setupBody(type, body) {
    if (type === 'form') {
      let data = '';
      for (const key in body) {
        const val = encodeURIComponent(body[key]);
        data += `${key}=${val}&`;
      }
      return data.slice(0, -1);
    } else if (type === 'json') {
      return JSON.stringify({ payload: body });
    } else {
      return body;
    }
  }

  post(url, settings = {}) {
    const { type = 'form', body = null } = settings;
    const headers = this.headers(type);
    const data = this.setupBody(type, body);

    return fetch(this.baseURL + url, {
      method: 'post',
      body: data,
      credentials: 'include',
      headers: headers
    });
  }
}

export default new CPAjax();
