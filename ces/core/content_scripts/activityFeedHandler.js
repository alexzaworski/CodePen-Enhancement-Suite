var activityFeedHandler = (function() {
  var storageId = "activity-feed-";
  var storageObj = {};

  // Listens for the activity feed markup which gets
  // passed by the injected script
  window.addEventListener("activity-feed", function(e) {
    var newFeed = e.detail;
    chrome.storage.local.get(storageId, function(r) {

      // if there's never been a feed set we can just initialize it here
      if (!r[storageId]) {
        storageObj[storageId] = newFeed;
        chrome.storage.local.set(storageObj);
      } else {

        // otherwise compare the stored feed with the current one
        handleFeeds(newFeed, r[storageId]);
      }
    });
  });

  var handleFeeds = function(newFeed, oldFeed) {
    if (newFeed == oldFeed) {
      return;
    } else {
      var hasNewActivity = new CustomEvent("new-activity");
      window.dispatchEvent(hasNewActivity);
    }
  };

  // appends usernames to storageId to accommodate people who
  // use multiple CodePen accounts
  window.addEventListener("init-data-ready", function(e) {
    storageId += e.detail.__user.username;
  });

  window.addEventListener("activity-feed-update", function(e) {
    storageObj[storageId] = e.detail;
    chrome.storage.local.set(storageObj);
  });
})();