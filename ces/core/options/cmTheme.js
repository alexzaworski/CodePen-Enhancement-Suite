var cmTheme = (function() {
  var rawElements = [];
  var elements =  [];
  var presets = [];
  var styleEl = document.createElement("style");
  var isLightTheme = false;
  var container = document.getElementById("controls");
  var saveButton = document.getElementById("save");
  var baseUIToggle = document.getElementById("base-ui");
  var fauxToggleLabels = document.getElementsByClassName("base-ui__label");
  var pageWrap = document.getElementById("page-wrap");
  var presetSelect = document.getElementById("presets");
  var revertButton = document.getElementById("revert");
  var saveInfo = document.getElementById("save-info");
  var lastSaved = false;
  var needsSave = false;
  var appendStyles = function() {
    document.head.appendChild(styleEl);
  };

  var updateStyles = function(needsSave) {
    styleEl.innerHTML = buildStyles();
  };

  var buildStyles = function() {
    var styles = "";
    elements.forEach(function(element) {
      styles += element.getStyleRule();
    });
    return styles;
  };

  var addElement = function(element) {
    elements.push(element);
  };

  var getElement = function(id) {
    var el;
    elements.some(function(element) {
      if (element.id === id) {
        el = element;
        return true;
      }
    });
    return el || false;
  };

  var getElements = function() {
    return elements;
  };

  var getContainerEl = function() {
    return container;
  };

  var setPageBackground = function() {
    pageWrap.classList.toggle("light", baseUIToggle.checked);
  };

  var handlefauxToggleLabelClick = function() {
    baseUIToggle.click();
  };

  var addGUIEventListeners = function() {
    revertButton.addEventListener("click", revert);

    saveButton.addEventListener("click", function() {
      stash();
      displaySaveTime();
    });

    baseUIToggle.addEventListener("click", function() {
      isLightTheme = baseUIToggle.checked;
      setPageBackground();
    });

    for (var i = 0; i < fauxToggleLabels.length; i++) {
      fauxToggleLabels[ i ].addEventListener("click", handlefauxToggleLabelClick);
    }

    presetSelect.addEventListener("change", function(e) {
      reset();
      buildElementsFromPreset();
    });
  };

  var displaySaveTime = function() {
    if (!lastSaved) {
      return;
    }
    var lastSavedEl = document.getElementById("last-saved");
    var newSaved = lastSavedEl.cloneNode(true);
    newSaved.innerHTML = "Saved @ " + lastSaved;
    lastSavedEl.parentNode.replaceChild(newSaved, lastSavedEl);
    saveInfo.classList.remove("save-info--hidden");
  };

  var drawGUI = function() {
    displaySaveTime();
    elements.forEach(function(element) {
      element.setupSelectEl();
      element.draw();
    });
  };

  var reset = function() {
    pubsub.reset();
    elements.forEach(function(element) {
      element.remove();
    });
    elements = [];
    styleEl.innerHTML = "";
  };

  var stash = function() {
    needsSave = false;
    window.onbeforeunload = null;

    lastSaved = String(new Date()).substr(4, 20);
    var elementStash = [];
    elements.forEach(function(element) {
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

    // Unfortunately this has to use local storage instead of sync storage.
    // This is due to the item size limit of 4096 bytes in sync storage.
    chrome.storage.local.set({
      "cmElements": elementStash,
      "cmCSS": buildStyles(),
      "cmIsLightTheme": isLightTheme,
      "cmLastSaved": lastSaved
    });
  };

  var revert = function() {
    location.reload();
  };

  var setupPresets = function(newPresets) {
    presets = newPresets;
    Object.keys(presets).forEach(function(preset) {
      var option = document.createElement("option");
      option.innerHTML = preset;
      presetSelect.appendChild(option);
    });
  };

  var buildElements = function() {
    chrome.storage.local.get("cmElements", function(response) {
      if (!response.cmElements) {
        buildElementsFromPreset();
      } else {
        initElements(response.cmElements);
        chrome.storage.local.get("cmLastSaved", function(response) {
          lastSaved = response.cmLastSaved;
          chrome.storage.local.get("cmIsLightTheme", function(response) {
            isLightTheme = response.cmIsLightTheme;
            initGUI();
          });
        });
      }
    });
  };

  var buildElementsFromPreset = function() {
    var preset = presets[ presetSelect.value ];
    initElements(preset.elements);
    isLightTheme = preset.light;
    initGUI();
  };

  var init = function(presets) {
    setupPresets(presets);
    addGUIEventListeners();
    buildElements();
  };

  var setBaseUIToggle = function() {
    baseUIToggle.checked = isLightTheme;
    setPageBackground();
  };

  var initElements = function(rawElements) {
    rawElements.forEach(function(element) {
      new CMElement(element);
    });
  };

  var initGUI = function() {
    setPageBackground();
    drawGUI();
    appendStyles();
    setBaseUIToggle();
  };

  return {
    init: init,
    addElement: addElement,
    getElement: getElement,
    getElements: getElements,
    updateStyles: updateStyles,
    getContainerEl: getContainerEl
  };
})();
