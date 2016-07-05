/*
* ---
* EDITOR SETTINGS MODULE
* ---
*
* Creates an additional tab in the Pen Settings modal in the editor.
*
* Allows for control of things like editor theme/fonts/etc
* without leaving the editor at all.
*
*
*/

var ces__editorSettings = (function(){
  "use strict";
  var $document = $(document);
  // In order to not trample on CodePen's POST requests,
  // we track whether or not there is an ouststanding
  // request to '/pen/save'
  var pendingSave = false;
  // Grabs the inital settings for the editor so we can change 'em as necessary.
  var editorSettings = initData.__pen.editor_settings;

  // Markup is reconstructed from what CodePen was already using so that
  // I can just re-use their tab functionality.
  var $editorTab = $("<a id='settings-editor-tab'  href='#settings-editor' data-type='editor'>Editor</a>");
  var $editorSettingsContainer = $("<div class='settings' id='settings-editor'></div>");
  $("#settings-tabs").append($editorTab);


  // I wanted to hook into something with an ID rather than a class to append to,
  // so this just looks to the html settings container since that shouldn't change at all.
  $("#settings-html").parent().append($editorSettingsContainer);

  // For whatever reason, while the custom tab taggles *on* just fine,
  // it gets stuck in the active state. This fixes that. 
  //
  // It would be nice to not need to deal with any of this, so if someone has a fix
  // let me know and I'll gladly use it.
  $editorTab.siblings().click(function(){
    $editorTab.removeClass("active");
    $editorSettingsContainer.removeClass("active");
  });

  // This grabs the actual content for the editor settings,
  // and then places it into the container we created.
  //
  // Once it's fully loaded, it sets the active theme 
  // based on the init data.
  u_requestExtensionUrl("lib/html/editor-settings.html", function(response){
    $editorSettingsContainer.load(response, function(){
      $( "#" + editorSettings.theme).prop("checked", true);
      $( "#" + editorSettings.font_type).prop("selected", true);
      $( "#" + editorSettings.font_size).prop("selected", true);

      // Because of the redirect caused by saving a new Pen, the callback gets screwed up
      // when saving editor settings. The easiest way to fix this is to force people to save
      // first. Sorta sucks, but it works.
      if (initData.__pen.slug_hash === "") {
        $editorSettingsContainer.prepend("<p>Editor settings are only available once you've saved your Pen at least once. I know it's weird, I'm working on it :(</p>");
        $editorSettingsContainer.find("input, select, label").addClass("disabled");
        return;
      }

      // This module won't work over an insecure connection because it needs to hit
      // a secure endpoint. If the user is browsing over HTTP it'll throw a cross-origin
      // error and won't save.
      if (!u_isHttps()) {
        $editorSettingsContainer.find("input, select, label").addClass("disabled");
        var httpsMessage = "Hi! Looks like you're not currently using HTTPS. Editor settings will only work over a secure connection.";
        var httpsUrl = location.href.replace("http://", "https://");
        var httpsLink = "<a href='" + httpsUrl + "'>Reload over HTTPS?</a>";
        $editorSettingsContainer.prepend("<p><em>"+httpsMessage+"</em> "+httpsLink+"</p>");
      } 
    });
  })

  // Keeps track of whether or not CodePen is trying to save stuff already
  $document.ajaxSend(function( event, xhr, settings ){
    if (settings.url === "/pen/save") {
      pendingSave = true;
      settings.complete = function(response) {
        pendingSave = false;
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
      $document.ajaxComplete(function(event, request, settings){
        if (settings.url === "/pen/save") {
          $document.unbind("ajaxComplete");
          saveEditorSettings();
        }
      })
    }

    // Otherwise we can just go ahead and do whatevs.
    else {
      saveEditorSettings();
    }
  }

  // Returns a JSON object with the new editor settings.
  // If the new settings are the same as the old ones, returns false.
  function getNewEditorSettings() {

      var oldEditorSettings = editorSettings;
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
  function saveEditorSettings() {

    // Bails early if there's nothing to save or something is invalid
    var newEditorSettings = getNewEditorSettings();
    if (!newEditorSettings || !editorSettingsValid()) {
      return;
    }

    u_CP("/" + initData.__user.username + "/settings/save/editor", "editor_settings", newEditorSettings, function(response){
      if (response.status === 200 ) {
        location.reload();
      }
      else {
        u_throwErrorModal("Uh oh. Those editor settings failed to save. CodePen doesn't know why, I don't know why, you don't know why (well, maybe you do?). It's a bad time.");
        return false;
      }
    });
  }
})();
