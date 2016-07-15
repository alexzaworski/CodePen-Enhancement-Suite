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

  var pens = [],
      document = $(document);

  $.get( location.protocol + "//codepen.io/" + initData.__user.username + "/public/feed", function(response){
    parsePenData(response);
  });

  function parsePenData(data) {
    var $data = $(data);
    $data.find("item").each(function(){
      var pen = {},
          $this = $(this);
      pen.name = $this.find("title").text().toLowerCase().replace(/\s/g, "-");
      pen.value = $this.find("link").text();
      pen.tokens = (function(){
        var possibleTokens = pen.name.toLowerCase().split(" ");
        var tokens = ["::"];
        $.each(possibleTokens, function(){
          if (this.length >= 4) {
            tokens.push(this);
          }
        });
        return tokens;
      })();

      pens.push(pen);
    });
  }

  $document.ajaxSend(function( event, jqxhr, settings ) {
    if(settings.url.match(/(cdncss_data|cdnjs_data)/)) {
      settings.dataFilter = addPensToData;
    }
  });

  function addPensToData(data) {
    data = JSON.parse(data);
    $.each(pens, function(){
      data.push(this);
    })
    return JSON.stringify(data);
  }
})();
