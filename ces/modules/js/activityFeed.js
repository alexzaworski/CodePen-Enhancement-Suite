/*
* ---
* ACTIVITY FEED MODULE
* ---
*
* Displays a visual notification when there's new items
* in the activity feed dropdown
*
*/

(function() {
  "use strict";
  var activityFeed;
  var $activityButton = $(".header-activity-button");

  // grabs current feed and ships it to the content script
  // to check against the stored feed
  $.get("/activity/header/", function(r) {
    if (!r.html) {
      return;
    }
    activityFeed = $(r.html);
    activityFeed.find(".activity-date").remove();
    activityFeed = activityFeed.html().replace(/\s/g, "");
    var checkActivityFeed = new CustomEvent("activity-feed", {detail: activityFeed});
    window.dispatchEvent(checkActivityFeed);
  });

  // listens for a new-activity event from the content script,
  // appends classes as appropriate.
  window.addEventListener("new-activity", function() {
    $activityButton.addClass("ces__new-notification").click(function() {
      $activityButton.removeClass("ces__new-notification");
      sendNewFeed();
    });
  });

  // updates stored feed with the current one
  var sendNewFeed = function() {
    var activityFeedUpdate = new CustomEvent("activity-feed-update", {detail: activityFeed});
    window.dispatchEvent(activityFeedUpdate);
    $activityButton.removeClass("ces__new-notification");
  };

})();
