/*

Tiny, bespoke DOM manipulation lib since
loading something like jQuery seems excessive.

(if I had a dollar for every time some bespoke DOM
lib got outta hand...)

If this spirals out of control it's almost certainly
worth swapping to a more developed solution but we shouldn't
be doing much DOM stuff anyways.

API:

  ===================================================================
  EventBase (private, adds event helpers to a target)
  ===================================================================

  .on([String] event, [Function] fn)
    - Adds an event listener, returns self

  .off([String] event, [Function] fn)
    - Removes an event listener, returns self

  .onOff([String] event, [Function] fn)
    - Adds an event listener, returns a function that
      removes that listener

  .one([String] event, [Function] fn)
    - Adds an event listener that is removed after being
      fired once.

  ===================================================================
  NodeBase (private, wrapper class shared by Doc/El)
  ===================================================================

  .node
    - native dom node

  .get ([String] selector)
    - runs node.querySelector
    - returns instance of El

  .getAll ([String] selector)
    - runs node.querySelectorAll
    - returns array of Els

  .exists ([String] selector, [Boolean?] forceBool = false)
    - runs node.get
    - if node.get.node is undefined, returns false
    - otherwise if forceBool is false, returns instance of El
    - if forceBool is true, returns true

  ===================================================================
  Doc (public, extends NodeBase)
  ===================================================================

  .constructor ([Node?] document = window.document)
    - creates instance of NodeBase with document

  .create ([String] tag, [PlainObject?] attributes)
    - runs document.createElement
    - adds attributes, given in the form of { attribute: value, ... }
    - returns instance of El

  ===================================================================
  DOM (public, extends Doc. default export is an instance of DOM.)
  ===================================================================

  .body
    - instance of El with document.body as the node

  .window
    - instance of EventBase with the window object

  ===================================================================
  El (private, extends NodeBase, exposed via Doc)
  ===================================================================

  All methods return self (i.e. are chainable) unless otherwise noted.

  .node
    - native dom node

  .remove ()
    - removes node from the DOM

  .wrap ([El] wrapper)
    - wraps self.node with wrapper.node

  .clone ()
    - returns new instance of El with a clone of self.node

  .attr ([String|PlainObject] attributes, [String?] val)
    - sets attributes
    - accepts ("attribute", "value") or { attribute: "value", ...}
    - if attribute is a string and no value is specified, returns
      the value of that attribute.

  .css ([String|PlainObject] props, [String?] val)
    - sets style props
    - accepts ("property", "value") or { property: "value", ... }

  .addClass ([String] classNames)
    - adds one or more classes (space separated)

  .rmClass ([String] classNames)
    - removes one or more classes (space separated)

  .parent ()
    - returns new instance of El with self.node's parentNode

  .append ([El] el)
    - appends el.node to self.node

  .appendTo ([El] el)
    - appends self.node to el.node

  .after ([El] el) {
    - inserts el.node after self.node

  .width ([String?] val)
    - if val is specified, sets style.width to val
    - otherwise returns node.offsetWidth

  .height ([String?] val)
    - if val is specified, sets style.height to val
    - otherwise returns node.offsetHeight

  .html ([String?] text)
    - if text is specified, sets node.innerHTML to text
    - otherwise returns node.innerHTML

  .text ([String?] text)
    - if text is specified, sets node.innerText to text
    - otherwise returns node.innerText
*/

class EventBase {
  constructor (native) {
    this.native = native;
  }

  on (event, fn) {
    this.native.addEventListener(event, fn);
    return this;
  }

  off (event, fn) {
    this.native.removeEventListener(event, fn);
    return this;
  }

  onOff (event, fn) {
    this.on(event, fn);
    return () => { this.off(event, fn); };
  }

  one (event, fn) {
    const off = this.onOff(event, () => {
      fn();
      off();
    });
    return this;
  }
}

class NodeBase extends EventBase {
  constructor (node) {
    super(node);
    this.node = node;
  }

  get (selector) {
    return new El(this.node.querySelector(selector));
  }

  getAll (selector) {
    const nodes = this.node.querySelectorAll(selector);
    return [...nodes].map(node => new El(node));
  }

  exists (selector, forceBool = false) {
    const el = this.get(selector);
    if (!el.node) {
      return false;
    } else {
      return forceBool ? true : el;
    }
  }
}

export class Doc extends NodeBase {
  constructor (document = window.document) {
    super(document);
  }

  create (tag, attributes) {
    const el = new El(this.node.createElement(tag));
    if (attributes) {
      el.attr(attributes);
    }
    return el;
  }
}

class DOM extends Doc {
  constructor () {
    super(window.document);
    this.body = this.get('body');
    this.window = new EventBase(window);
  }
}

class El extends NodeBase {
  remove () {
    const { node } = this;
    node.parentNode.removeChild(node);
    return this;
  }

  wrap (wrapper) {
    const parent = this.parent();
    wrapper = wrapper.clone();
    parent.append(wrapper);
    wrapper.append(this);
    return this;
  }

  clone () {
    return new El(this.node.cloneNode());
  }

  attr (attributes, val) {
    const { node } = this;
    if (typeof attributes === 'string') {
      if (typeof val !== 'undefined') {
        node.setAttribute(attributes, val);
        return node;
      } else {
        return node.getAttribute(attributes);
      }
    } else {
      for (const attribute in attributes) {
        node.setAttribute(attribute, attributes[attribute]);
      }
      return this;
    }
  }

  css (props, val) {
    const { node } = this;
    if (typeof props === 'string') {
      node.style[props] = val;
    } else {
      for (const prop in props) {
        node.prop[prop] = props[prop];
      }
    }
    return this;
  }

  addClass (classNames) {
    classNames = classNames.split(' ');
    classNames.forEach(className => {
      this.node.classList.add(className);
    });
    return this;
  }

  rmClass (classNames) {
    classNames = classNames.split(' ');
    classNames.forEach(className => {
      this.node.classList.remove(className);
    });
    return this;
  }

  parent () {
    return new El(this.node.parentNode);
  }

  append (el) {
    this.node.appendChild(el.node);
    return this;
  }

  appendTo (el) {
    el.append(this);
    return this;
  }

  after (el) {
    const { nextSibling } = this.node;
    const { parentNode } = this.node;
    if (nextSibling) {
      parentNode.insertBefore(el.node, nextSibling);
    } else {
      parentNode.appendChild(el.node);
    }
    return this;
  }

  width (val) {
    return (typeof val === 'undefined')
      ? this.node.offsetWidth
      : this.css('width', val);
  }

  height (val) {
    return (typeof val === 'undefined')
      ? this.node.offsetHeight
      : this.css('height', val);
  }

  html (text) {
    const { node } = this;
    if (typeof text !== 'undefined') {
      node.innerHTML = text;
      return this;
    } else {
      return node.innerHTML;
    }
  }

  text (text) {
    const { node } = this;
    if (typeof text !== 'undefined') {
      node.innerText = text;
      return this;
    } else {
      return node.innerText;
    }
  }
}

export default new DOM();
