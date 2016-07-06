/*
* ---
* RECENT PENS TYPEAHEAD MODULE
* ---
*
* Adds a user's recent Pens to the external resource typeaheads
*
*/

var ces__recentPensTypeahead = (function(){
  "use strict";

  var $document = $(document);
  $document.ajaxSend(function( event, jqxhr, settings ) {
    if(settings.url.match(/(cdncss_data|cdnjs_data)/)) {
      settings.dataFilter = addPensToData;
    }
  });

  function addPensToData(data) {
    // do stuff
    return data;
  }
})();