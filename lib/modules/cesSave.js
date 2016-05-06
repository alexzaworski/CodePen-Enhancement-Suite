/*
* ---
* CES SAVE MODULE
* ---
*
* This module handles the actual saving of data to CdePen.
*
* Due to the multiple states that need to be tracked, it made sense
* to bring all of this logic into one place rather than have each module
* take care of saving itself.
*
*/

var ces__sav = (function(){
  //Stores settings before saving anything
  var currentPenSettings = initData.__pen;

  // In order to not trample on CodePen's POST requests,
  // we track whether or not there is an ouststanding
  // request to '/pen/save'
  var pendingSave = false;

  // We need some way to hook into the save requests.
  // Unfortunately waiting for a "pen-saved" event to fire
  // doesn't quite work out, since our responses end up 
  // firing *after* CodePen's.
  //
  // This modifies all outgoing requests to the '/pen/save' end point
  // and has them toggle the pendingSave variable.
  $.ajaxSetup({
    beforeSend: function(request, settings) {
      if (settings.url === "/pen/save") {
        
        // Since we're making use of the 'complete' callback
        // on ajax requests, we can't just overwrite everything.
        //
        // Instead, we'll only modify the request if it doesn't already
        // have a 'complete' callback queued up. If CodePen starts using
        // complete callbacks I'm gonna have a bad time. 
        if (!settings.complete) {
          pendingSave = true;
          settings.complete = function(response) {
            pendingSave = false;
            if ( response.status === 200 ) {
              currentPenSettings = response.responseJSON;
            }
          }
        }
      }
    }
  });

  // Kicks off our custom save function every time a
  // 'pen-saved' event gets fired. 
  u_onPenSave(cesSaveInit);
  function cesSaveInit() {

    // If there's an outstanding save request,
    // wait until it's done to avoid any interference.
    if (pendingSave) {
      $(document).ajaxComplete(function(event, request, settings){
        if (settings.url === "/pen/save") {
          $(document).unbind("ajaxComplete");
          cesSave();
        }
      })
    }

    // Otherwise we can just go ahead and do whatevs.
    else {
      cesSave();
    }
  }

  function cesSave() {

    var newEditorSettings = getNewEditorSettings();
    var newSlug = getNewSlug();

    // If there *is* something we ought to be saving,
    // but the data is somehow malformed, don't proceed with
    // trying to save... Just bail.
    //
    // This is a pretty damn gross way to write this out I think,
    // if anyone has a better idea I'm all ears.
    if ( ( newSlug && !slugValid() ) || ( newEditorSettings && !editorSettingsValid() )) {
      return;
    }

    // If we have a new slug, handle that first 'cause otherwise
    // when we reload the page we're gonna have problems
    if (newSlug) {

      // If we have new editor settings too, we'll want to save those
      // immediately after saving the slug settings.
      //
      // We handle that via the callback on saveSlug()
      if (newEditorSettings) {
        saveSlug(newSlug, function(){

          // Now that we have a new slug, the URL for the Pen is going to
          // change if it's not set to Private.
          //
          // This means we need to update location.href instead of 
          // just calling location.reload();
          saveEditorSettings(newEditorSettings, function(){
            location.href = baseUrl + "pen/" + newSlug;
          })
        });
      }

      // If we're not also updating the editor settings,
      // we don't need a custom callback at all.
      else {
        saveSlug(newSlug);
      }
    }

    // If we don't need to handle a new slug, things get
    // a lot easier. We can just save the editor settings
    // and reload the page.
    else if (newEditorSettings) {
      saveEditorSettings(newEditorSettings);
    }
  }


  // Returns a JSON object with the new editor settings.
  // If the new settings are the same as the old ones, returns false.
  function getNewEditorSettings() {

      var oldEditorSettings = currentPenSettings.editor_settings;
      var newEditorSettings = $.extend(true, {}, oldEditorSettings);

      newEditorSettings.theme = $("#editor-theme :checked").val();
      newEditorSettings.font_size = $("#font_size :checked").val();
      newEditorSettings.font_type = $("#font_type :checked").val();

      // If the selected theme is the same as the one we initialized with,
      // we don't need to do anything here so we can bail early.
      if ( JSON.stringify(newEditorSettings) == JSON.stringify(oldEditorSettings) ) {
        return false;
      }
      return newEditorSettings;
  }


  // Checks to see if the editor settings are valid.
  // For the most part, the only reason saving settings
  // is gonna fail is if the user isn't using HTTPS.
  // 
  // This is because CodePen forwards insecure settings requests to
  // a secure domain, which then leads to cross-origin errors.
  // 
  // To combat that, we throw an error client-side and ask the user to reload
  // the page over HTTPS (and even give 'em a link, how nice are we?)
  function editorSettingsValid() {
    if (!u_isHttps()) {
      var httpsUrl = location.href.replace("http://", "https://");
      var httpsLink = "<a href='" + httpsUrl + "'>Reload this page over HTTPS.</a>";
      u_throwErrorModal("Whoops! You need to be browsing over HTTPS for editor settings to work.<br><br>"+httpsLink);
      return false; 
    }
    return true;
  }

  // Nothing fancy here. Makes the literal POST request to save editor settings,
  // then makes sure that the page is refreshed so the changes are actually visible.
  function saveEditorSettings(newEditorSettings, callback = function(){ location.reload(); }) {
    u_CP("/" + initData.__user.username + "/settings/save/editor", "editor_settings", newEditorSettings, function(response){
      if (response.status === 200 ) {
        callback();
      }
      else {
        u_throwErrorModal("Uh oh. Those editor settings failed to save. CodePen doesn't know why, I don't know why, you don't know why (well, maybe you do?). It's a bad time.");
        return false;
      }
    });
  }

  // Returns the user's custom slug from the input in the settings modal.
  // If it hasn't changed, returns false.
  function getNewSlug() {
    var newSlug = $("#pen-details-slug").val();
    if (newSlug === initData.__pen.slug_hash) {
      return false;
    }
    return newSlug;
  }

  // Quick check to see if there are any non-alphanumeric characters
  // in the slug. Technically they work, but custom slugs
  // have a tendency to cause 500 errors and this mitigates that to a large degree.
  function slugValid() {
    var newSlug = $("#pen-details-slug");
    if (newSlug[0].validity.patternMismatch) {
      u_throwErrorModal("Sorry, that slug appears to be invalid. Please use only alphanumeric characters.");
      return false;
    }
    return true;
  }

  // Attempts to save the slug and then refresh the page at the new URL. If the request
  // throws an error we'll let the user know... The most common cause that I've found
  // is a duplicate slug, but it's really hard to say what actually went down.
  function saveSlug(newSlug, callback = function(){location.href = baseUrl + "pen/" + newSlug;}) {
    var newPenSettings = $.extend(true, {}, currentPenSettings);
    newPenSettings.slug_hash = newSlug;
    u_CP("/pen/save", "pen", newPenSettings, function(response){
      if ( response.status === 200 ) {
        callback();
      }
      else {
        u_throwErrorModal("CodePen didn't like that slug. It's likely a duplicate, but it may be a different problem entirely. But somethin' for sure broke. Hope this helps.");
      }
    });
  }
})();
