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
* The CES Save module (cesSave.js) handles the actual sending of all data
* to CodePen as well as input validation.
*
*/

var ces__editorSettings = (function(){
  "use strict";

  // Grabs the inital settings for the editor so we can change 'em
  // as necessary.
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
  })


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
        $editorSettingsContainer.prepend("<p>Editor settings are only available once you've saved your Pen at least once.</p>");
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
})();
