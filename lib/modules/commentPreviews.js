/*
* ---
* COMMENT PREVIEW MODULE
* ---
*
* Adds a toggle underneath the comment box that renders markdown
* into HTML and displays it. Works on Pens as well as Posts.
*
*/


var commentPreviewModule = (function(){
    var $commentBox,
      $previewBox = $("<div class='block-comment-content module text'>"),
      $previewToggle = $("<div class='ces__fancy-checkbox__wrapper ces__clearfix'>"),
      $previewText = $("<div class='comment-text'>"),
      $submitButton = $("#submit"),
      $checkBox;


  // It's possible (though unlikely) that a user requests the Comment Drawer
  // before our event listeners are added. 
  // 
  // We handle this by checking if the submit button already exists when this
  // module is loaded. This check also handles the Details view and Posts pages,
  // which don't make an AJAX request to load up the comment box.
  if ($submitButton.length) {
    previewModuleInit();
  }
  else {
    $(document).ajaxComplete(function(event, request, settings){
      if (settings.url.match("assets\/details\/comment.js")) {
        waitForSubmitButton();
      }
    });
  }


  // Runs a loop until the submit button is part of the DOM, at which point
  // we can fully initialize the module (should happen nearly instantly)
  function waitForSubmitButton() {
    var waitForLoadLoop = requestAnimationFrame(submitButtonLoop);
    function submitButtonLoop() {
      $submitButton = $("#submit");
      if (!$submitButton.length) {
        requestAnimationFrame(submitButtonLoop);
      }
      else {
        previewModuleInit();
        cancelAnimationFrame(waitForLoadLoop);
      }
    }
  }


  function previewModuleInit() {
    addPreviewToggle();
    setUpCommentBox();
  }


  // Creates the actual toggle switch used to control whether or not
  // the preview is currently enabled.
  function addPreviewToggle() {
    u_requestExtensionUrl("lib/html/comment-preview-toggle.html", function(url){
      $previewToggle.load(url, function(){
        $submitButton.before($previewToggle);
        $previewToggle.click(handlePreviewClick);
      });
    });
  }


  // Adds some event listeners related to the comment box and prepares
  // the preview box by adding it to the DOM and hiding it
  function setUpCommentBox(){

    // Resets to the default state 
    // when a comment is submitted
    $submitButton.click(function(){
      $checkBox.prop("checked", false);
      showCommentBox();
    })

    $commentBox = $("#new-comment");
    $commentBox.after($previewBox);
    $previewBox
      .css("min-height", $commentBox.outerHeight())
      .css("margin-bottom", 0) // inherited from CodePen's module style, not appropriate here
      .append($previewText)
      .hide();
  }


  // Toggles between the preview box/comment box as appropriate
  function handlePreviewClick() {
    $checkBox = $previewToggle.find("input[type='checkbox']");
    $checkBox.prop("checked", !$checkBox.prop("checked"));
    if ($checkBox.prop('checked') === true ) {
      showPreview();
    }
    else {
      showCommentBox();
    }
    return false;
  }


  // Makes an AJAX call for the preview and writes it
  // to the preview box
  function showPreview() {
    getPreview(function(response){
      $commentBox.hide();
      $previewBox.show();
      $previewText.html(response);
    })
  }


  function showCommentBox() {
    $previewBox.hide();
    $commentBox.show();
  }


  // Uses CodePen's internal preoprocessor endpoint to render
  // markdown into HTML. 
  function getPreview(callback){
    var rawText = $commentBox.val();
    $.ajax({
      url: "/preprocessors",
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      data: encodeURI("html="+rawText+"&html_pre_processor=markdown"),
      complete: function(response){
        callback(JSON.parse(response.responseText).results.html);
      }
    });
  }
})();