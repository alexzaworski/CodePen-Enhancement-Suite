var CMElement = function(options) {
  cmTheme.addElement(this);
  this.prop = options.prop || "color";
  this.hideTypeControls = (this.prop !== "color");
  this.prettyName = options.prettyName;
  this.selector = options.selector;
  this.color = options.color;
  this.description = options.description || false;
  this.master = cmTheme.getElement(options.master) || false;
  this.underline = options.underline || false;
  this.italic = options.italic || false;
  this.id = this.prettyName.toLowerCase().replace(/\s/g, "_");
  this.setupElements();
  if (this.master) {
    this.syncTo(this.master);
  }
};

CMElement.prototype.getStyleRule = function() {
  var styles = this.selector + "{";
  styles += this.prop + ":" + this.color + ";";
  if (this.italic) {
    styles += "font-style:italic;";
  }
  if (this.underline) {
    styles += "text-decoration:underline;";
  }
  styles += "}";
  return styles;
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
  cmTheme.getElements().forEach(function(element) {
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
  var svg = this.buildSVGIcon("gear");
  settingsEl.appendChild(svg);
  this.settingsEl = settingsEl;
};

CMElement.prototype.buildSVGIcon = function(id) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + id);
  svg.appendChild(use);
  return svg;
};

// sets up the italic/underline toggles. The `control`
// param should either be "italic" or "underline".
CMElement.prototype.setupFontControlEl = function(control) {
  // Todo: move over to eslint 'cause this sucks lol
  /* jscs: disable requireDotNotation */
  /* jshint sub: true */
  var controlEl = this.buildSVGIcon(control);
  controlEl.classList.add("cmEl__font-control");
  if (this[control]) {
    controlEl.classList.add("active");
  }
  controlEl.addEventListener("click", function() {
    this[control] = !this[control];
    controlEl.classList.toggle("active", this["control"]);
    cmTheme.updateStyles();
  }.bind(this));
  this[control + "El"] = controlEl;
  /* jshint sub: false */
  /* jscs: enable requireDotNotation */
};

CMElement.prototype.setupFontEl = function() {
  var fontEl = document.createElement("div");
  this.setupFontControlEl("italic");
  this.setupFontControlEl("underline");
  fontEl.classList.add("cmEl__font-controls");
  fontEl.appendChild(this.italicEl);
  fontEl.appendChild(this.underlineEl);
  this.fontEl = fontEl;
};

CMElement.prototype.setupElements = function() {
  this.setupInputEl();
  this.setupHeadingEl();
  this.setupSettingsEl();
  this.setupLabelEl();
  this.setupDescriptionEl();
  if (!this.hideTypeControls) {
    this.setupFontEl();
  }
  this.updateColor(this.color);
};

CMElement.prototype.draw = function() {
  var advWrapper = document.createElement("div");
  advWrapper.classList.add("cmEl__advanced");
  if (this.descriptionEl) {
    advWrapper.appendChild(this.descriptionEl);
  }
  if (this.fontEl) {
    advWrapper.appendChild(this.fontEl);
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
  cmTheme.getContainerEl().appendChild(wrapper);
  this.wrapper = wrapper;
};

CMElement.prototype.remove = function() {
  this.wrapper.parentNode.removeChild(this.wrapper);
};
