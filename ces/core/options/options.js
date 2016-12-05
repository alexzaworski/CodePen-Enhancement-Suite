(function() {
  "use strict";

  /*
  * VENDORY STUFF
  */

  // http://stackoverflow.com/a/9251169
  var escapeHTML = (function() {
    var escape = document.createElement("textarea");
    return function(html) {
      escape.textContent = html;
      return escape.innerHTML;
    };
  })();

  // https://gist.github.com/fatihacet/1290216
  var pubsub = {};
  (function(q) {
    var topics = {};
    var subUid = -1;
    q.subscribe = function(topic, func) {
      if (!topics[ topic ]) {
        topics[ topic ] = [];
      }
      var token = (++subUid).toString();
      topics[ topic ].push({
        token: token,
        func: func
      });
      return token;
    };

    q.publish = function(topic, args) {
      if (!topics[ topic ]) {
        return false;
      }
      setTimeout(function() {
        var subscribers = topics[ topic ];
        var len = subscribers ? subscribers.length : 0;
        while (len--) {
          subscribers[ len ].func(args);
        }
      }, 0);
      return true;

    };

    q.unsubscribe = function(token) {
      for (var m in topics) {
        if (topics[ m ]) {
          for (var i = 0, j = topics[ m ].length; i < j; i++) {
            if (topics[ m ][ i ].token === token) {
              topics[ m ].splice(i, 1);
              return token;
            }
          }
        }
      }
      return false;
    };
  }(pubsub));

  /*
  * ACTUAL OPTIONS STUFF
  */

  // Object for overall theme. Keeps elements in sync,
  // builds stylesheets, etc
  var cmTheme = {
    elements: [],
    styleEl: document.createElement("style"),
    isLightTheme: false,

    appendStyles: function() {
      document.head.appendChild(this.styleEl);
    },

    // Updates the content of the appended style tag.
    updateStyles: function(needsSave) {

      // Passed a parameter that dictates whether or not it
      // should trigger an onbeforeunload warning for unsaved content.
      if (needsSave && !this.needsSave) {
        this.setUnload();
      }
      this.styleEl.innerHTML = this.buildStyles();
    },

    // Concatonates all elements' style rules into one string
    buildStyles: function() {
      var styles = "";
      this.elements.forEach(function(element) {
        styles += element.getStyleRule();
      });
      return styles;
    },

    setUnload: function() {
      this.needsSave = true;
      window.onbeforeunload = function(e) {
        return "Your changes are NOT saved, if you continue they will be discarded.";
      };
    },

    // Saves all necessary data to browser storage for later retrieval
    stash: function() {
      this.needsSave = false;
      window.onbeforeunload = null;

      // Unfortunately this has to use local storage instead of sync storage.
      // This is due to the item size limit of 4096 bytes in sync storage.
      this.lastSaved = String(new Date()).substr(4);
      var elementStash = [];
      this.elements.forEach(function(element) {
        var toStash = {
          prettyName: element.prettyName,
          selector: element.selector,
          color: element.color,
          description: element.description,
          prop: element.prop,
          master: element.master.id
        };
        elementStash.push(toStash);
      });
      chrome.storage.local.set({"cmElements": elementStash});
      chrome.storage.local.set({"cmCSS": this.buildStyles()});
      chrome.storage.local.set({"cmIsLightTheme": this.isLightTheme});
      chrome.storage.local.set({"cmLastSaved": this.lastSaved});
    },

    revert: function() {
      location.reload();
    },

    addElement: function(element) {
      this.elements.push(element);
    },

    // Given an ID, retrieves an element and returns it
    getElement: function(id) {
      var el;
      this.elements.some(function(element) {
        if (element.id === id) {
          el = element;
        }
      });
      return el || false;
    },

    setupGUI: function() {
      this.container = document.getElementById("controls");
      this.revertButton = document.getElementById("revert");
      this.saveButton = document.getElementById("save");
      this.baseUIToggle = document.getElementById("base-ui");
      this.fauxLabels = document.getElementsByClassName("base-ui__label");
      this.pageWrap = document.getElementById("page-wrap");
    },

    addGUIEventListeners: function() {
      this.revertButton.addEventListener("click", function() {
        this.revert();
      }.bind(this));

      this.saveButton.addEventListener("click", function() {
        this.stash();
        this.displaySaveTime();
      }.bind(this));

      this.baseUIToggle.addEventListener("click", function() {
        this.isLightTheme = this.baseUIToggle.checked;
        if (!this.needsSave) {
          this.setUnload();
        }
        this.pageWrap.classList.toggle("light", this.baseUIToggle.checked);
      }.bind(this));

      // Couldn't figure out a better way to do this quickly,
      // should revisit at some point 'cause this is awfully janky...
      // Ideally wouldn't use JS at all
      for (var i = 0; i < this.fauxLabels.length; i++) {
        this.fauxLabels[ i ].addEventListener("click", function() {
          this.baseUIToggle.click();
        }.bind(this));
      }
    },

    displaySaveTime: function() {
      if (!this.lastSaved) {
        return;
      }
      var lastSaved = document.getElementById("last-saved");
      var newSaved = lastSaved.cloneNode(true);
      newSaved.innerHTML = "Saved @ " + this.lastSaved;
      lastSaved.parentNode.replaceChild(newSaved, lastSaved);
      document.getElementById("save-info").classList.remove("save-info--hidden");
    },

    drawGUI: function() {
      this.displaySaveTime();
      this.elements.forEach(function(element) {
        element.setupSelectEl();
        element.draw();
      });
    },

    init: function() {
      this.setupGUI();
      this.addGUIEventListeners();
      this.drawGUI();
      this.appendStyles();
      if (this.isLightTheme) {
        this.baseUIToggle.click();
      }
    }
  };

  var CMElement = function(options) {
    cmTheme.addElement(this);
    this.prop = options.prop || "color";
    this.prettyName = options.prettyName;
    this.selector = options.selector;
    this.color = options.color;
    this.description = options.description || false;
    this.master = cmTheme.getElement(options.master) || false;
    this.id = this.prettyName.toLowerCase().replace(/\s/g, "_");
    this.setupElements();
    if (this.master) {
      this.syncTo(this.master);
    }
  };

  CMElement.prototype.getStyleRule = function() {
    return (this.selector + "{" + this.prop + ":" + this.color + "} ");
  };

  CMElement.prototype.updateColor = function(color, themeNeedsSave) {
    themeNeedsSave = !!themeNeedsSave;
    this.color = color;
    this.inputEl.value = color;
    this.fauxEl.style.backgroundColor = color;
    pubsub.publish(this.id, color);
    cmTheme.updateStyles(themeNeedsSave);
  };

  CMElement.prototype.syncTo = function(master) {
    if (this.master) {
      pubsub.unsubscribe(this.token);
    }
    this.master = master;
    this.updateColor(master.color);
    this.token = pubsub.subscribe(master.id, function(color) {
      this.updateColor(color);
    }.bind(this));
  };

  CMElement.prototype.unSync = function() {
    if (!this.master) { return; }
    this.master = false;
    this.selectEl.value = "none";
    pubsub.unsubscribe(this.token);
  };

  CMElement.prototype.setupInputEl = function() {
    var fauxEl = document.createElement("div");
    fauxEl.classList.add("cmEl__fauxColor");
    this.fauxEl = fauxEl;
    var inputEl = document.createElement("input");
    inputEl.classList.add("cmEl__color");
    inputEl.type = "color";
    inputEl.value = this.color;
    inputEl.addEventListener("input", function() {
      this.unSync();
      this.updateColor(this.inputEl.value, true);
    }.bind(this));
    this.inputEl = inputEl;
    this.fauxEl.appendChild(this.inputEl);
  };

  CMElement.prototype.setupHeadingEl = function() {
    var headingEl = document.createElement("h2");
    headingEl.classList.add("cmEl__heading");
    headingEl.innerHTML = this.prettyName;
    headingEl.addEventListener("click", function() {
      this.inputEl.click();
    }.bind(this));
    this.headingEl = headingEl;
  };

  CMElement.prototype.setupDescriptionEl = function() {
    if (!this.description) {
      return;
    }
    var descriptionEl = document.createElement("p");
    descriptionEl.classList.add("cmEl__desc");
    descriptionEl.innerHTML = escapeHTML(this.description);
    this.descriptionEl = descriptionEl;
  };

  CMElement.prototype.setupLabelEl = function() {
    var labelEl = document.createElement("label");
    labelEl.htmlFor = this.id;
    labelEl.classList.add("cmEl__syncTo-label");
    labelEl.innerHTML = "Sync to:";
    this.labelEl = labelEl;
  };

  CMElement.prototype.setupSelectEl = function() {
    var selectEl = document.createElement("select");
    selectEl.id = this.id;
    selectEl.classList.add("cmEl__syncTo");
    selectEl.innerHTML = "<option value='none'>None</option>";
    cmTheme.elements.forEach(function(element) {
      if (element != this) {
        var option = document.createElement("option");
        option.value = element.id;
        if (this.master && element == this.master) {
          option.selected = true;
        }
        option.innerHTML = element.prettyName;
        selectEl.appendChild(option);
      }
    }.bind(this));
    selectEl.addEventListener("change", function(e) {
      var selection = cmTheme.getElement(this.selectEl.value);
      if (selection) {
        this.syncTo(selection);
      } else {
        this.unSync();
      }
    }.bind(this));
    this.selectEl = selectEl;
  };

  CMElement.prototype.setupSettingsEl = function() {
    var settingsEl = document.createElement("button");
    settingsEl.classList.add("cmEl__settings");
    settingsEl.addEventListener("click", function() {
      this.classList.toggle("active");
    });
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#gear");
    svg.appendChild(use);
    settingsEl.appendChild(svg);
    this.settingsEl = settingsEl;
  };

  CMElement.prototype.setupElements = function() {
    this.setupInputEl();
    this.setupHeadingEl();
    this.setupSettingsEl();
    this.setupLabelEl();
    this.setupDescriptionEl();
    this.updateColor(this.color);
  };

  CMElement.prototype.draw = function() {
    var advWrapper = document.createElement("div");
    advWrapper.classList.add("cmEl__advanced");
    if (this.descriptionEl) {
      advWrapper.appendChild(this.descriptionEl);
    }
    advWrapper.appendChild(this.labelEl);
    advWrapper.appendChild(this.selectEl);
    var wrapper = document.createElement("div");
    wrapper.id = "cmEl_" + this.id;
    wrapper.classList.add("cmEl");
    wrapper.appendChild(this.fauxEl);
    wrapper.appendChild(this.settingsEl);
    wrapper.appendChild(this.headingEl);

    wrapper.appendChild(advWrapper);
    cmTheme.container.appendChild(wrapper);
  };

  function buildBaseElements() {
    var cmBackground = new CMElement({
      prettyName: "Background",
      selector: ".box,.editor .top-boxes,.CodeMirror-gutter-wrapper",
      color: "#272825",
      prop: "background"
    });

    var cmCursor = new CMElement({
      prettyName: "Cursor",
      selector: ".CodeMirror-cursor",
      color: "#ffffff",
      prop: "border-left-color",
    });

    var cmDefault = new CMElement({
      prettyName: "Default",
      selector: ".box pre,.editor .top-boxes pre,.CodeMirror-gutter-wrapper pre",
      description: "when nothin' else applies",
      color: "#ffffff",
    });

    var cmKeyword = new CMElement({
      prettyName: "Keyword",
      selector: ".cm-keyword",
      color: "#FA2D7D",
      description: "e.g. var, function"
    });

    var cmAtom = new CMElement({
      prettyName: "Atom",
      selector: ".cm-atom",
      color: "#ae81ff",
      description: "used for some CSS values and JS primitives (e.g. null, undefined)"
    });

    var cmHTMLAtom = new CMElement({
      prettyName: "HTML Atom",
      selector: ".box-html .cm-atom",
      master: "atom",
      description: "e.g. HTML entities"
    });

    var cmDef = new CMElement({
      prettyName: "Definition",
      selector: ".cm-def",
      color: "#F79900",
      description: "e.g. @include, var foo"
    });

    var cmVariable = new CMElement({
      prettyName: "Variable",
      selector: ".cm-variable",
      color: "#71D7D0",
      description: "for already-defined variables"
    });

    var cmVariable2 = new CMElement({
      prettyName: "Variable 2",
      selector: ".cm-variable-2",
      color: "#AE81FF",
      description: "e.g. markdown lists, JS args, SCSS variables"
    });

    var cmVariable3 = new CMElement({
      prettyName: "Variable 3",
      selector: ".cm-variable-3",
      color: "#a6e22e",
      description: "used for CSS psuedo elements e.g. :before"
    });

    var cmHeader = new CMElement({
      prettyName: "Header",
      selector: ".cm-header",
      color: "#FA2D7D",
      description: "used for Markdown headers and maybe other stuff"
    });

    var cmNumber = new CMElement({
      prettyName: "Number",
      selector: ".cm-number",
      color: "#B78CFF",
    });

    var cmProperty = new CMElement({
      prettyName: "Property",
      selector: ".cm-property",
      color: "#71D7D0",
      description: "CSS properties, JS object properties"
    });

    var cmAttribute = new CMElement({
      prettyName: "Attribute",
      selector: ".cm-attribute",
      color: "#a6e22e",
      description: "HTML attributes"
    });

    var cmBuiltin = new CMElement({
      prettyName: "Builtin",
      selector: ".cm-builtin",
      master: "attribute",
      description: "used for CSS ID selectors"
    });

    var cmQualifier = new CMElement({
      prettyName: "Qualifier",
      selector: ".cm-qualifier",
      master: "attribute",
      description: "used for CSS class selectors"
    });

    var cmOperator = new CMElement({
      prettyName: "Operator",
      selector: ".cm-operator",
      color: "#FA2D7D",
      description: "e.g. =, +, -"
    });

    var cmMeta = new CMElement({
      prettyName: "Meta",
      selector: ".cm-meta",
      color: "#FA2D7D",
      description: "used for vendor prefixes"
    });

    var cmString = new CMElement({
      prettyName: "String Color",
      selector: ".cm-string",
      color: "#E9E07F",
    });

    var cmString2 = new CMElement({
      prettyName: "Secondary String",
      selector: ".cm-string-2",
      color: "#E9E07F",
      description: "some CSS values"
    });

    var cmTag = new CMElement({
      prettyName: "HTML Tag",
      selector: ".cm-tag",
      color: "#FA2D7D",
      description: "tags in HTML"
    });

    var cmCSSTag = new CMElement({
      prettyName: "CSS Tag",
      selector: ".box-css .cm-tag",
      color: "#f92672",
      description: "element selectors in CSS"
    });

    var cmTagBracket = new CMElement({
      prettyName: "Tag Bracket",
      selector: ".cm-tag.cm-bracket",
      color: "#ffffff",
      description: "angle brackets in HTML"
    });

    var cmLineNumber = new CMElement({
      prettyName: "Line Number",
      selector: ".CodeMirror-linenumber",
      color: "#575344",
    });

    var cmGutterMarker = new CMElement({
      prettyName: "Gutter Marker",
      selector: ".CodeMirror-guttermarker-subtle",
      description: "e.g. those toggle arrows next to line numbers",
      master: "line_number"
    });

    var cmComment = new CMElement({
      prettyName: "Comment",
      selector: ".cm-comment",
      master: "line_number"
    });

    var cmSelect = new CMElement({
      prettyName: "Selected",
      selector: ".cm-searching, .CodeMirror-focused .CodeMirror-selected, .CodeMirror-selected",
      color: "#414141",
      description: "annoyingly hard to demo here, used for highlighted text",
      prop: "background-color",
    });
  }

  chrome.storage.local.get("cmElements", function(response) {
    if (!response.cmElements) {
      buildBaseElements();
      cmTheme.init();
    } else {
      response.cmElements.forEach(function(element) {
        new CMElement(element);
      });
      chrome.storage.local.get("cmLastSaved", function(response) {
        cmTheme.lastSaved = response.cmLastSaved;
        chrome.storage.local.get("cmIsLightTheme", function(response) {
          cmTheme.isLightTheme = response.cmIsLightTheme;
          cmTheme.init();
        });
      });
    }
  });
})();
