 /* global cmTheme presets */
(function init () {
  'use strict';
  var appendPreviewHTML = function () {
    var previewURL = chrome.extension.getURL('core/options/preview.html');
    var previewEl = document.getElementById('preview');
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
      previewEl.innerHTML = xhr.responseText;
    };

    xhr.open('GET', previewURL);
    xhr.send();
  };

  appendPreviewHTML();
  cmTheme.init(presets);
})();
