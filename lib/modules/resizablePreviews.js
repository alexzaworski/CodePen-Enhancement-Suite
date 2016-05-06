/*
* ---
* RESIZE
* ---
*
* Adds a handle to adjust the size of Pen previews while in the Editor view.
*
* Only active when someone's using the Top layout since in the other layouts
* you can resize the window just by scaling the actual editors panel.
*
*/

var ces__resizablePreviews = (function(){

  var $document = $(document);

  u_requestExtensionUrl("lib/css/ces_responsive-previews.css", function(response){
    u_appendStylesheet(response);
  });

  var resizeBar = $("<div class='ces__resize-bar'>"),
      resultDiv = $("#result_div"),
      resizer = $("#width-readout"),
      isDragging = false,
      resizeDivWidthInitial,
      resizerTimeout,
      startX,
      offsetX = 0;

  // Starts an animation frame loop that waits for the
  // Pen to actually load before kicking things off. 
  var waitForLoadLoop = requestAnimationFrame(waitForLoad);
  function waitForLoad() {

    // It's pretty bad performance-wise to be constantly
    // rerunning this selector but it's the easiest way to determine
    // whether or not the Pen has actually loaded. Plus it should only
    // run like 3-4 times if everything goes ok.
    //
    // It would be better to subscribe to an event fired by CodePen's
    // internal pubhub model but I couldn't find an appropriate one.
    var iframeSource = $("iframe").attr('src');

    if (iframeSource === "") {
      requestAnimationFrame(waitForLoad);
    }
    else {
      $("#loading-text").remove();
      initResize();
      cancelAnimationFrame(waitForLoadLoop);
    }
  }

  function initResize() {

    // Because of some flexbox things that CodePen has going on we really
    // need a way to isolate the result div. But we also don't want to lose
    // all the styling that's going on there...
    //
    // To solve this we wrap the result div in a new div and move the 'result' class
    // (which is used for styling) off of result_div and onto our new wrapper.
    resultDiv.removeClass('result');
    resultDiv.wrap("<div id='ces__resize' class='result'>");

    // Once that's taken care of we append our custom resizer and 
    // attach the event listeners we need.
    resultDiv.after(resizeBar);
    resizeBar.mousedown(function(e){
      e.preventDefault();
      startDrag(e);
    });
  }

  function startDrag(e) {

    window.clearTimeout(resizerTimeout);
    resizer.addClass("visible");
    startX = e.pageX;
    resizeDivWidthInitial = resultDiv.width();
    resultDiv.css("pointerEvents","none");
    $document.mousemove(drag);
    $document.mouseup(stopDrag);
    requestAnimationFrame(animate);
    isDragging = true;
  }

  function drag(e) {
    offsetX = startX - e.pageX;
  }

  function stopDrag() {
    resizerTimeout = window.setTimeout(function(){
      resizer.removeClass("visible");
    }, 1000);
    resultDiv.css("pointerEvents","auto");
    $document.off('mousemove', drag);
    $document.off('mouseup', stopDrag);
    isDragging = false;
    offsetX = 0;
  }

  function animate() {
    if (isDragging) {
      var newWidth = resizeDivWidthInitial - offsetX;
      resultDiv.width(newWidth);
      clipResultDivWidth();
      resizer.html(resultDiv.width() + "px");
      requestAnimationFrame(animate);
    }
  }

  function clipResultDivWidth() {
    var width = resultDiv.width();
    var maxWidth = window.innerWidth - resizeBar.width();
    if ( width > maxWidth ) {
      resultDiv.width(maxWidth);
    }
    if ( width < 0 ) {
      resultDiv.width(0);
    }
  }
})();