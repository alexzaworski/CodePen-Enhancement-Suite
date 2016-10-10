/*
* ---
* DISTRACTION FREE MODE
* ---
*
* Adds an option to the "Change View" dropdown to enable
* distraction free mode (basically just slims down the UI a bit)
*
*/

CES_GLOBALS.REQUEST_EXTENSION_URL("modules/css/distractionFreeMode.css", function(url) {
  var $styleEl = $("<link>");
  var $head = $("head");
  var $button = $("#view-switcher-button");
  var $checkbox;
  $styleEl.attr({
    rel: "stylesheet",
    type: "text/css",
    href: url
  });

  $styleEl.one("load", function() {
    forceEditorsToAdjust();
  });

  var $distractionToggle = $("<div class='ces__fancy-checkbox__wrapper ces__clearfix'>");

  CES_GLOBALS.REQUEST_EXTENSION_URL("modules/html/distraction-free-mode.html", function(url) {
    $distractionToggle.load(url, function() {
      $(".editor-layout-buttons").before($distractionToggle);
      $checkbox = $("#distraction-free-mode");
      addListeners();
      var requestInitialState = new CustomEvent("request-distraction-free");
      window.dispatchEvent(requestInitialState);
    });
  });

  function addStyles() {
    $head.append($styleEl);
    forceEditorsToAdjust();
  }

  function removeStyles() {
    $styleEl.remove();
  }

  // Forces a resize to trigger which normalizes
  // any weirdness caused by adjusting editor widths
  function forceEditorsToAdjust() {
    CP.codeEditorResizeController.onWindowResize();
  }
  function addListeners() {
    $checkbox.on("change", function(e) {
      if ($checkbox.is(":checked")) {
        addStyles();
      } else {
        removeStyles();
      }

      if (e.originalEvent) {
        dispatchStatusEvent($checkbox.is(":checked"));
      }

    });
  }

  function dispatchStatusEvent(status) {
    var statusEvent = new CustomEvent("distraction-free-update", {detail: status});
    window.dispatchEvent(statusEvent);
  }

  window.addEventListener("distraction-free-enabled", function(e) {
    $checkbox.prop("checked", e.detail).change();
  });

});
