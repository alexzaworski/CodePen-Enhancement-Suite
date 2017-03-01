/* global pubsub  CMElement */

var elementGlobals = [];
elementGlobals['Background'] = {
  selector: '.box, .editor .top-boxes, .CodeMirror-gutter-wrapper, body.project .editor-pane, body.project .editor',
  prop: 'background'
};

elementGlobals['Cursor'] = {
  selector: '.CodeMirror-cursor',
  prop: 'border-left-color'
};

elementGlobals['Default'] = {
  selector: '.CodeMirror pre, .box pre,.editor .top-boxes pre,.CodeMirror-gutter-wrapper pre',
  description: "when nothin' else applies"
};

elementGlobals['Keyword'] = {
  selector: '.cm-keyword',
  description: 'e.g. var, function'
};

elementGlobals['Atom'] = {
  selector: '.cm-atom',
  description: 'used for some CSS values and JS primitives (e.g. null, undefined)'
};

elementGlobals['HTML Atom'] = {
  selector: '.box-html .cm-atom',
  description: 'e.g. HTML entities'
};

elementGlobals['Definition'] = {
  selector: '.cm-def',
  description: 'e.g. @include, var foo'
};

elementGlobals['Variable'] = {
  selector: '.cm-variable',
  description: 'for already-defined variables'
};

elementGlobals['Variable 2'] = {
  selector: '.cm-variable-2',
  description: 'e.g. markdown lists, JS args, SCSS variables'
};

elementGlobals['Variable 3'] = {
  selector: '.cm-variable-3',
  description: 'used for CSS psuedo elements e.g. :before'
};

elementGlobals['Header'] = {
  selector: '.cm-header',
  description: 'used for Markdown headers and maybe other stuff'
};

elementGlobals['Number'] = {
  selector: '.cm-number'
};

elementGlobals['Property'] = {
  selector: '.cm-property',
  description: 'CSS properties, JS object properties'
};

elementGlobals['Attribute'] = {
  selector: '.cm-attribute',
  description: 'HTML attributes'
};

elementGlobals['Builtin'] = {
  selector: '.cm-builtin',
  description: 'used for CSS ID selectors'
};

elementGlobals['Qualifier'] = {
  selector: '.cm-qualifier',
  description: 'used for CSS class selectors'
};

elementGlobals['Operator'] = {
  selector: '.cm-operator',
  description: 'e.g. =, +, -'
};

elementGlobals['Meta'] = {
  selector: '.cm-meta',
  description: 'used for vendor prefixes'
};

elementGlobals['String Color'] = {
  selector: '.cm-string'
};

elementGlobals['Secondary String'] = {
  selector: '.cm-string-2',
  description: 'some CSS values'
};

elementGlobals['HTML Tag'] = {
  selector: '.cm-tag',
  description: 'tags in HTML'
};

elementGlobals['CSS Tag'] = {
  selector: '.box-css .cm-tag',
  description: 'element selectors in CSS'
};

elementGlobals['Tag Bracket'] = {
  selector: '.cm-tag.cm-bracket',
  description: 'angle brackets in HTML'
};

elementGlobals['Line Number'] = {
  selector: '.CodeMirror-linenumber'
};

elementGlobals['Gutter Marker'] = {
  selector: '.CodeMirror-guttermarker-subtle',
  description: 'e.g. those toggle arrows next to line numbers'
};

elementGlobals['Comment'] = {
  selector: '.cm-comment'
};

elementGlobals['Selected'] = {
  selector: '.cm-searching, .CodeMirror-focused .CodeMirror-selected, .CodeMirror-selected',
  description: 'used for highlighted text',
  prop: 'background-color'
};

window.cmTheme = (function () {
  var elements = [];
  var presets = [];
  var styleEl = document.createElement('style');
  var isLightTheme = false;
  var container = document.getElementById('controls');
  var saveButton = document.getElementById('save');
  var baseUIToggle = document.getElementById('base-ui');
  var fauxToggleLabels = document.getElementsByClassName('base-ui__label');
  var exportButton = document.getElementById('export-json');
  var importButton = document.getElementById('import-json');
  var importInput = document.getElementById('import-input');
  var pageWrap = document.getElementById('page-wrap');
  var presetSelect = document.getElementById('presets');
  var presetLoad = document.getElementById('load-preset');
  var revertButton = document.getElementById('revert');
  var saveInfo = document.getElementById('save-info');
  var lastSaved = false;

  var appendStyles = function () {
    document.head.appendChild(styleEl);
  };

  var updateStyles = function (shouldSetSave) {
    if (shouldSetSave && !window.onbeforeunload) {
      setUnload();
    }

    styleEl.innerHTML = buildStyles();
  };

  var buildStyles = function () {
    var styles = '';
    elements.forEach(function (element) {
      styles += element.getStyleRule();
    });
    return styles;
  };

  var addElement = function (element) {
    elements.push(element);
  };

  var getElement = function (id) {
    var el;
    elements.some(function (element) {
      if (element.id === id) {
        el = element;
        return true;
      }
    });
    return el || false;
  };

  var setUnload = function () {
    window.onbeforeunload = function () {
      return 'Your changes are NOT saved, if you continue they will be discarded.';
    };
  };

  var getElements = function () {
    return elements;
  };

  var getContainerEl = function () {
    return container;
  };

  var setPageBackground = function () {
    pageWrap.classList.toggle('light', baseUIToggle.checked);
  };

  var handlefauxToggleLabelClick = function () {
    baseUIToggle.click();
  };

  var addGUIEventListeners = function () {
    revertButton.addEventListener('click', revert);

    exportButton.addEventListener('click', function () {
      exportTheme();
    });

    importButton.addEventListener('click', function () {
      importInput.click();
    });

    importInput.addEventListener('change', function (e) {
      var file = importInput.files[0];
      var fr = new FileReader();
      fr.onload = function () {
        reset();
        buildElementsFromPreset(JSON.parse(fr.result));
      };
      fr.readAsText(file);
    });

    saveButton.addEventListener('click', function () {
      stash();
      displaySaveTime();
    });

    baseUIToggle.addEventListener('click', function () {
      isLightTheme = baseUIToggle.checked;
      setPageBackground();
    });

    for (var i = 0; i < fauxToggleLabels.length; i++) {
      fauxToggleLabels[i].addEventListener('click', handlefauxToggleLabelClick);
    }

    presetLoad.addEventListener('click', function () {
      setUnload();
      reset();
      buildElementsFromPreset(presets[presetSelect.value]);
    });
  };

  var displaySaveTime = function () {
    if (!lastSaved) {
      return;
    }
    var lastSavedEl = document.getElementById('last-saved');
    var newSaved = lastSavedEl.cloneNode(true);
    newSaved.innerHTML = 'Saved @ ' + lastSaved;
    lastSavedEl.parentNode.replaceChild(newSaved, lastSavedEl);
    saveInfo.classList.remove('save-info--hidden');
  };

  var drawGUI = function () {
    elements.forEach(function (element) {
      element.setupSelectEl();
      element.draw();
    });
  };

  var reset = function () {
    pubsub.reset();
    elements.forEach(function (element) {
      element.remove();
    });
    elements = [];
    styleEl.innerHTML = '';
  };

  var buildElementStash = function () {
    var elementStash = [];
    elements.forEach(function (element) {
      var toStash = {
        prettyName: element.prettyName,
        color: element.color,
        italic: element.italic,
        underline: element.underline,
        master: element.master.id
      };
      elementStash.push(toStash);
    });
    return elementStash;
  };

  var exportTheme = function () {
    var presetExport = {};
    presetExport.elements = buildElementStash();
    presetExport.light = isLightTheme;
    var dataStr = 'data:text/json;charset=utf-8,';
    dataStr += encodeURIComponent(JSON.stringify(presetExport));
    var a = document.createElement('a');
    a.href = dataStr;
    a.setAttribute('download', 'ces_theme.json');
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  };

  var stash = function () {
    window.onbeforeunload = null;

    lastSaved = String(new Date()).substr(4, 20);
    var elementStash = buildElementStash();

    // Unfortunately this has to use local storage instead of sync storage.
    // This is due to the item size limit of 4096 bytes in sync storage.
    chrome.storage.local.set({
      'cmElements': elementStash,
      'cmCSS': buildStyles(),
      'cmIsLightTheme': isLightTheme,
      'cmLastSaved': lastSaved
    });
  };

  var revert = function () {
    location.reload();
  };

  var setupPresets = function (newPresets) {
    presets = newPresets;
    Object.keys(presets).forEach(function (preset) {
      var option = document.createElement('option');
      option.innerHTML = preset;
      presetSelect.appendChild(option);
    });
  };

  var buildElements = function () {
    chrome.storage.local.get('cmElements', function (response) {
      if (!response.cmElements) {
        buildElementsFromPreset(presets[presetSelect.value]);
      } else {
        initElements(response.cmElements);
        chrome.storage.local.get('cmLastSaved', function (response) {
          lastSaved = response.cmLastSaved;
          displaySaveTime();
          chrome.storage.local.get('cmIsLightTheme', function (response) {
            isLightTheme = response.cmIsLightTheme;
            initGUI();
          });
        });
      }
    });
  };

  var setupElementGlobals = function (element) {
    var globalElement = elementGlobals[element.prettyName];
    element.selector = globalElement.selector;
    if (globalElement.description) { element.description = globalElement.description; }
    if (globalElement.prop) { element.prop = globalElement.prop; }
  };

  var buildElementsFromPreset = function (preset) {
    initElements(preset.elements);
    isLightTheme = preset.light;
    initGUI();
  };

  var init = function (presets) {
    setupPresets(presets);
    addGUIEventListeners();
    buildElements();
  };

  var setBaseUIToggle = function () {
    baseUIToggle.checked = isLightTheme;
    setPageBackground();
  };

  var initElements = function (rawElements) {
    rawElements.forEach(function (element) {
      setupElementGlobals(element);
      addElement(new CMElement(element));
    });
  };

  var initGUI = function () {
    setPageBackground();
    drawGUI();
    appendStyles();
    setBaseUIToggle();
  };

  return {
    init: init,
    getElement: getElement,
    getElements: getElements,
    updateStyles: updateStyles,
    getContainerEl: getContainerEl
  };
})();
