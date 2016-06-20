/*
* ---
* INLINE JS LINTING MODULE
* ---
*
* Adds a "Lint" button to the JavaScript Editor
*
*/

var ces__inlineJSLint = (function(){
  "use strict";
  var $analyze = $("#analyze-js");
  var $lint = $("<button class='button button-medium mini-button tidy-code-button'>Lint</button>");
  $("#js-tidy-code-button").before($lint).before(" ");
  $lint.click(function(){
    $analyze.click();
  })
})();
