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
  var $activityButton = $(".header-activity-button");

  // grabs current feed and ships it to the content script
  // to check against the stored feed
  $.get("/activity/header/", function(r) {
    if (!r.html) {
      return;
    }
    var activityArray = [];
    var $activityList = $(r.html).find(".activity-list .activity");

    $activityList.each(function(index, item) {
      var $item = $(item);
      activityArray.push({
        name: $item.find(".activity-name").text().replace(/\s/g, ""),
        action: $item.find(".activity-action").text().replace(/\s/g, ""),
        thing: $item.find(".activity-thing").text().replace(/\s/g, "")
      });
    });

    var activityJSON = JSON.stringify(activityArray);
    var checkActivityFeed = new CustomEvent("activity-feed", {detail: activityJSON});

    setUpNewActivityListener(activityJSON);
    window.dispatchEvent(checkActivityFeed);

  });

  // listens for a new-activity event from the content script,
  // appends classes as appropriate.
  var setUpNewActivityListener = function(activityJSON) {
    $(window).one("new-activity", function handleActivity() {
      $activityButton.addClass("ces__new-notification").one("click", function() {
        $activityButton.removeClass("ces__new-notification");
        sendNewFeed(activityJSON);
      });
    });
  };

  // updates stored feed with the current one
  var sendNewFeed = function(activityJSON) {
    var activityFeedUpdate = new CustomEvent("activity-feed-update", {detail: activityJSON});
    window.dispatchEvent(activityFeedUpdate);
    $activityButton.removeClass("ces__new-notification");
  };

})();
