/*
* ---
* HIDE CUSTOM PROFILE CSS MODULE
* ---
*
* Disables custom CSS on a profile (imagine that!)
*
* Interacts with the Page Action popup as well as the profileCSSHandler
* content script in order to keep a running list of profiles that have their
* CSS disabled (stored in Chrome's storage).
*
*/

(function () {
  'use strict';
  var $style = $('style');
  var $head = $('head');
  var $window = $(window);
  // These events are fired by the profileCSSHandler content script
  $window.on('disable-css', function () {
    $style.remove();
  });
  $window.on('enable-css', function () {
    $head.append($style);
  });

  // Asks the content script for the status of the current profile's css
  var requestCSSEvent = new CustomEvent('request-css-event');
  window.dispatchEvent(requestCSSEvent);
})();
